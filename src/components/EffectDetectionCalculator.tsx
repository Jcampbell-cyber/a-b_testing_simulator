import { useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';

interface EffectDetectionCalculatorProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function EffectDetectionCalculator({ onBack, onNavigate }: EffectDetectionCalculatorProps) {
  const [metricType, setMetricType] = useState<'continuous' | 'binary'>('continuous');
  const [testType, setTestType] = useState<'two-sided' | 'one-sided'>('two-sided');
  const [alpha, setAlpha] = useState(0.05);
  const [power, setPower] = useState(0.8);
  const [sampleSizePerGroup, setSampleSizePerGroup] = useState(10000);
  const [numFlights, setNumFlights] = useState(2);
  const [sampleSizeMode, setSampleSizeMode] = useState<'per-group' | 'both'>('per-group');
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

  const calculateMDE = () => {
    const numComparisons = numFlights === 2 ? 1 :
      comparisonType === 'control' ? numFlights - 1 :
      (numFlights * (numFlights - 1)) / 2;
    const adjustedAlpha = alpha / numComparisons;
    const alphaTwoSided = testType === 'two-sided' ? adjustedAlpha / 2 : adjustedAlpha;
    const zAlpha = normalInverse(1 - alphaTwoSided);
    const zBeta = normalInverse(power);

    let variance = 1;
    let effectSizeCohen = 0;
    const totalN = sampleSizeMode === 'per-group' ? sampleSizePerGroup * numFlights / 2 : sampleSizePerGroup / 2;

    if (metricType === 'continuous') {
      variance = 2;
      effectSizeCohen = Math.sqrt(
        (variance * Math.pow(zAlpha + zBeta, 2)) / totalN
      );
    } else {
      variance = 2 * proportion * (1 - proportion);
      effectSizeCohen = Math.sqrt(
        (variance * Math.pow(zAlpha + zBeta, 2)) / totalN
      );
    }

    const absoluteMde = metricType === 'continuous'
      ? effectSizeCohen * stdev
      : effectSizeCohen * Math.sqrt(proportion * (1 - proportion));

    const relativeMde = metricType === 'continuous'
      ? (absoluteMde / mean) * 100
      : (absoluteMde / proportion) * 100;

    const mdeHalf = effectSizeCohen * Math.sqrt(2);
    const mdeDouble = effectSizeCohen / Math.sqrt(2);

    const absoluteMdeHalf = metricType === 'continuous'
      ? mdeHalf * stdev
      : mdeHalf * Math.sqrt(proportion * (1 - proportion));
    const relativeMdeHalf = metricType === 'continuous'
      ? (absoluteMdeHalf / mean) * 100
      : (absoluteMdeHalf / proportion) * 100;

    const absoluteMdeDouble = metricType === 'continuous'
      ? mdeDouble * stdev
      : mdeDouble * Math.sqrt(proportion * (1 - proportion));
    const relativeMdeDouble = metricType === 'continuous'
      ? (absoluteMdeDouble / mean) * 100
      : (absoluteMdeDouble / proportion) * 100;

    return {
      relativeMde,
      absoluteMde,
      relativeMdeHalf,
      absoluteMdeHalf,
      relativeMdeDouble,
      absoluteMdeDouble,
      adjustedAlpha,
    };
  };

  const result = calculateMDE();

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
          <h1 className="text-4xl font-bold text-white mb-2">Effect Detection Calculator</h1>
          <p className="text-gray-300 mb-8">
            Calculate the minimum detectable effect (MDE) for your test configuration
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-3">Sample Size Mode</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={sampleSizeMode === 'per-group'}
                        onChange={() => setSampleSizeMode('per-group')}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Per Group</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={sampleSizeMode === 'both'}
                        onChange={() => setSampleSizeMode('both')}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Across Both Groups</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    {sampleSizeMode === 'per-group' ? 'Sample Size Per Group' : 'Total Sample Size'}: {sampleSizePerGroup.toLocaleString()}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={sampleSizePerGroup}
                    onChange={(e) => setSampleSizePerGroup(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                  />
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
            </div>

            <div className="bg-gray-700 rounded-lg p-6 flex flex-col justify-start h-fit sticky top-8">
              <h2 className="text-2xl font-bold text-white mb-6">Minimum Detectable Effects</h2>
              <div className="space-y-4">
                <div className="bg-gray-600 rounded p-4">
                  <p className="text-gray-300 text-xs mb-2 font-semibold">Current Configuration</p>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">MDE Relative</p>
                      <p className="text-2xl font-bold text-blue-400">
                        ±{result.relativeMde.toFixed(2)}%
                      </p>
                      <p className="text-xs text-gray-400 mt-2">MDE Absolute</p>
                      <p className="text-lg font-bold text-blue-300 mt-1">
                        ±{metricType === 'continuous' ? result.absoluteMde.toFixed(2) : (result.absoluteMde * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-1">Effect Detection</p>
                      <p className="text-lg font-bold text-blue-300">
                        +{result.relativeMde.toFixed(2)}% relative
                      </p>
                      <p className="text-xs text-gray-200 mt-2">
                        {metricType === 'continuous'
                          ? `+${result.absoluteMde.toFixed(2)} absolute`
                          : `+${(result.absoluteMde * 100).toFixed(2)} pp`
                        }
                      </p>
                      <p className="text-xs text-gray-400 mt-2">Target Value</p>
                      <p className="text-sm text-blue-200 mt-1">
                        {metricType === 'continuous'
                          ? `${(mean + result.absoluteMde).toFixed(2)}`
                          : `${((proportion + result.absoluteMde) * 100).toFixed(2)}%`
                        }
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    {sampleSizeMode === 'per-group'
                      ? `${sampleSizePerGroup.toLocaleString()} per group`
                      : `${sampleSizePerGroup.toLocaleString()} total`
                    }
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <p className="text-gray-300 text-xs mb-2 font-semibold">Half Sample Size</p>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">MDE Relative</p>
                      <p className="text-2xl font-bold text-gray-300">
                        ±{result.relativeMdeHalf.toFixed(2)}%
                      </p>
                      <p className="text-xs text-gray-400 mt-2">MDE Absolute</p>
                      <p className="text-lg font-bold text-gray-300 mt-1">
                        ±{metricType === 'continuous' ? result.absoluteMdeHalf.toFixed(2) : (result.absoluteMdeHalf * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-1">Effect Detection</p>
                      <p className="text-lg font-bold text-gray-200">
                        +{result.relativeMdeHalf.toFixed(2)}% relative
                      </p>
                      <p className="text-xs text-gray-200 mt-2">
                        {metricType === 'continuous'
                          ? `+${result.absoluteMdeHalf.toFixed(2)} absolute`
                          : `+${(result.absoluteMdeHalf * 100).toFixed(2)} pp`
                        }
                      </p>
                      <p className="text-xs text-gray-400 mt-2">Target Value</p>
                      <p className="text-sm text-gray-200 mt-1">
                        {metricType === 'continuous'
                          ? `${(mean + result.absoluteMdeHalf).toFixed(2)}`
                          : `${((proportion + result.absoluteMdeHalf) * 100).toFixed(2)}%`
                        }
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    {sampleSizeMode === 'per-group'
                      ? `${Math.round(sampleSizePerGroup / 2).toLocaleString()} per group`
                      : `${Math.round(sampleSizePerGroup / 2).toLocaleString()} total`
                    }
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <p className="text-gray-300 text-xs mb-2 font-semibold">Double Sample Size</p>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">MDE Relative</p>
                      <p className="text-2xl font-bold text-green-400">
                        ±{result.relativeMdeDouble.toFixed(2)}%
                      </p>
                      <p className="text-xs text-gray-400 mt-2">MDE Absolute</p>
                      <p className="text-lg font-bold text-green-300 mt-1">
                        ±{metricType === 'continuous' ? result.absoluteMdeDouble.toFixed(2) : (result.absoluteMdeDouble * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-1">Effect Detection</p>
                      <p className="text-lg font-bold text-green-300">
                        +{result.relativeMdeDouble.toFixed(2)}% relative
                      </p>
                      <p className="text-xs text-gray-200 mt-2">
                        {metricType === 'continuous'
                          ? `+${result.absoluteMdeDouble.toFixed(2)} absolute`
                          : `+${(result.absoluteMdeDouble * 100).toFixed(2)} pp`
                        }
                      </p>
                      <p className="text-xs text-gray-400 mt-2">Target Value</p>
                      <p className="text-sm text-green-200 mt-1">
                        {metricType === 'continuous'
                          ? `${(mean + result.absoluteMdeDouble).toFixed(2)}`
                          : `${((proportion + result.absoluteMdeDouble) * 100).toFixed(2)}%`
                        }
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    {sampleSizeMode === 'per-group'
                      ? `${(sampleSizePerGroup * 2).toLocaleString()} per group`
                      : `${(sampleSizePerGroup * 2).toLocaleString()} total`
                    }
                  </p>
                </div>

                <div className="bg-gray-600 rounded p-3 text-xs text-gray-200 border-t border-gray-600">
                  <p className="font-semibold mb-1">Configuration</p>
                  <ul className="space-y-1 text-xs">
                    <li>Metric: {metricType}</li>
                    <li>Test: {testType}</li>
                    <li>α = {alpha.toFixed(3)}{numFlights > 2 ? ` (adjusted: ${result.adjustedAlpha.toFixed(4)})` : ''}, Power = {power.toFixed(2)}</li>
                    <li>Flights: {numFlights}</li>
                    {numFlights > 2 && <li>{comparisonType === 'control' ? `${numFlights - 1} comparisons to control` : `${(numFlights * (numFlights - 1)) / 2} pairwise comparisons`} (Bonferroni)</li>}
                  </ul>
                  {numFlights > 2 && (
                    <button
                      onClick={() => onNavigate('fwer')}
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs mt-2 transition-colors"
                    >
                      <Info className="w-3 h-3" />
                      <span>Learn about FWER</span>
                    </button>
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
