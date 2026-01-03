import { useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';

interface TestResultsCalculatorProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function TestResultsCalculator({ onBack, onNavigate }: TestResultsCalculatorProps) {
  const [metricType, setMetricType] = useState<'continuous' | 'binary'>('continuous');
  const [testType, setTestType] = useState<'two-sided' | 'one-sided'>('two-sided');
  const [alpha, setAlpha] = useState(0.05);
  const [numFlights, setNumFlights] = useState(2);
  const [comparisonType, setComparisonType] = useState<'none' | 'control' | 'pairwise'>('none');

  const [controlMean, setControlMean] = useState(100);
  const [treatmentMean, setTreatmentMean] = useState(105);
  const [controlStd, setControlStd] = useState(20);
  const [sampleSizeControl, setSampleSizeControl] = useState(5000);
  const [sampleSizeTreatment, setSampleSizeTreatment] = useState(5000);

  const [controlProportion, setControlProportion] = useState(0.5);
  const [treatmentProportion, setTreatmentProportion] = useState(0.52);
  const [sampleSizeControlBinary, setSampleSizeControlBinary] = useState(5000);
  const [sampleSizeTreatmentBinary, setSampleSizeTreatmentBinary] = useState(5000);

  const calculateResults = () => {
    const numComparisons = comparisonType === 'none' ? 1 :
      comparisonType === 'control' ? numFlights - 1 :
      (numFlights * (numFlights - 1)) / 2;
    const adjustedAlpha = alpha / numComparisons;

    if (metricType === 'continuous') {
      const diff = treatmentMean - controlMean;
      const pooledStd = Math.sqrt(
        ((sampleSizeControl - 1) * Math.pow(controlStd, 2) +
          (sampleSizeTreatment - 1) * Math.pow(controlStd, 2)) /
          (sampleSizeControl + sampleSizeTreatment - 2)
      );

      const se = pooledStd * Math.sqrt(1 / sampleSizeControl + 1 / sampleSizeTreatment);
      const tStat = diff / se;

      const alphaTwoSided = testType === 'two-sided' ? adjustedAlpha / 2 : adjustedAlpha;
      const criticalValue = Math.abs(normalInverse(1 - alphaTwoSided));
      const pValue =
        testType === 'two-sided'
          ? 2 * (1 - normalCDF(Math.abs(tStat)))
          : 1 - normalCDF(tStat);

      const isSignificant = pValue < adjustedAlpha;
      const ciLower = diff - criticalValue * se;
      const ciUpper = diff + criticalValue * se;

      return {
        type: 'continuous',
        diff,
        se,
        tStat,
        pValue,
        isSignificant,
        ciLower,
        ciUpper,
        percentDiff: (diff / controlMean) * 100,
        adjustedAlpha,
      };
    } else {
      const controlSuccesses = Math.round(controlProportion * sampleSizeControlBinary);
      const treatmentSuccesses = Math.round(treatmentProportion * sampleSizeTreatmentBinary);

      const pDiff = treatmentProportion - controlProportion;
      const pooledProp =
        (controlSuccesses + treatmentSuccesses) / (sampleSizeControlBinary + sampleSizeTreatmentBinary);
      const se = Math.sqrt(
        pooledProp *
          (1 - pooledProp) *
          (1 / sampleSizeControlBinary + 1 / sampleSizeTreatmentBinary)
      );

      const zStat = pDiff / se;
      const alphaTwoSided = testType === 'two-sided' ? adjustedAlpha / 2 : adjustedAlpha;
      const criticalValue = Math.abs(normalInverse(1 - alphaTwoSided));
      const pValue =
        testType === 'two-sided'
          ? 2 * (1 - normalCDF(Math.abs(zStat)))
          : 1 - normalCDF(zStat);

      const isSignificant = pValue < adjustedAlpha;
      const ciLower = pDiff - criticalValue * se;
      const ciUpper = pDiff + criticalValue * se;

      return {
        type: 'binary',
        pDiff,
        pValue,
        isSignificant,
        ciLower,
        ciUpper,
        controlProp: controlProportion,
        treatmentProp: treatmentProportion,
        percentDiff: (pDiff / controlProportion) * 100,
        zStat,
        adjustedAlpha,
      };
    }
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

  const result = calculateResults();

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
          <h1 className="text-4xl font-bold text-white mb-2">Test Results Calculator</h1>
          <p className="text-gray-300 mb-8">
            Analyze your test results and calculate statistical significance
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

              <div className="border-t border-gray-700 pt-6">
              </div>

              {metricType === 'continuous' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Control Mean
                      </label>
                      <input
                        type="number"
                        value={controlMean}
                        onChange={(e) => setControlMean(parseFloat(e.target.value) || 0)}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Treatment Mean
                      </label>
                      <input
                        type="number"
                        value={treatmentMean}
                        onChange={(e) => setTreatmentMean(parseFloat(e.target.value) || 0)}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Standard Deviation
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      value={controlStd}
                      onChange={(e) => setControlStd(Math.max(0.1, parseFloat(e.target.value) || 1))}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">
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
                      <label className="block text-white font-semibold mb-2">
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
                </>
              )}

              {metricType === 'binary' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Control Proportion: {(controlProportion * 100).toFixed(2)}%
                      </label>
                      <input
                        type="range"
                        min="0.01"
                        max="0.99"
                        step="0.01"
                        value={controlProportion}
                        onChange={(e) => setControlProportion(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Treatment Proportion: {(treatmentProportion * 100).toFixed(2)}%
                      </label>
                      <input
                        type="range"
                        min="0.01"
                        max="0.99"
                        step="0.01"
                        value={treatmentProportion}
                        onChange={(e) => setTreatmentProportion(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Control Sample Size: {sampleSizeControlBinary.toLocaleString()}
                      </label>
                      <input
                        type="number"
                        min="10"
                        value={sampleSizeControlBinary}
                        onChange={(e) => setSampleSizeControlBinary(Math.max(10, parseInt(e.target.value) || 10))}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Treatment Sample Size: {sampleSizeTreatmentBinary.toLocaleString()}
                      </label>
                      <input
                        type="number"
                        min="10"
                        value={sampleSizeTreatmentBinary}
                        onChange={(e) => setSampleSizeTreatmentBinary(Math.max(10, parseInt(e.target.value) || 10))}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="bg-gray-700 rounded-lg p-6 flex flex-col justify-start h-fit sticky top-8">
              <h2 className="text-2xl font-bold text-white mb-6">Results</h2>
              <div className="space-y-4">
                {metricType === 'continuous' ? (
                  <>
                    <div>
                      <p className="text-gray-300 text-sm mb-1">Difference</p>
                      <p className={`text-3xl font-bold ${result.type === 'continuous' && result.diff > 0 ? 'text-green-400' : result.type === 'continuous' && result.diff < 0 ? 'text-red-400' : 'text-gray-300'}`}>
                        {result.type === 'continuous' ? (result.diff > 0 ? '+' : '') + result.diff.toFixed(2) : 'N/A'}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {result.type === 'continuous' ? `(${result.percentDiff > 0 ? '+' : ''}${result.percentDiff.toFixed(2)}%)` : ''}
                      </p>
                    </div>

                    <div className="border-t border-gray-600 pt-4">
                      <p className="text-gray-300 text-sm mb-1">{(100 * (1 - alpha)).toFixed(0)}% Confidence Interval</p>
                      <p className="text-lg font-semibold text-gray-300 mb-2">Absolute</p>
                      <p className="text-lg font-bold text-blue-400 mb-2">
                        {result.type === 'continuous' ? `[${result.ciLower.toFixed(2)}, ${result.ciUpper.toFixed(2)}]` : 'N/A'}
                      </p>
                      <p className="text-lg font-semibold text-gray-300 mb-2">Relative</p>
                      <p className="text-lg font-bold text-blue-300">
                        {result.type === 'continuous' ? `[${((result.ciLower / controlMean) * 100).toFixed(2)}%, ${((result.ciUpper / controlMean) * 100).toFixed(2)}%]` : 'N/A'}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-gray-300 text-sm mb-1">Proportions</p>
                      <p className="text-sm font-semibold text-gray-200">
                        {result.type === 'binary' ? `Control: ${(result.controlProp * 100).toFixed(2)}%` : 'N/A'}
                      </p>
                      <p className="text-sm font-semibold text-gray-200">
                        {result.type === 'binary' ? `Treatment: ${(result.treatmentProp * 100).toFixed(2)}%` : 'N/A'}
                      </p>
                    </div>

                    <div className="border-t border-gray-600 pt-4">
                      <p className="text-gray-300 text-sm mb-1">Difference</p>
                      <p className={`text-2xl font-bold ${result.type === 'binary' && result.pDiff > 0 ? 'text-green-400' : result.type === 'binary' && result.pDiff < 0 ? 'text-red-400' : 'text-gray-300'}`}>
                        {result.type === 'binary' ? (result.pDiff > 0 ? '+' : '') + (result.pDiff * 100).toFixed(2) + '%' : 'N/A'}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {result.type === 'binary' ? `(${result.percentDiff > 0 ? '+' : ''}${result.percentDiff.toFixed(2)}% relative)` : ''}
                      </p>
                    </div>

                    <div className="border-t border-gray-600 pt-4">
                      <p className="text-gray-300 text-sm mb-1">{(100 * (1 - alpha)).toFixed(0)}% Confidence Interval</p>
                      <p className="text-lg font-semibold text-gray-300 mb-2">Absolute</p>
                      <p className="text-lg font-bold text-blue-400 mb-2">
                        {result.type === 'binary' ? `[${(result.ciLower * 100).toFixed(2)}pp, ${(result.ciUpper * 100).toFixed(2)}pp]` : 'N/A'}
                      </p>
                      <p className="text-lg font-semibold text-gray-300 mb-2">Relative</p>
                      <p className="text-lg font-bold text-blue-300">
                        {result.type === 'binary' ? `[${((result.ciLower / controlProportion) * 100).toFixed(2)}%, ${((result.ciUpper / controlProportion) * 100).toFixed(2)}%]` : 'N/A'}
                      </p>
                    </div>
                  </>
                )}

                <div className="border-t border-gray-600 pt-4">
                  <p className="text-gray-300 text-sm mb-1">P-value</p>
                  <p className={`text-2xl font-bold ${result.isSignificant ? 'text-green-400' : 'text-red-400'}`}>
                    {result.pValue.toFixed(6)}
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <p className={`text-lg font-bold ${result.isSignificant ? 'text-green-400' : 'text-red-400'}`}>
                    {result.isSignificant ? '✓ Significant' : '✗ Not Significant'}
                  </p>
                  {comparisonType !== 'none' ? (
                    <div className="text-gray-400 text-xs mt-1">
                      <p>at α = {alpha.toFixed(3)} (original)</p>
                      <p>Bonferroni adjusted: {result.adjustedAlpha.toFixed(4)}</p>
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
                  ) : (
                    <p className="text-gray-400 text-xs mt-1">at α = {alpha.toFixed(3)}</p>
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
