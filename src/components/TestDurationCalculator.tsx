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
  const [comparisonType, setComparisonType] = useState<'none' | 'control' | 'pairwise'>('none');

  const [mean, setMean] = useState(100);
  const [stdev, setStdev] = useState(20);
  const [proportion, setProportion] = useState(0.5);

  const normalInverse = (p: number): number => {
    if (p <= 0 || p >= 1) return 0;
    if (p === 0.5) return 0;

    const a = [
      -3.969683028665376e+01,
       2.209460984245205e+02,
      -2.759285104469687e+02,
       1.383577518672690e+02,
      -3.066479806614716e+01,
       2.506628277459239e+00
    ];
    const b = [
      -5.447609879822406e+01,
       1.615858368580409e+02,
      -1.556989798598866e+02,
       6.680131188771972e+01,
      -1.328068155288572e+01
    ];
    const c = [
      -7.784894002430293e-03,
      -3.223964580411365e-01,
      -2.400758277161838e+00,
      -2.549732539343734e+00,
       4.374664141464968e+00,
       2.938163982698783e+00
    ];
    const d = [
       7.784695709041462e-03,
       3.224671290700398e-01,
       2.445134137142996e+00,
       3.754408661907416e+00
    ];

    const pLow = 0.02425;
    const pHigh = 1 - pLow;

    let q: number, r: number;

    if (p < pLow) {
      q = Math.sqrt(-2 * Math.log(p));
      return (((((c[0]*q + c[1])*q + c[2])*q + c[3])*q + c[4])*q + c[5]) /
             ((((d[0]*q + d[1])*q + d[2])*q + d[3])*q + 1);
    } else if (p <= pHigh) {
      q = p - 0.5;
      r = q * q;
      return (((((a[0]*r + a[1])*r + a[2])*r + a[3])*r + a[4])*r + a[5]) * q /
             (((((b[0]*r + b[1])*r + b[2])*r + b[3])*r + b[4])*r + 1);
    } else {
      q = Math.sqrt(-2 * Math.log(1 - p));
      return -(((((c[0]*q + c[1])*q + c[2])*q + c[3])*q + c[4])*q + c[5]) /
              ((((d[0]*q + d[1])*q + d[2])*q + d[3])*q + 1);
    }
  };

  const calculateDuration = () => {
    const numComparisons = comparisonType === 'none' ? 1 :
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
      effectSize = absoluteMde;
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
                    Control Success Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    max="99.99"
                    step="0.01"
                    value={(proportion * 100).toFixed(2)}
                    onChange={(e) => setProportion(parseFloat(e.target.value) / 100)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded"
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

                <div className="mt-4">
                  <label className="block text-white font-semibold mb-3">Comparison Type</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={comparisonType === 'none'}
                        onChange={() => setComparisonType('none')}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">No correction</span>
                    </label>
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
                  {comparisonType !== 'none' && (
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
                  )}
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
                  <p className="text-gray-300 text-sm mb-1">Total Samples Needed (all flights)</p>
                  <p className="text-2xl font-bold text-gray-200">
                    {result.totalSamples.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">at {result.samplesPerDay.toLocaleString()} per day</p>
                  <p className="text-gray-400 text-xs mt-2">
                    {Math.ceil(result.totalSamples / numFlights).toLocaleString()} per flight
                  </p>
                </div>

                <div className="bg-gray-600 rounded p-4 text-sm text-gray-200 border-t border-gray-600">
                  <p className="font-semibold mb-2">MDE Details</p>
                  <p className="text-sm text-gray-200 mb-1">
                    <strong>{mdeValue.toFixed(2)}{mdeType === 'relative' ? '%' : ''}</strong> relative
                  </p>
                  <p className="text-sm text-gray-200">
                    <strong>{result.absoluteMde.toFixed(2)}</strong> absolute
                  </p>
                  {comparisonType !== 'none' && (
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

          <div className="mt-12 bg-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">How the Calculation Works</h2>

            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">Sample Size Calculation</h3>
                <p className="mb-3">
                  First, we calculate the required sample size per group using the power analysis formula:
                </p>
                <div className="bg-gray-900 rounded p-4 font-mono text-sm mb-3">
                  n = (Variance × (z_α + z_β)²) / (Effect Size)²
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  Where z_α and z_β are the critical values for your significance level and power. Variance depends on metric type (continuous uses 2, binary uses 2p(1-p)). The effect size is calculated from your MDE and metric parameters.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">Duration Formula</h3>
                <p className="mb-3">
                  Test duration is determined by how long it takes to collect the required sample size:
                </p>
                <div className="bg-gray-900 rounded p-4 font-mono text-sm mb-3">
                  Days Needed = (Sample Size per Group × Number of Flights) / Daily Traffic
                </div>
                <p className="text-sm text-gray-400">
                  The total sample size is calculated from the per-group requirement multiplied by the number of variants (flights) in your test. Then we divide by your daily traffic to estimate how many days the test must run.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">Traffic Distribution Options</h3>
                <ul className="space-y-3 ml-4">
                  <li className="text-sm">
                    <strong>Across All Flights:</strong> Daily traffic value is split evenly among all variants. For example, 10,000 daily users with 3 flights means ~3,333 per flight per day.
                  </li>
                  <li className="text-sm">
                    <strong>Per Flight Only:</strong> Daily traffic value applies to each flight individually. Use this when you have dedicated traffic pools for each variant.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">Key Factors Affecting Duration</h3>
                <ul className="space-y-2 ml-4 text-sm text-gray-400">
                  <li>
                    <strong>Smaller MDE:</strong> Requires larger sample size → longer test duration
                  </li>
                  <li>
                    <strong>Lower Traffic:</strong> Fewer daily conversions → longer test duration
                  </li>
                  <li>
                    <strong>More Variants:</strong> More comparisons needed → larger sample size → longer duration
                  </li>
                  <li>
                    <strong>Higher Power:</strong> More stringent requirements → larger sample size → longer duration
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">Multiple Comparison Impact</h3>
                <p className="text-sm mb-2">
                  With multiple flights, Bonferroni correction requires a stricter significance threshold. This increases the sample size needed by a factor roughly proportional to the number of comparisons.
                </p>
                <p className="text-sm text-gray-400">
                  Example: Testing 3 variants with pairwise comparisons (3 comparisons total) roughly triples your duration compared to a 2-variant test.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">Practical Considerations</h3>
                <ul className="space-y-2 ml-4 text-sm text-gray-400">
                  <li>Longer tests have lower risk of being affected by external events or temporal patterns</li>
                  <li>Shorter tests reduce time-to-insight but have less data to work with</li>
                  <li>Consider business constraints: Can you wait 60 days? Can you spare the traffic? Are seasonal factors a concern?</li>
                  <li>High traffic or large expected effects can dramatically reduce test duration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
