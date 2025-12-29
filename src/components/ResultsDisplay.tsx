import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface SimulationResults {
  totalRuns: number;
  positiveAtAnyPeek: number;
  negativeAtAnyPeek: number;
  positiveAtEnd: number;
  negativeAtEnd: number;
  negativeToPositive: number;
}

interface ResultsDisplayProps {
  results: SimulationResults | null;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500 py-12">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Run a simulation to see results</p>
        </div>
      </div>
    );
  }

  const positiveAtAnyPeekRate = (results.positiveAtAnyPeek / results.totalRuns) * 100;
  const negativeAtAnyPeekRate = (results.negativeAtAnyPeek / results.totalRuns) * 100;
  const positiveAtEndRate = (results.positiveAtEnd / results.totalRuns) * 100;
  const negativeAtEndRate = (results.negativeAtEnd / results.totalRuns) * 100;
  const negativeToPositiveRate = (results.negativeToPositive / results.totalRuns) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Simulation Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Positive at Any Peek</h3>
          </div>
          <p className="text-3xl font-bold text-green-700">{results.positiveAtAnyPeek}</p>
          <p className="text-sm text-green-600 mt-1">
            {positiveAtAnyPeekRate.toFixed(2)}% of runs
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Hit positive threshold during experiment
          </p>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Negative at Any Peek</h3>
          </div>
          <p className="text-3xl font-bold text-red-700">{results.negativeAtAnyPeek}</p>
          <p className="text-sm text-red-600 mt-1">
            {negativeAtAnyPeekRate.toFixed(2)}% of runs
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Hit negative threshold during experiment
          </p>
        </div>

        <div className="bg-green-100 border-l-4 border-green-700 p-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-700" />
            <h3 className="font-semibold text-green-900">Positive at End</h3>
          </div>
          <p className="text-3xl font-bold text-green-800">{results.positiveAtEnd}</p>
          <p className="text-sm text-green-700 mt-1">
            {positiveAtEndRate.toFixed(2)}% of runs
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Outside upper CI at final measurement
          </p>
        </div>

        <div className="bg-red-100 border-l-4 border-red-700 p-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-700" />
            <h3 className="font-semibold text-red-900">Negative at End</h3>
          </div>
          <p className="text-3xl font-bold text-red-800">{results.negativeAtEnd}</p>
          <p className="text-sm text-red-700 mt-1">
            {negativeAtEndRate.toFixed(2)}% of runs
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Outside lower CI at final measurement
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mt-4">
        <h3 className="font-semibold text-amber-900 mb-2">Hit Negative but Finished Positive</h3>
        <p className="text-3xl font-bold text-amber-700">{results.negativeToPositive}</p>
        <p className="text-sm text-amber-600 mt-1">
          {negativeToPositiveRate.toFixed(2)}% of runs hit the negative CI at any peek but finished positive at the end
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Flights are unlikely to hit a statistically negative result then finish positive.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-300 p-4 rounded mt-6">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900 mb-1">Impact of Peeking</h4>
            <p className="text-sm text-yellow-800">
              Frequent peeking increases false positive rates. Each peek is essentially running multiple tests,
              which inflates the chance of finding a significant result by random chance. The confidence intervals
              tighten over time as more data is collected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
