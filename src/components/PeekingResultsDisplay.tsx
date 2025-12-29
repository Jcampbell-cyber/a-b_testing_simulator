import { type PeekingSimulationResults } from '../utils/peekingSimulation';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PeekingResultsDisplayProps {
  results: PeekingSimulationResults | null;
  confidenceLevel: number;
}

export function PeekingResultsDisplay({ results, confidenceLevel }: PeekingResultsDisplayProps) {
  if (!results) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Results</h2>
        <p className="text-gray-500 text-center py-8">
          Run a simulation to see results
        </p>
      </div>
    );
  }

  const significantAtAnyPeekRate = (results.significantAtAnyPeek / results.totalRuns) * 100;
  const significantAtEndRate = (results.significantAtEnd / results.totalRuns) * 100;
  const inflationRate = significantAtEndRate > 0 ? ((significantAtAnyPeekRate / significantAtEndRate) - 1) * 100 : 0;

  const anyPeekPosRate = (results.significantAtAnyPeekPositive / results.totalRuns) * 100;
  const anyPeekNegRate = (results.significantAtAnyPeekNegative / results.totalRuns) * 100;
  const endPosRate = (results.significantAtEndPositive / results.totalRuns) * 100;
  const endNegRate = (results.significantAtEndNegative / results.totalRuns) * 100;

  const inflationRatePos = endPosRate > 0 ? ((anyPeekPosRate / endPosRate) - 1) * 100 : 0;
  const inflationRateNeg = endNegRate > 0 ? ((anyPeekNegRate / endNegRate) - 1) * 100 : 0;

  const alpha = (100 - confidenceLevel);

  return (
    <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Peeking Results</h2>

      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left py-3 px-4 text-gray-300 font-semibold"></th>
              <th className="text-center py-3 px-4 text-blue-400 font-semibold">Sig. at Any Peek</th>
              <th className="text-center py-3 px-4 text-blue-400 font-semibold">Sig. at End</th>
              <th className="text-center py-3 px-4 text-orange-400 font-semibold">Inflation Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-700 bg-gray-900/30">
              <td className="py-3 px-4 text-green-400 font-medium">Positive</td>
              <td className="text-center py-3 px-4 text-gray-200">
                <div>{results.significantAtAnyPeekPositive}</div>
                <div className="text-xs text-gray-400">({anyPeekPosRate.toFixed(1)}%)</div>
              </td>
              <td className="text-center py-3 px-4 text-gray-200">
                <div>{results.significantAtEndPositive}</div>
                <div className="text-xs text-gray-400">({endPosRate.toFixed(1)}%)</div>
              </td>
              <td className="text-center py-3 px-4 text-orange-300 font-semibold">
                {endPosRate > 0 ? `+${inflationRatePos.toFixed(1)}%` : '—'}
              </td>
            </tr>
            <tr className="border-b border-gray-700 bg-gray-900/50">
              <td className="py-3 px-4 text-red-400 font-medium">Negative</td>
              <td className="text-center py-3 px-4 text-gray-200">
                <div>{results.significantAtAnyPeekNegative}</div>
                <div className="text-xs text-gray-400">({anyPeekNegRate.toFixed(1)}%)</div>
              </td>
              <td className="text-center py-3 px-4 text-gray-200">
                <div>{results.significantAtEndNegative}</div>
                <div className="text-xs text-gray-400">({endNegRate.toFixed(1)}%)</div>
              </td>
              <td className="text-center py-3 px-4 text-orange-300 font-semibold">
                {endNegRate > 0 ? `+${inflationRateNeg.toFixed(1)}%` : '—'}
              </td>
            </tr>
            <tr className="border-t-2 border-gray-600 bg-gray-900/30">
              <td className="py-3 px-4 text-white font-semibold">Total</td>
              <td className="text-center py-3 px-4 text-blue-300 font-semibold">
                <div>{results.significantAtAnyPeek}</div>
                <div className="text-xs text-blue-400">({significantAtAnyPeekRate.toFixed(1)}%)</div>
              </td>
              <td className="text-center py-3 px-4 text-blue-300 font-semibold">
                <div>{results.significantAtEnd}</div>
                <div className="text-xs text-blue-400">({significantAtEndRate.toFixed(1)}%)</div>
              </td>
              <td className="text-center py-3 px-4 text-orange-300 font-semibold">
                +{inflationRate.toFixed(1)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-400 mb-2">Key Insights</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>
            <strong>Positive/Negative:</strong> Direction of effect when first reaching significance (positive = treatment better, negative = control better)
          </li>
          <li>
            <strong>Significant at Any Peek:</strong> Tests that showed statistical significance (p-value &lt; {(alpha / 100).toFixed(2)}) at least once during peeking
          </li>
          <li>
            <strong>Significant at End:</strong> Tests that showed statistical significance at the final peek
          </li>
          <li>
            <strong>Inflation Rate:</strong> The increase in false positive rate due to peeking multiple times. Shown overall and split by direction.
          </li>
          <li>
            Lines turn <span className="text-red-400 font-semibold">red</span> or <span className="text-green-400 font-semibold">green</span> when p-value falls below {(alpha / 100).toFixed(2)}, <span className="text-gray-400 font-semibold">gray</span> when not significant
          </li>
        </ul>
      </div>
    </div>
  );
}
