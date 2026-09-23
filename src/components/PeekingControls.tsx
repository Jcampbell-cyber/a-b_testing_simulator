import { Settings } from 'lucide-react';

export type TestType = 'AA' | 'AB';
export type PeekingMode = 'daily' | 'weekly' | 'custom';

interface PeekingControlsProps {
  testType: TestType;
  baselineMean: number;
  expectedUplift: number;
  stdev: number;
  sampleSize: number;
  numSimulations: number;
  confidenceLevel: number;
  peekingMode: PeekingMode;
  peekingFrequency: number;
  testDuration: number;
  mde: number;
  onTestTypeChange: (value: TestType) => void;
  onBaselineMeanChange: (value: number) => void;
  onExpectedUpliftChange: (value: number) => void;
  onStdevChange: (value: number) => void;
  onSampleSizeChange: (value: number) => void;
  onNumSimulationsChange: (value: number) => void;
  onConfidenceLevelChange: (value: number) => void;
  onPeekingModeChange: (value: PeekingMode) => void;
  onPeekingFrequencyChange: (value: number) => void;
  onTestDurationChange: (value: number) => void;
  onRunSimulation: () => void;
  isRunning: boolean;
}

export function PeekingControls({
  testType,
  baselineMean,
  expectedUplift,
  stdev,
  sampleSize,
  numSimulations,
  confidenceLevel,
  peekingMode,
  peekingFrequency,
  testDuration,
  mde,
  onTestTypeChange,
  onBaselineMeanChange,
  onExpectedUpliftChange,
  onStdevChange,
  onSampleSizeChange,
  onNumSimulationsChange,
  onConfidenceLevelChange,
  onPeekingModeChange,
  onPeekingFrequencyChange,
  onTestDurationChange,
  onRunSimulation,
  isRunning,
}: PeekingControlsProps) {
  const calculatePeeks = () => {
    if (peekingMode === 'daily') return testDuration;
    if (peekingMode === 'weekly') return Math.ceil(testDuration / 7);
    return peekingFrequency;
  };

  const actualPeeks = calculatePeeks();
  return (
    <div className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Peeking Simulation Parameters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Test Type
          </label>
          <select
            value={testType}
            onChange={(e) => onTestTypeChange(e.target.value as TestType)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="AA">A/A Test (No true effect)</option>
            <option value="AB">A/B Test (With true effect)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Choose whether there's a real difference</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Baseline Mean
          </label>
          <input
            type="number"
            value={baselineMean}
            onChange={(e) => onBaselineMeanChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Average value for control group</p>
        </div>

        {testType === 'AB' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Expected True Uplift (%)
            </label>
            <input
              type="number"
              value={expectedUplift}
              onChange={(e) => onExpectedUpliftChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">True percentage change in treatment group</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Standard Deviation
          </label>
          <input
            type="number"
            value={stdev}
            onChange={(e) => onStdevChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Variability in the data</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Test Duration (Days)
          </label>
          <input
            type="number"
            value={testDuration}
            onChange={(e) => onTestDurationChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">How long the test runs</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Sample Size per Group
          </label>
          <input
            type="number"
            value={sampleSize}
            onChange={(e) => onSampleSizeChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Number of observations in each group</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of Simulations
          </label>
          <input
            type="number"
            value={numSimulations}
            onChange={(e) => onNumSimulationsChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">How many test runs to simulate</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Confidence Level (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="80"
            max="99.9"
            value={confidenceLevel}
            onChange={(e) => onConfidenceLevelChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">95% means p-value threshold of 0.05</p>
        </div>

        <div className="md:col-span-2 bg-blue-900/30 border border-blue-700 rounded-md p-4">
          <label className="block text-sm font-medium text-blue-200 mb-1">
            Minimum Detectable Effect (MDE)
          </label>
          <p className="text-2xl font-bold text-blue-700">{mde.toFixed(2)}%</p>
          <p className="text-xs text-blue-400 mt-1">
            Smallest effect you can reliably detect with current sample size and test duration
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Peeking Schedule
          </label>
          <select
            value={peekingMode}
            onChange={(e) => onPeekingModeChange(e.target.value as PeekingMode)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
          >
            <option value="daily">Daily (Check every day)</option>
            <option value="weekly">Weekly (Check every 7 days)</option>
            <option value="custom">Custom (Specify number of peeks)</option>
          </select>

          {peekingMode === 'custom' && (
            <div>
              <input
                type="range"
                min="1"
                max="20"
                value={peekingFrequency}
                onChange={(e) => onPeekingFrequencyChange(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Check {peekingFrequency} time{peekingFrequency > 1 ? 's' : ''} during test</span>
                <span>{peekingFrequency > 10 ? 'Very frequent!' : peekingFrequency > 5 ? 'Frequent' : 'Moderate'}</span>
              </div>
            </div>
          )}

          {peekingMode !== 'custom' && (
            <p className="text-xs text-gray-500 mt-1">
              Will check {actualPeeks} time{actualPeeks > 1 ? 's' : ''} over {testDuration} days
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onRunSimulation}
        disabled={isRunning}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200"
      >
        {isRunning ? 'Running Simulation...' : 'Run Simulation'}
      </button>
    </div>
  );
}
