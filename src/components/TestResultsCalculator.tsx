import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface TestResultsCalculatorProps {
  onBack: () => void;
}

export function TestResultsCalculator({ onBack }: TestResultsCalculatorProps) {
  const [metricType, setMetricType] = useState<'continuous' | 'binary'>('continuous');
  const [testType, setTestType] = useState<'two-sided' | 'one-sided'>('two-sided');
  const [alpha, setAlpha] = useState(0.05);
  const [controlMean, setControlMean] = useState(100);
  const [treatmentMean, setTreatmentMean] = useState(105);
  const [controlStd, setControlStd] = useState(20);
  const [sampleSizeControl, setSampleSizeControl] = useState(5000);
  const [sampleSizeTreatment, setSampleSizeTreatment] = useState(5000);

  const calculateResults = () => {
    const diff = treatmentMean - controlMean;
    const pooledStd = Math.sqrt(
      ((sampleSizeControl - 1) * Math.pow(controlStd, 2) +
        (sampleSizeTreatment - 1) * Math.pow(controlStd, 2)) /
        (sampleSizeControl + sampleSizeTreatment - 2)
    );

    const se = pooledStd * Math.sqrt(1 / sampleSizeControl + 1 / sampleSizeTreatment);
    const tStat = diff / se;

    const criticalValue = testType === 'two-sided' ? 1.96 : 1.645;
    const pValue =
      testType === 'two-sided'
        ? 2 * (1 - normalCDF(Math.abs(tStat)))
        : 1 - normalCDF(tStat);

    const isSignificant = pValue < alpha;
    const ciLower = diff - criticalValue * se;
    const ciUpper = diff + criticalValue * se;

    return {
      diff,
      se,
      tStat,
      pValue,
      isSignificant,
      ciLower,
      ciUpper,
      percentDiff: (diff / controlMean) * 100,
    };
  };

  const normalCDF = (z: number) => {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = z < 0 ? -1 : 1;
    const absZ = Math.abs(z);

    const t = 1 / (1 + p * absZ);
    const t2 = t * t;
    const t3 = t2 * t;
    const t4 = t3 * t;
    const t5 = t4 * t;

    const y =
      1 -
      (a5 * t5 + a4 * t4 + a3 * t3 + a2 * t2 + a1 * t) * Math.exp(-absZ * absZ);
    return 0.5 * (1 + sign * y);
  };

  const result = calculateResults();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </button>

        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-white mb-2">Test Results Calculator</h1>
          <p className="text-gray-300 mb-8">
            Analyze your test results and calculate statistical significance
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
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
                  Control Mean: {controlMean.toFixed(2)}
                </label>
                <input
                  type="number"
                  value={controlMean}
                  onChange={(e) => setControlMean(parseFloat(e.target.value) || 0)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">
                  Treatment Mean: {treatmentMean.toFixed(2)}
                </label>
                <input
                  type="number"
                  value={treatmentMean}
                  onChange={(e) => setTreatmentMean(parseFloat(e.target.value) || 0)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">
                  Standard Deviation: {controlStd.toFixed(2)}
                </label>
                <input
                  type="number"
                  min="0.1"
                  value={controlStd}
                  onChange={(e) => setControlStd(Math.max(0.1, parseFloat(e.target.value) || 1))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">
                  Control Sample Size: {sampleSizeControl.toLocaleString()}
                </label>
                <input
                  type="number"
                  min="10"
                  value={sampleSizeControl}
                  onChange={(e) => setSampleSizeControl(Math.max(10, parseInt(e.target.value) || 10))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">
                  Treatment Sample Size: {sampleSizeTreatment.toLocaleString()}
                </label>
                <input
                  type="number"
                  min="10"
                  value={sampleSizeTreatment}
                  onChange={(e) => setSampleSizeTreatment(Math.max(10, parseInt(e.target.value) || 10))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                />
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-white mb-6">Results</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-300 text-sm mb-1">Difference</p>
                  <p className={`text-3xl font-bold ${result.diff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {result.diff > 0 ? '+' : ''}{result.diff.toFixed(2)}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    ({result.percentDiff > 0 ? '+' : ''}{result.percentDiff.toFixed(2)}%)
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <p className="text-gray-300 text-sm mb-1">95% Confidence Interval</p>
                  <p className="text-2xl font-bold text-blue-400">
                    [{result.ciLower.toFixed(2)}, {result.ciUpper.toFixed(2)}]
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <p className="text-gray-300 text-sm mb-1">P-value</p>
                  <p className={`text-2xl font-bold ${result.pValue < alpha ? 'text-green-400' : 'text-red-400'}`}>
                    {result.pValue.toFixed(6)}
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <p className={`text-lg font-bold ${result.isSignificant ? 'text-green-400' : 'text-red-400'}`}>
                    {result.isSignificant ? '✓ Statistically Significant' : '✗ Not Significant'}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">at α = {alpha.toFixed(3)}</p>
                </div>

                <div className="bg-gray-600 rounded p-3 text-xs text-gray-200 border-t border-gray-600">
                  <p className="font-semibold mb-1">Summary</p>
                  <p>
                    Based on {sampleSizeControl.toLocaleString()} control and{' '}
                    {sampleSizeTreatment.toLocaleString()} treatment samples
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
