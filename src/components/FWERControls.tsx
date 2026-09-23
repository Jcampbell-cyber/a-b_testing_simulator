
type Props = {
  testType: 'aa' | 'ab';
  numFlights: number;
  comparisonType: 'pairwise' | 'control';
  baselineMean: number;
  stdev: number;
  sampleSize: number;
  alpha: number;
  trueUplift: number;
  numSimulations: number;
  onTestTypeChange: (v: 'aa' | 'ab') => void;
  onNumFlightsChange: (v: number) => void;
  onComparisonTypeChange: (v: 'pairwise' | 'control') => void;
  onBaselineMeanChange: (v: number) => void;
  onStdevChange: (v: number) => void;
  onSampleSizeChange: (v: number) => void;
  onAlphaChange: (v: number) => void;
  onTrueUpliftChange: (v: number) => void;
  onNumSimulationsChange: (v: number) => void;
  onRunSimulation: () => void;
  isRunning: boolean;
};

export function FWERControls(props: Props) {
  const {
    testType,
    numFlights,
    comparisonType,
    baselineMean,
    stdev,
    sampleSize,
    alpha,
    trueUplift,
    numSimulations,
    onTestTypeChange,
    onNumFlightsChange,
    onComparisonTypeChange,
    onBaselineMeanChange,
    onStdevChange,
    onSampleSizeChange,
    onAlphaChange,
    onTrueUpliftChange,
    onNumSimulationsChange,
    onRunSimulation,
    isRunning,
  } = props;

  return (
    <div className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Simulation Parameters</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Test Type
          </label>
          <select
            value={testType}
            onChange={(e) => onTestTypeChange(e.target.value as 'aa' | 'ab')}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="aa">A/A Test (No True Effect)</option>
            <option value="ab">A/B Test (With Effect)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Choose test scenario</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of Flights
          </label>
          <input
            type="number"
            min="2"
            max="10"
            value={numFlights}
            onChange={(e) => onNumFlightsChange(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Number of groups to compare (2-10)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Comparison Type
          </label>
          <select
            value={comparisonType}
            onChange={(e) => onComparisonTypeChange(e.target.value as 'pairwise' | 'control')}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="pairwise">All Pairwise (Tukey/Holm)</option>
            <option value="control">vs Control (Dunnett/Bonferroni)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Type of comparisons to perform</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Baseline Mean
          </label>
          <input
            type="number"
            value={baselineMean}
            onChange={(e) => onBaselineMeanChange(parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Average metric value</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Standard Deviation
          </label>
          <input
            type="number"
            value={stdev}
            onChange={(e) => onStdevChange(parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Measure of data spread</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Sample Size per Flight
          </label>
          <input
            type="number"
            value={sampleSize}
            onChange={(e) => onSampleSizeChange(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Users per flight group</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Significance Level (α)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max="0.1"
            value={alpha}
            onChange={(e) => onAlphaChange(parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Type I error rate threshold</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            True Uplift on One Flight (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={trueUplift}
            onChange={(e) => onTrueUpliftChange(parseFloat(e.target.value))}
            disabled={testType === 'aa'}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            {testType === 'aa' ? 'Disabled for A/A test (effect = 0)' : 'Real effect size on one flight only'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of Simulations
          </label>
          <input
            type="number"
            min="10"
            value={numSimulations}
            onChange={(e) => onNumSimulationsChange(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Iterations for stable estimates</p>
        </div>
      </div>

      <button
        onClick={onRunSimulation}
        disabled={isRunning}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-lg py-3 transition-colors"
      >
        {isRunning ? 'Running Simulation...' : 'Run Simulation'}
      </button>
    </div>
  );
}