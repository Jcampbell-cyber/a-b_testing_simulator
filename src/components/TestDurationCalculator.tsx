import { useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';

interface TestDurationCalculatorProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function TestDurationCalculator({ onBack, onNavigate }: TestDurationCalculatorProps) {
  const [metricType, setMetricType] = useState<'continuous' | 'binary'>('continuous');
  const [testType, setTestType] = useState<'two-sided' | 'one-sided'>('two-sided');
  const [alpha, setAlpha] = useState(0.05);
  const [power, setPower] = useState(0.8);
  const [mdeType, setMdeType] = useState<'relative' | 'absolute'>('relative');
  const [mdeValue, setMdeValue] = useState(5);
  const [dailyUnits, setDailyUnits] = useState(10000);
  const [trafficSplit, setTrafficSplit] = useState<'both' | 'one'>('both');
  const [numFlights, setNumFlights] = useState(2);
  const [comparisonType, setComparisonType] = useState<'control' | 'pairwise'>('control');

  const [mean, setMean] = useState(100);
  const [stdev, setStdev] = useState(20);
  const [proportion, setProportion] = useState(0.5);

  const normalInverse = (p: number) => {
    if (p <= 0 || p >= 1) return 0;
    if (Math.abs(p - 0.5) < 1e-10) return 0;

    const q = p < 0.5 ? p : 1 - p;
    const r = Math.sqrt(Math.log(1 / (q * q)));
    const a = 2.506628277459 + 24.06141414949 * r + 0.001707092 * Math.pow(r, 3);
    const b = 1.825329 * r + 29.7 + 0.001707092 * r;
    const t = r - (2.784944 * r + 2.06 - 0.5641 * r) / b;

    return p < 0.5 ? -t : t;
  };

  const calculateDuration = () => {
    const numComparisons = numFlights === 2 ? 1 :
      comparisonType === 'control' ? numFlights - 1 :
      (numFlights * (numFlights - 1)) / 2;
    const adjustedAlpha = alpha / numComparisons;
    const alphaTwoSided = testType === 'two-sided' ? adjustedAlpha / 2 : adjustedAlpha;
    const zAlpha = normalInverse(1 - alphaTwoSided);
    const zBeta = normalInverse(power);

    let effectSize = 0;
    let variance = 1;
    let absoluteMde = 0;

    if (metricType === 'continuous') {
      if (mdeType === 'absolute') {
        absoluteMde = mdeValue;
      } else {
        absoluteMde = (mdeValue / 100) * mean;
      }
      effectSize = absoluteMde / stdev;
      variance = 2;
    } else {
      if (mdeType === 'absolute') {
        absoluteMde = mdeValue / 100;
      } else {
        absoluteMde = (mdeValue / 100) * proportion;
      }
      effectSize = absoluteMde / Math.sqrt(proportion * (1 - proportion));
      variance = 2 * proportion * (1 - proportion);
    }

    const samplesPerGroup = Math.ceil(
      (variance * Math.pow(zAlpha + zBeta, 2)) / Math.pow(effectSize, 2)
    );

    const totalSamples = samplesPerGroup * numFlights;
    const samplesPerDay = trafficSplit === 'both' ? dailyUnits : (dailyUnits * numFlights) / 2;
    const daysNeeded = Math.ceil(totalSamples / samplesPerDay);

    return { daysNeeded, totalSamples, samplesPerDay, absoluteMde, effectSize, adjustedAlpha };
  };

  const result = calculateDuration();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </button>

        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-white mb-2">Test Duration Calculator</h1>
          <p className="text-gray-300 mb-8">
            Estimate how long your test needs to run to reach statistical significance
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-3">Metric Type</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={metricType === 'continuous'}
                        onChange={() => setMetricType('continuous')}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Continuous</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={metricType === 'binary'}
                        onChange={() => setMetricType('binary')}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Binary</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">Test Type</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={testType === 'two-sided'}
                        onChange={() => setTestType('two-sided')}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Two-sided</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={testType === 'one-sided'}
                        onChange={() => setTestType('one-sided')}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">One-sided</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-3">
                    Significance Level (α): {alpha.toFixed(3)}
                  </label>
                  <input
                    type="range"
                    min="0.01"
                    max="0.2"
                    step="0.01"
                    value={alpha}
                    onChange={(e) => setAlpha(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">
                    Power (1 - β): {power.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="0.99"
                    step="0.01"
                    value={power}
                    onChange={(e) => setPower(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {numFlights > 2 && (
                <div>
                  <label className="block text-white font-semibold mb-3">Comparison Type</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={comparisonType === 'control'}
                        onChange={() => setComparisonType('control')}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Compare to control ({numFlights - 1} comparisons)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={comparisonType === 'pairwise'}
                        onChange={() => setComparisonType('pairwise')}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Pairwise ({(numFlights * (numFlights - 1)) / 2} comparisons)</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-xs text-gray-400">
                      Bonferroni adjusted α: {(alpha / (comparisonType === 'control' ? numFlights - 1 : (numFlights * (numFlights - 1)) / 2)).toFixed(4)}
                    </p>
                    <button
                      onClick={() => onNavigate('fwer')}
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs transition-colors"
                      title="Learn more about FWER correction"
                    >
                      <Info className="w-3 h-3" />
                      <span>Learn more</span>
                    </button>
                  </div>
                </div>
              )}

              {metricType === 'continuous' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Control Mean
                    </label>
                    <input
                      type="number"
                      value={mean}
                      onChange={(e) => setMean(parseFloat(e.target.value) || 0)}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Standard Deviation
                    </label>
                    <input
                      type="number"
                      min="0.01"
                      value={stdev}
                      onChange={(e) => setStdev(Math.max(0.01, parseFloat(e.target.value) || 1))}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                    />
                  </div>
                </div>
              )}

              {metricType === 'binary' && (
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Control Proportion: {(proportion * 100).toFixed(2)}%
                  </label>
                  <input
                    type="range"
                    min="0.01"
                    max="0.99"
                    step="0.01"
                    value={proportion}
                    onChange={(e) => setProportion(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              <div className="border-t border-gray-700 pt-6">
                <label className="block text-white font-semibold mb-3">Minimum Detectable Effect (MDE)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Type</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          checked={mdeType === 'relative'}
                          onChange={() => setMdeType('relative')}
                          className="w-4 h-4"
                        />
                        <span className="text-gray-300 text-sm">Relative (%)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          checked={mdeType === 'absolute'}
                          onChange={() => setMdeType('absolute')}
                          className="w-4 h-4"
                        />
                        <span className="text-gray-300 text-sm">Absolute</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Value {mdeType === 'relative' ? '(%)' : metricType === 'continuous' ? '' : '(%)'}
                    </label>
                    <input
                      type="number"
                      min="0.01"
                      value={mdeValue}
                      onChange={(e) => setMdeValue(parseFloat(e.target.value) || 0)}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-3">
                    Daily Traffic: {result.samplesPerDay.toLocaleString()}
                  </label>
                  <input
                    type="number"
                    min="100"
                    value={dailyUnits}
                    onChange={(e) => setDailyUnits(Math.max(100, parseInt(e.target.value) || 100))}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {trafficSplit === 'both' ? 'across all flights' : 'per flight'}
                  </p>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">Traffic Distribution</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={trafficSplit === 'both'}
                        onChange={() => setTrafficSplit('both')}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300 text-sm">Across all flights</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={trafficSplit === 'one'}
                        onChange={() => setTrafficSplit('one')}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300 text-sm">Per flight only</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">
                  Number of Flights: {numFlights}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNumFlights(Math.max(2, numFlights - 1))}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="2"
                    value={numFlights}
                    onChange={(e) => setNumFlights(Math.max(2, parseInt(e.target.value) || 2))}
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded text-center"
                  />
                  <button
                    onClick={() => setNumFlights(numFlights + 1)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 flex flex-col justify-start h-fit sticky top-8">
              <h2 className="text-2xl font-bold text-white mb-6">Results</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-300 text-sm mb-1">Test Duration</p>
                  <p className="text-3xl font-bold text-blue-400">{result.daysNeeded}</p>
                  <p className="text-gray-400 text-xs mt-1">days</p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <p className="text-gray-300 text-sm mb-1">
                    {result.daysNeeded > 30 ? '~' : ''} {Math.ceil(result.daysNeeded / 7)} weeks
                  </p>
                  <p className="text-gray-400 text-xs">estimated duration</p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <p className="text-gray-300 text-sm mb-1">Total Samples Needed</p>
                  <p className="text-2xl font-bold text-gray-200">
                    {result.totalSamples.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">at {result.samplesPerDay.toLocaleString()} per day</p>
                </div>

                <div className="bg-gray-600 rounded p-4 text-sm text-gray-200 border-t border-gray-600">
                  <p className="font-semibold mb-2">MDE Details</p>
                  <p className="text-sm text-gray-200 mb-1">
                    <strong>{mdeValue.toFixed(2)}{mdeType === 'relative' ? '%' : ''}</strong> relative
                  </p>
                  <p className="text-sm text-gray-200">
                    <strong>{result.absoluteMde.toFixed(2)}</strong> absolute
                  </p>
                  {numFlights > 2 && (
                    <div className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-500">
                      <p>Bonferroni correction applied</p>
                      <p>Adjusted α: {result.adjustedAlpha.toFixed(4)}</p>
                      <p className="text-gray-400 mt-1">
                        {comparisonType === 'control' ? `${numFlights - 1} comparisons to control` : `${(numFlights * (numFlights - 1)) / 2} pairwise comparisons`}
                      </p>
                      <button
                        onClick={() => onNavigate('fwer')}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs mt-1 transition-colors"
                      >
                        <Info className="w-3 h-3" />
                        <span>Learn about FWER</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
