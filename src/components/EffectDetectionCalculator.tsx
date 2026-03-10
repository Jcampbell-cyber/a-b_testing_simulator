import { useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom'; 

interface EffectDetectionCalculatorProps { 
  onNavigate: (page: string) => void;
}

 export function EffectDetectionCalculator({ onNavigate }: EffectDetectionCalculatorProps){
  const onBack = () => {
    window.location.href = '/';
  };  
  const [metricType, setMetricType] = useState<'continuous' | 'binary'>('continuous');
  const [testType, setTestType] = useState<'two-sided' | 'one-sided'>('two-sided');
  const [alpha, setAlpha] = useState(0.05);
  const [power, setPower] = useState(0.8);
  const [sampleSizePerGroup, setSampleSizePerGroup] = useState(10000);
  const [numFlights, setNumFlights] = useState(2);
  const [sampleSizeMode, setSampleSizeMode] = useState<'per-group' | 'both'>('per-group');
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

const calculateMDE = () => {
  const numComparisons = comparisonType === 'none' ? 1 :
    comparisonType === 'control' ? numFlights - 1 :
    (numFlights * (numFlights - 1)) / 2;

  const adjustedAlpha = alpha / numComparisons;
  const alphaTwoSided = testType === 'two-sided' ? adjustedAlpha / 2 : adjustedAlpha;
  const zAlpha = normalInverse(1 - alphaTwoSided);
  const zBeta = normalInverse(power);

  let variance = 1;
  let effectSizeCohen = 0;

  // Calculate effective sample size per group accounting for flight split
  let totalN;
  if (sampleSizeMode === 'per-group') {
    // User entered samples per group, but with multiple flights, 
    // each flight gets (sampleSizePerGroup / numFlights) samples
    totalN = sampleSizePerGroup / numFlights;
  } else {
    // User entered combined total across both groups
    totalN = (sampleSizePerGroup / 2) / numFlights;
  }

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
    : effectSizeCohen;

  const relativeMde = metricType === 'continuous'
    ? (absoluteMde / mean) * 100
    : (absoluteMde / proportion) * 100;

  const mdeHalf = effectSizeCohen * Math.sqrt(2);
  const mdeDouble = effectSizeCohen / Math.sqrt(2);

  const absoluteMdeHalf = metricType === 'continuous'
    ? mdeHalf * stdev
    : mdeHalf;

  const relativeMdeHalf = metricType === 'continuous'
    ? (absoluteMdeHalf / mean) * 100
    : (absoluteMdeHalf / proportion) * 100;

  const absoluteMdeDouble = metricType === 'continuous'
    ? mdeDouble * stdev
    : mdeDouble;

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
         <Helmet>
      <title>Effect Detection Calculator | Experiment Tools</title>
      <meta
        name="description"
        content="Calculate the minimum detectable effect (MDE) for your experiments, considering sample size, power, significance level, and multiple comparisons."
      />
    </Helmet>
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
                        <Link
                          to="/fwer"
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs transition-colors"
                        >
                          <Info className="w-3 h-3" />
                          <span>Learn more about FWER</span>
                        </Link>
                      </div>
                    )} 
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
                    <li>α = {alpha.toFixed(3)}{comparisonType !== 'none' ? ` (adjusted: ${result.adjustedAlpha.toFixed(4)})` : ''}, Power = {power.toFixed(2)}</li>
                    <li>Flights: {numFlights}</li>
                    {comparisonType !== 'none' && <li>{comparisonType === 'control' ? `${numFlights - 1} comparisons to control` : `${(numFlights * (numFlights - 1)) / 2} pairwise comparisons`} (Bonferroni)</li>}
                  </ul>
                  {comparisonType !== 'none' && (
                      <Link
                        to="/fwer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs transition-colors"
                        >
                        <Info className="w-3 h-3" />
                        <span>Learn more about FWER</span>
                      </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">How the Calculation Works</h2>

            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">Minimum Detectable Effect (MDE)</h3>
                <p className="mb-3">
                  The MDE is the smallest difference between variants that your test is statistically powered to detect. We calculate it by rearranging the standard sample size formula:
                </p>
                <div className="bg-gray-900 rounded p-4 font-mono text-sm mb-3">
                  MDE = (z_α + z_β) × SD / √n
                </div>
                <p className="text-sm text-gray-400">
                  Where SD is standard deviation, n is samples per group, and z values represent your significance and power thresholds.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">What This Tells You</h3>
                <ul className="space-y-3 ml-4">
                  <li className="text-sm">
                    <strong>Current Configuration:</strong> The MDE at your specified sample size, power, and significance level. This is the minimum real effect your test can reliably detect.
                  </li>
                  <li className="text-sm">
                    <strong>Half Sample Size:</strong> What you could detect with half the samples. Effects need to be larger when you collect fewer samples.
                  </li>
                  <li className="text-sm">
                    <strong>Double Sample Size:</strong> What you could detect with double the samples. Larger samples allow you to detect smaller, more subtle effects.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">Sample Size Impact</h3>
                <p className="text-sm mb-2">
                  MDE has an inverse square root relationship with sample size. This means:
                </p>
                <ul className="space-y-2 ml-4 text-sm text-gray-400">
                  <li>Doubling your sample size reduces MDE by ~29% (divide by √2)</li>
                  <li>Quadrupling your sample size reduces MDE by 50% (divide by 2)</li>
                  <li>To detect an effect half as large, you need 4x the sample size</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">Multiple Comparison Correction</h3>
                <p className="text-sm mb-2">
                  When testing multiple flights (variants), Bonferroni correction makes detection harder by requiring a stricter significance threshold:
                </p>
                <div className="bg-gray-900 rounded p-4 font-mono text-sm mb-3">
                  Adjusted α = α / number of comparisons
                </div>
                <p className="text-sm text-gray-400">
                  This increases the z-value used in the formula, which increases the MDE. Testing more variants means needing larger sample sizes to detect the same effects.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">Practical Use</h3>
                <p className="text-sm text-gray-400">
                  Use this calculator to understand trade-offs: With a fixed sample size, you can either:
                </p>
                <ul className="space-y-2 ml-4 text-sm text-gray-400 mt-2">
                  <li>Detect smaller effects by running longer (collecting more samples)</li>
                  <li>Detect larger effects right away with the samples you have</li>
                  <li>Determine if your expected effect size is realistic for your budget and timeline</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 bg-gray-700 rounded-lg p-6 text-center">
  <p className="text-gray-300 mb-4">
    Ready to analyse the results of your experiment? 
  </p>
            <Link
              to="/effect-detection-calc"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              Open Effect Detection Calculator →
            </Link>
          </div>
        </div>
      </div>
    </div>
        </div>
        </div>
  );
} 
  
