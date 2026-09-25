import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { Link } from 'react-router-dom';

type MetricType = 'continuous' | 'binary';
type TestType = 'two-sided' | 'one-sided';
type SampleSizeMode = 'per-group' | 'all-groups';
type ComparisonType = 'none' | 'control' | 'pairwise';
type AllocationMode = 'equal' | 'unequal';

export function EffectDetectionCalculator() {

  const [metricType, setMetricType] = useState<MetricType>('continuous');
  const [testType, setTestType] = useState<TestType>('two-sided');
  const [alpha, setAlpha] = useState(0.05);
  const [power, setPower] = useState(0.8);

  const [sampleSizeInput, setSampleSizeInput] = useState(10000);
  const [sampleSizeMode, setSampleSizeMode] = useState<SampleSizeMode>('per-group');

  const [numFlights, setNumFlights] = useState(2);
  const [comparisonType, setComparisonType] = useState<ComparisonType>('none');

  const [allocationMode, setAllocationMode] = useState<AllocationMode>('equal');
  const [controlAllocationPercent, setControlAllocationPercent] = useState(50);

  const [mean, setMean] = useState(100);
  const [stdev, setStdev] = useState(20);
  const [proportion, setProportion] = useState(0.5);

  useEffect(() => {
    if (numFlights <= 2 && comparisonType !== 'none') {
      setComparisonType('none');
    }
  }, [numFlights, comparisonType]);

  const normalInverse = (p: number): number => {
    if (p <= 0 || p >= 1) return NaN;
    if (p === 0.5) return 0;

    const a = [
      -39.69683028665376,
      220.9460984245205,
      -275.9285104469687,
      138.357751867269,
      -30.66479806614716,
      2.506628277459239,
    ];
    const b = [
      -54.47609879822406,
      161.5858368580409,
      -155.6989798598866,
      66.80131188771972,
      -13.28068155288572,
    ];
    const c = [
      -0.007784894002430293,
      -0.3223964580411365,
      -2.400758277161838,
      -2.549732539343734,
      4.374664141464968,
      2.938163982698783,
    ];
    const d = [
      0.007784695709041462,
      0.3224671290700398,
      2.445134137142996,
      3.754408661907416,
    ];

    const pLow = 0.02425;
    const pHigh = 1 - pLow;

    let q: number;
    let r: number;

    if (p < pLow) {
      q = Math.sqrt(-2 * Math.log(p));
      return (
        (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
      );
    }

    if (p <= pHigh) {
      q = p - 0.5;
      r = q * q;
      return (
        (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
        (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
      );
    }

    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  };

  const getNumComparisons = () => {
    if (numFlights <= 2 || comparisonType === 'none') return 1;
    if (comparisonType === 'control') return Math.max(1, numFlights - 1);
    return Math.max(1, (numFlights * (numFlights - 1)) / 2);
  };

  const formatWholeNumber = (value: number) => {
    return Math.round(value).toLocaleString();
  };

  const getGroupSizes = (inputSampleSize: number) => {
    const safeInputSampleSize = Math.max(1, inputSampleSize);

    if (sampleSizeMode === 'per-group' && allocationMode === 'equal') {
      const perGroup = safeInputSampleSize;
      return {
        totalPopulation: perGroup * numFlights,
        controlGroupSize: perGroup,
        treatmentGroupSize: perGroup,
        smallestGroupSize: perGroup,
        largestGroupSize: perGroup,
        comparisonN1: perGroup,
        comparisonN2: perGroup,
        allocationSummary: `Equal split across ${numFlights} groups`,
      };
    }

    if (sampleSizeMode === 'per-group' && allocationMode === 'unequal') {
      const controlGroupSize = safeInputSampleSize;
      const treatmentGroupSize =
        numFlights > 1
          ? (controlGroupSize * ((100 - controlAllocationPercent) / controlAllocationPercent)) / (numFlights - 1)
          : controlGroupSize;

      const totalPopulation = controlGroupSize + treatmentGroupSize * (numFlights - 1);
      const smallestGroupSize = Math.min(controlGroupSize, treatmentGroupSize);
      const largestGroupSize = Math.max(controlGroupSize, treatmentGroupSize);

      let comparisonN1 = controlGroupSize;
      let comparisonN2 = treatmentGroupSize;

      if (comparisonType === 'pairwise' && numFlights > 2) {
        comparisonN1 = smallestGroupSize;
        comparisonN2 = smallestGroupSize;
      }

      return {
        totalPopulation,
        controlGroupSize,
        treatmentGroupSize,
        smallestGroupSize,
        largestGroupSize,
        comparisonN1,
        comparisonN2,
        allocationSummary: `Control ${controlAllocationPercent.toFixed(1)}%, remaining ${(100 - controlAllocationPercent).toFixed(1)}% split equally across ${numFlights - 1} treatment groups`,
      };
    }

    if (sampleSizeMode === 'all-groups' && allocationMode === 'equal') {
      const totalPopulation = safeInputSampleSize;
      const perGroup = totalPopulation / numFlights;

      return {
        totalPopulation,
        controlGroupSize: perGroup,
        treatmentGroupSize: perGroup,
        smallestGroupSize: perGroup,
        largestGroupSize: perGroup,
        comparisonN1: perGroup,
        comparisonN2: perGroup,
        allocationSummary: `Equal split across ${numFlights} groups`,
      };
    }

    const totalPopulation = safeInputSampleSize;
    const controlShare = controlAllocationPercent / 100;
    const controlGroupSize = totalPopulation * controlShare;
    const treatmentGroupSize =
      numFlights > 1
        ? (totalPopulation * (1 - controlShare)) / (numFlights - 1)
        : totalPopulation;

    const smallestGroupSize = Math.min(controlGroupSize, treatmentGroupSize);
    const largestGroupSize = Math.max(controlGroupSize, treatmentGroupSize);

    let comparisonN1 = controlGroupSize;
    let comparisonN2 = treatmentGroupSize;

    if (comparisonType === 'pairwise' && numFlights > 2) {
      comparisonN1 = smallestGroupSize;
      comparisonN2 = smallestGroupSize;
    }

    return {
      totalPopulation,
      controlGroupSize,
      treatmentGroupSize,
      smallestGroupSize,
      largestGroupSize,
      comparisonN1,
      comparisonN2,
      allocationSummary: `Control ${controlAllocationPercent.toFixed(1)}%, remaining ${(100 - controlAllocationPercent).toFixed(1)}% split equally across ${numFlights - 1} treatment groups`,
    };
  };

  const calculateForSample = (inputSampleSize: number) => {
    const numComparisons = getNumComparisons();
    const adjustedAlpha = comparisonType === 'none' ? alpha : alpha / numComparisons;
    const alphaTail = testType === 'two-sided' ? adjustedAlpha / 2 : adjustedAlpha;

    const zAlpha = normalInverse(1 - alphaTail);
    const zBeta = normalInverse(power);

    const groupSizes = getGroupSizes(inputSampleSize);
    const { comparisonN1, comparisonN2 } = groupSizes;

    let absoluteMde: number;
    let relativeMdePercent: number;

    if (metricType === 'continuous') {
      absoluteMde =
        (zAlpha + zBeta) *
        stdev *
        Math.sqrt(1 / comparisonN1 + 1 / comparisonN2);

      relativeMdePercent = mean !== 0 ? (absoluteMde / mean) * 100 : NaN;
    } else {
      absoluteMde =
        (zAlpha + zBeta) *
        Math.sqrt(proportion * (1 - proportion) * (1 / comparisonN1 + 1 / comparisonN2));

      relativeMdePercent = proportion !== 0 ? (absoluteMde / proportion) * 100 : NaN;
    }

    const targetValue =
      metricType === 'continuous'
        ? mean + absoluteMde
        : proportion + absoluteMde;

    return {
      ...groupSizes,
      numComparisons,
      adjustedAlpha,
      zAlpha,
      zBeta,
      absoluteMde,
      relativeMdePercent,
      targetValue,
    };
  };

  const current = calculateForSample(sampleSizeInput);
  const half = calculateForSample(sampleSizeInput / 2);
  const double = calculateForSample(sampleSizeInput * 2);

  const ResultCard = ({
    title,
    result,
    accentClass,
  }: {
    title: string;
    result: ReturnType<typeof calculateForSample>;
    accentClass: string;
  }) => {
    const absoluteLabel =
      metricType === 'continuous'
        ? `+${result.absoluteMde.toFixed(4)}`
        : `+${(result.absoluteMde * 100).toFixed(2)} pp`;

    const baselineLabel =
      metricType === 'continuous'
        ? mean.toFixed(4)
        : `${(proportion * 100).toFixed(2)}%`;

    const targetLabel =
      metricType === 'continuous'
        ? result.targetValue.toFixed(4)
        : `${(result.targetValue * 100).toFixed(2)}%`;

    return (
      <div className="border-t border-gray-600 pt-4">
        <p className="text-gray-300 text-xs mb-2 font-semibold">{title}</p>

        <div className="bg-gray-600 rounded p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Detectable lift</p>
              <p className={`text-2xl font-bold ${accentClass}`}>
                +{result.relativeMdePercent.toFixed(2)}%
              </p>

              <p className="text-xs text-gray-400 mt-2">Absolute lift</p>
              <p className={`text-lg font-bold ${accentClass}`}>
                {absoluteLabel}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Baseline</p>
              <p className="text-lg text-white">{baselineLabel}</p>

              <p className="text-xs text-gray-400 mt-2">Target needed to detect</p>
              <p className="text-lg text-white">{targetLabel}</p>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-300 space-y-1">
            <p>
              <span className="text-gray-400">Total population:</span>{' '}
              {formatWholeNumber(result.totalPopulation)}
            </p>
            <p>
              <span className="text-gray-400">Control group:</span>{' '}
              {formatWholeNumber(result.controlGroupSize)}
            </p>
            <p>
              <span className="text-gray-400">
                {numFlights > 2 ? 'Each treatment group:' : 'Treatment group:'}
              </span>{' '}
              {formatWholeNumber(result.treatmentGroupSize)}
            </p>
            <p>
              <span className="text-gray-400">Comparison used for MDE:</span>{' '}
              {formatWholeNumber(result.comparisonN1)} vs {formatWholeNumber(result.comparisonN2)}
            </p>
            <p>
              <span className="text-gray-400">Comparisons:</span> {result.numComparisons}
              {comparisonType !== 'none' ? ' (Bonferroni corrected)' : ''}
            </p>
            <p>
              <span className="text-gray-400">Adjusted α per comparison:</span>{' '}
              {result.adjustedAlpha.toFixed(4)}
            </p>
            <p>
              <span className="text-gray-400">Allocation:</span> {result.allocationSummary}
            </p>
          </div>
        </div>
      </div>
    );
  };
    return (
    <div className="bg-gray-900">

      <div className="max-w-5xl mx-auto px-4 py-8">

        <div className="bg-gray-800 rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-white mb-2">Effect Detection Calculator</h1>
          <p className="text-gray-300 mb-8">
            Calculate the minimum detectable effect for your experiment setup
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN */}
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
                    min="0.001"
                    max="0.2"
                    step="0.001"
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
                    <label className="block text-white font-semibold mb-2">Control Mean</label>
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
                      min="0.000001"
                      value={stdev}
                      onChange={(e) =>
                        setStdev(Math.max(0.000001, parseFloat(e.target.value) || 1))
                      }
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
                    onChange={(e) =>
                      setProportion(
                        Math.min(0.9999, Math.max(0.0001, parseFloat(e.target.value) / 100))
                      )
                    }
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
                        checked={sampleSizeMode === 'all-groups'}
                        onChange={() => setSampleSizeMode('all-groups')}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Across All Groups</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    {sampleSizeMode === 'per-group'
                      ? allocationMode === 'equal'
                        ? 'Sample Size Per Group'
                        : 'Control Group Sample Size'
                      : 'Total Sample Size Across All Groups'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={sampleSizeInput}
                    onChange={(e) => setSampleSizeInput(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-white font-semibold mb-3">Allocation</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={allocationMode === 'equal'}
                        onChange={() => setAllocationMode('equal')}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Equal split</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={allocationMode === 'unequal'}
                        onChange={() => setAllocationMode('unequal')}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Unequal split</span>
                    </label>
                  </div>
                </div>
              </div>

              {allocationMode === 'unequal' && (
                <div>
                  <label className="block text-white font-semibold mb-3">
                    Control Allocation (%): {controlAllocationPercent.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="95"
                    step="0.5"
                    value={controlAllocationPercent}
                    onChange={(e) => setControlAllocationPercent(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Remaining traffic is split equally across the {numFlights - 1} treatment group
                    {numFlights - 1 === 1 ? '' : 's'}.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-3">Comparison Type</label>

                  {numFlights <= 2 ? (
                    <div className="bg-gray-700 rounded p-3 text-sm text-gray-400">
                      Only one comparison exists with 2 flights, so multiple-comparison correction is
                      not needed.
                    </div>
                  ) : (
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
                        <span className="text-gray-300">
                          Compare each treatment to control ({Math.max(1, numFlights - 1)} comparisons)
                        </span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          checked={comparisonType === 'pairwise'}
                          onChange={() => setComparisonType('pairwise')}
                          className="w-4 h-4"
                        />
                        <span className="text-gray-300">
                          All pairwise comparisons ({Math.max(1, (numFlights * (numFlights - 1)) / 2)} comparisons)
                        </span>
                      </label>
                    </div>
                  )}

                  {numFlights > 2 && comparisonType !== 'none' && (
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-xs text-gray-400">
                        Bonferroni adjusted α: {(alpha / getNumComparisons()).toFixed(4)}
                      </p>
                      <Link
                        to="/resources/advanced-techniques/fwer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs transition-colors"
                      >
                        <Info className="w-3 h-3" />
                        <span>Learn more about FWER</span>
                      </Link>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">Current group sizes</label>
                  <div className="bg-gray-700 rounded p-3 text-sm text-gray-300 space-y-1">
                    <p>
                      <span className="text-gray-400">Total:</span>{' '}
                      {formatWholeNumber(current.totalPopulation)}
                    </p>
                    <p>
                      <span className="text-gray-400">Control:</span>{' '}
                      {formatWholeNumber(current.controlGroupSize)}
                    </p>
                    <p>
                      <span className="text-gray-400">
                        {numFlights > 2 ? 'Each treatment:' : 'Treatment:'}
                      </span>{' '}
                      {formatWholeNumber(current.treatmentGroupSize)}
                    </p>
                    <p>
                      <span className="text-gray-400">MDE comparison:</span>{' '}
                      {formatWholeNumber(current.comparisonN1)} vs {formatWholeNumber(current.comparisonN2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="bg-gray-700 rounded-lg p-6 flex flex-col justify-start h-fit sticky top-8">
              <h2 className="text-2xl font-bold text-white mb-6">Minimum Detectable Effects</h2>

              <div className="space-y-4">
                <div className="bg-gray-600 rounded p-4">
                  <p className="text-gray-300 text-xs mb-2 font-semibold">Current Configuration</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Detectable lift</p>
                      <p className="text-2xl font-bold text-blue-400">
                        +{current.relativeMdePercent.toFixed(2)}%
                      </p>

                      <p className="text-xs text-gray-400 mt-2">Absolute lift</p>
                      <p className="text-lg font-bold text-blue-300">
                        {metricType === 'continuous'
                          ? `+${current.absoluteMde.toFixed(4)}`
                          : `+${(current.absoluteMde * 100).toFixed(2)} pp`}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-1">Baseline</p>
                      <p className="text-lg text-white">
                        {metricType === 'continuous'
                          ? mean.toFixed(4)
                          : `${(proportion * 100).toFixed(2)}%`}
                      </p>

                      <p className="text-xs text-gray-400 mt-2">Target needed to detect</p>
                      <p className="text-lg text-white">
                        {metricType === 'continuous'
                          ? current.targetValue.toFixed(4)
                          : `${(current.targetValue * 100).toFixed(2)}%`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-gray-300 space-y-1">
                    <p>
                      <span className="text-gray-400">Total population:</span>{' '}
                      {formatWholeNumber(current.totalPopulation)}
                    </p>
                    <p>
                      <span className="text-gray-400">Control group:</span>{' '}
                      {formatWholeNumber(current.controlGroupSize)}
                    </p>
                    <p>
                      <span className="text-gray-400">
                        {numFlights > 2 ? 'Each treatment group:' : 'Treatment group:'}
                      </span>{' '}
                      {formatWholeNumber(current.treatmentGroupSize)}
                    </p>
                    <p>
                      <span className="text-gray-400">Comparison used for MDE:</span>{' '}
                      {formatWholeNumber(current.comparisonN1)} vs {formatWholeNumber(current.comparisonN2)}
                    </p>
                    <p>
                      <span className="text-gray-400">Comparisons:</span> {current.numComparisons}
                      {comparisonType !== 'none' ? ' (Bonferroni corrected)' : ''}
                    </p>
                    <p>
                      <span className="text-gray-400">Adjusted α per comparison:</span>{' '}
                      {current.adjustedAlpha.toFixed(4)}
                    </p>
                    <p>
                      <span className="text-gray-400">Allocation:</span> {current.allocationSummary}
                    </p>
                  </div>
                </div>

                <ResultCard
                  title="Half Sample Size"
                  result={half}
                  accentClass="text-gray-300"
                />

                <ResultCard
                  title="Double Sample Size"
                  result={double}
                  accentClass="text-green-400"
                />
            <div className="bg-gray-600 rounded p-3 text-xs text-gray-200 border-t border-gray-600">
              <p className="font-semibold mb-1">Configuration</p>
              <ul className="space-y-1 text-xs">
                <li>Metric: {metricType}</li>
                <li>Test: {testType}</li>
                <li>
                  α = {alpha.toFixed(3)}
                  {numFlights > 2 && comparisonType !== 'none'
                    ? ` (adjusted: ${current.adjustedAlpha.toFixed(4)})`
                    : ''}
                  , Power = {power.toFixed(2)}
                </li>
                <li>Flights: {numFlights}</li>
                <li>
                  Sample input mode:{' '}
                  {sampleSizeMode === 'per-group' ? 'Per group' : 'Across all groups'}
                </li>
                <li>Allocation mode: {allocationMode}</li>
                {allocationMode === 'unequal' && (
                  <li>Control allocation: {controlAllocationPercent.toFixed(1)}%</li>
                )}
                <li>
                  Current total population: {formatWholeNumber(current.totalPopulation)}
                </li>
                <li>
                  Current control group: {formatWholeNumber(current.controlGroupSize)}
                </li>
                <li>
                  Current treatment group size:{' '}
                  {formatWholeNumber(current.treatmentGroupSize)}
                </li>
                {numFlights > 2 && comparisonType !== 'none' && (
                  <li>
                    {comparisonType === 'control'
                      ? `${Math.max(1, numFlights - 1)} comparisons to control`
                      : `${Math.max(1, (numFlights * (numFlights - 1)) / 2)} pairwise comparisons`} (Bonferroni)
                  </li>
                )}
              </ul>

              {numFlights > 2 && comparisonType !== 'none' && (
                <Link
                  to="/resources/advanced-techniques/fwer"
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs transition-colors mt-2"
                >
                  <Info className="w-3 h-3" />
                  <span>Learn more about FWER</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-12 bg-gray-700 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6">How the Calculation Works</h2>

        <div className="space-y-6 text-gray-300">
          <div>
            <h3 className="text-lg font-semibold text-emerald-400 mb-2">
              Minimum Detectable Effect (MDE)
            </h3>
            <p className="mb-3">
              The MDE is the smallest difference between variants that your test is powered to
              detect at the chosen significance level and power.
            </p>

            <div className="bg-gray-900 rounded p-4 font-mono text-sm mb-3">
              Continuous: MDE = (zα + zβ) × SD × √(1/n₁ + 1/n₂)
            </div>
            <div className="bg-gray-900 rounded p-4 font-mono text-sm mb-3">
              Binary: MDE = (zα + zβ) × √(p × (1 - p) × (1/n₁ + 1/n₂))
            </div>

            <p className="text-sm text-gray-400">
              For equal-sized two-group tests, this simplifies to the familiar form with{' '}
              <span className="font-mono">√(2 / n)</span>. For unequal allocation, the calculator
              uses the group sizes from the selected allocation.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-emerald-400 mb-2">
              Unequal allocation
            </h3>
            <p className="text-sm mb-2">
              When unequal allocation is selected, the control gets the chosen share of traffic and
              the remaining traffic is split equally across the treatment groups.
            </p>
            <p className="text-sm text-gray-400">
              The MDE gets worse when the comparison groups are more imbalanced because the standard
              error depends on both group sizes.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-emerald-400 mb-2">
              Multiple flights and FWER
            </h3>
            <p className="text-sm mb-2">
              If you test multiple flights, you may want to control the family-wise error rate using
              Bonferroni correction.
            </p>

            <div className="bg-gray-900 rounded p-4 font-mono text-sm mb-3">
              adjusted α = α / number of comparisons
            </div>

            <p className="text-sm text-gray-400">
              This makes each comparison harder to declare significant, which increases the MDE.
              This calculator keeps the sample sizes fixed and adjusts the significance threshold.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-emerald-400 mb-2">How to read the result</h3>
            <ul className="space-y-2 ml-4 text-sm text-gray-400">
              <li>
                <strong>Detectable lift:</strong> the smallest relative uplift the test is powered
                to detect.
              </li>
              <li>
                <strong>Absolute lift:</strong> the corresponding absolute change in the metric.
              </li>
              <li>
                <strong>Target needed to detect:</strong> the approximate treatment value needed to
                detect that lift.
              </li>
              <li>
                <strong>Comparison used for MDE:</strong> the group sizes used in the variance
                calculation.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-emerald-400 mb-2">Sample size impact</h3>
            <ul className="space-y-2 ml-4 text-sm text-gray-400">
              <li>Doubling sample size reduces MDE by about 29%</li>
              <li>Halving sample size increases MDE by about 41%</li>
              <li>To detect half the effect, you need about 4x the sample size</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-gray-700 rounded-lg p-6 text-center">
        <p className="text-gray-300 mb-4">Ready to analyse the results of your experiment?</p>
        <Link
          to="/resources/calculators/test-results-calc"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded transition-colors"
        >
          Open Test Results Calculator →
        </Link>
      </div>
    </div>
  </div>
</div>
  );
}
