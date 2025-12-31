import { Tooltip } from './Tooltip';

export type SimulationMode = 'single' | 'abtest';

interface WinsorizingControlsProps {
  mode: SimulationMode;
  setMode: (mode: SimulationMode) => void;
  sampleSize: number;
  setSampleSize: (value: number) => void;
  baselineMean: number;
  setBaselineMean: (value: number) => void;
  baselineStd: number;
  setBaselineStd: (value: number) => void;
  outlierRate: number;
  setOutlierRate: (value: number) => void;
  outlierMagnitude: number;
  setOutlierMagnitude: (value: number) => void;
  lowerPercentile: number;
  setLowerPercentile: (value: number) => void;
  upperPercentile: number;
  setUpperPercentile: (value: number) => void;
  treatmentUplift?: number;
  setTreatmentUplift?: (value: number) => void;
  onSimulate: () => void;
  isRunning: boolean;
}

export function WinsorizingControls({
  mode,
  setMode,
  sampleSize,
  setSampleSize,
  baselineMean,
  setBaselineMean,
  baselineStd,
  setBaselineStd,
  outlierRate,
  setOutlierRate,
  outlierMagnitude,
  setOutlierMagnitude,
  lowerPercentile,
  setLowerPercentile,
  upperPercentile,
  setUpperPercentile,
  treatmentUplift,
  setTreatmentUplift,
  onSimulate,
  isRunning
}: WinsorizingControlsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Simulation Mode
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('single')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'single'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Single Sample
            </button>
            <button
              onClick={() => setMode('abtest')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'abtest'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              A/B Test
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              Sample Size
              <Tooltip content="Number of observations in the sample" />
            </label>
            <input
              type="number"
              value={sampleSize}
              onChange={(e) => setSampleSize(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="100"
              max="10000"
              step="100"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              Baseline Mean
              <Tooltip content="Average value of the metric" />
            </label>
            <input
              type="number"
              value={baselineMean}
              onChange={(e) => setBaselineMean(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="1"
              step="1"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              Standard Deviation
              <Tooltip content="Measure of variability in the data" />
            </label>
            <input
              type="number"
              value={baselineStd}
              onChange={(e) => setBaselineStd(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="1"
              step="1"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              Outlier Rate (%)
              <Tooltip content="Percentage of observations that are outliers" />
            </label>
            <input
              type="number"
              value={outlierRate * 100}
              onChange={(e) => setOutlierRate(Number(e.target.value) / 100)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="0"
              max="20"
              step="0.5"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              Outlier Magnitude (SD)
              <Tooltip content="How many standard deviations away outliers are" />
            </label>
            <input
              type="number"
              value={outlierMagnitude}
              onChange={(e) => setOutlierMagnitude(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="2"
              max="10"
              step="0.5"
            />
          </div>

          {mode === 'abtest' && treatmentUplift !== undefined && setTreatmentUplift && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                Treatment Uplift (%)
                <Tooltip content="Expected percentage increase in treatment group" />
              </label>
              <input
                type="number"
                value={treatmentUplift}
                onChange={(e) => setTreatmentUplift(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="-50"
                max="50"
                step="1"
              />
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Winsorizing Parameters</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                Lower Percentile (%)
                <Tooltip content="Values below this percentile will be capped" />
              </label>
              <input
                type="number"
                value={lowerPercentile}
                onChange={(e) => setLowerPercentile(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                max={upperPercentile - 1}
                step="1"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                Upper Percentile (%)
                <Tooltip content="Values above this percentile will be capped" />
              </label>
              <input
                type="number"
                value={upperPercentile}
                onChange={(e) => setUpperPercentile(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min={lowerPercentile + 1}
                max="100"
                step="1"
              />
            </div>
          </div>
        </div>

        <button
          onClick={onSimulate}
          disabled={isRunning}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isRunning ? 'Running Simulation...' : 'Run Simulation'}
        </button>
      </div>
    </div>
  );
}
