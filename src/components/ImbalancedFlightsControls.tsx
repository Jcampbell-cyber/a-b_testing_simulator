import { Play } from 'lucide-react';

interface ImbalancedFlightsControlsProps {
  baselineMean: number;
  stdev: number;
  sampleSize: number;
  numSimulations: number;
  mde: number;
  onBaselineMeanChange: (value: number) => void;
  onStdevChange: (value: number) => void;
  onSampleSizeChange: (value: number) => void;
  onNumSimulationsChange: (value: number) => void;
  onRunSimulation: () => void;
  isRunning: boolean;
}

export function ImbalancedFlightsControls({
  baselineMean,
  stdev,
  sampleSize,
  numSimulations,
  mde,
  onBaselineMeanChange,
  onStdevChange,
  onSampleSizeChange,
  onNumSimulationsChange,
  onRunSimulation,
  isRunning,
}: ImbalancedFlightsControlsProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Simulation Parameters</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xl font-medium text-gray-700 mb-2">
            Baseline Mean
          </label>
          <input
            type="number"
            value={baselineMean}
            onChange={(e) => onBaselineMeanChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Average value for control group</p>
        </div>

        <div>
          <label className="block text-xl font-medium text-gray-700 mb-2">
            Standard Deviation
          </label>
          <input
            type="number"
            value={stdev}
            onChange={(e) => onStdevChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Variability in the metric</p>
        </div>

        <div>
          <label className="block text-xl font-medium text-gray-700 mb-2">
            Number of Simulations
          </label>
          <input
            type="number"
            value={numSimulations}
            onChange={(e) => onNumSimulationsChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Number of tests to simulate per split</p>
        </div>

        <div>
          <label className="block text-xl font-medium text-gray-700 mb-2">
            Total Sample Size
          </label>
          <input
            type="number"
            value={sampleSize}
            onChange={(e) => onSampleSizeChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Combined control and treatment observations</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-xl font-medium text-blue-900">
            Minimum Detectable Effect (MDE)
          </p>
          <p className="text-2xl font-bold text-blue-700">
            {mde.toFixed(2)}%
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Based on 50/50 split with 80% power. A/B tests use MDE as actual uplift.
          </p>
        </div>

        <button
          onClick={onRunSimulation}
          disabled={isRunning}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-semibold"
        >
          <Play className="w-5 h-5" />
          {isRunning ? 'Running...' : 'Run Simulation'}
        </button>
      </div>
    </div>
  );
}
