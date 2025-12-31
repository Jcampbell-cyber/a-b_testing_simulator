import { NormalisationResults } from '../utils/normalisationSimulation';
import { CheckCircle, XCircle, TrendingDown } from 'lucide-react';

interface Props {
  results: NormalisationResults;
}

export function NormalisationResultsDisplay({ results }: Props) {
  const { groups, aggregatedRaw, aggregatedNorm, trueEffectPercent } = results;

  const varianceReduction = ((1 - aggregatedNorm.pooledStd / aggregatedRaw.pooledStd) * 100);
  const ciWidthRaw = aggregatedRaw.ci95[1] - aggregatedRaw.ci95[0];
  const ciWidthNorm = aggregatedNorm.ci95[1] - aggregatedNorm.ci95[0];

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Per-Region Results</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-3 text-gray-400 font-medium">Region</th>
                <th className="text-right py-2 px-3 text-gray-400 font-medium">Baseline</th>
                <th className="text-right py-2 px-3 text-gray-400 font-medium">Control</th>
                <th className="text-right py-2 px-3 text-gray-400 font-medium">Treatment</th>
                <th className="text-right py-2 px-3 text-gray-400 font-medium">Raw Lift</th>
                <th className="text-right py-2 px-3 text-gray-400 font-medium">% Lift</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group, index) => (
                <tr key={index} className="border-b border-gray-800">
                  <td className="py-2 px-3 text-white font-medium">{group.name}</td>
                  <td className="py-2 px-3 text-right text-gray-400">{group.baselineMean.toFixed(1)}</td>
                  <td className="py-2 px-3 text-right text-gray-300">{group.rawControlMean.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right text-gray-300">{group.rawTreatmentMean.toFixed(2)}</td>
                  <td className={`py-2 px-3 text-right font-medium ${group.rawLift >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {group.rawLift >= 0 ? '+' : ''}{group.rawLift.toFixed(2)}
                  </td>
                  <td className={`py-2 px-3 text-right font-medium ${group.rawLiftPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {group.rawLiftPercent >= 0 ? '+' : ''}{group.rawLiftPercent.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Notice how the absolute lift varies greatly between regions due to different price levels, even though the relative effect ({trueEffectPercent}%) is the same.
        </p>
      </div>

      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl border border-green-800/50 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-600/30 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-400">Variance Reduction</h3>
            <p className="text-sm text-gray-400">The key benefit of normalisation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">
              {aggregatedRaw.pooledStd.toFixed(1)}
            </div>
            <div className="text-sm text-gray-400">Raw Pooled Std Dev</div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {aggregatedNorm.pooledStd.toFixed(3)}
            </div>
            <div className="text-sm text-gray-400">Normalised Pooled Std Dev</div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {varianceReduction.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-400">Reduction in Std Dev</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl border border-red-900/50 p-5">
          <h3 className="text-lg font-semibold text-red-400 mb-3">Raw Aggregation</h3>
          <p className="text-xs text-gray-400 mb-4">
            Pooling raw values across regions with different price levels
          </p>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Lift</span>
              <span className={`font-mono font-medium ${aggregatedRaw.lift >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {aggregatedRaw.lift >= 0 ? '+' : ''}{aggregatedRaw.lift.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">95% CI</span>
              <span className="text-white font-mono text-sm">
                [{aggregatedRaw.ci95[0].toFixed(2)}, {aggregatedRaw.ci95[1].toFixed(2)}]
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">CI Width</span>
              <span className="text-red-400 font-mono font-medium">{ciWidthRaw.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">p-value</span>
              <span className="text-white font-mono">{aggregatedRaw.pValue.toFixed(4)}</span>
            </div>
            <div className={`flex items-center gap-2 mt-2 p-2 rounded ${aggregatedRaw.significant ? 'bg-green-900/30' : 'bg-gray-800'}`}>
              {aggregatedRaw.significant ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-gray-500" />
              )}
              <span className={`text-sm ${aggregatedRaw.significant ? 'text-green-400' : 'text-gray-500'}`}>
                {aggregatedRaw.significant ? 'Significant' : 'Not Significant'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-green-900/50 p-5">
          <h3 className="text-lg font-semibold text-green-400 mb-3">Normalised Aggregation</h3>
          <p className="text-xs text-gray-400 mb-4">
            Z-score standardisation within each region before pooling
          </p>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Lift (Z-score)</span>
              <span className={`font-mono font-medium ${aggregatedNorm.lift >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {aggregatedNorm.lift >= 0 ? '+' : ''}{aggregatedNorm.lift.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">95% CI</span>
              <span className="text-white font-mono text-sm">
                [{aggregatedNorm.ci95[0].toFixed(4)}, {aggregatedNorm.ci95[1].toFixed(4)}]
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">CI Width</span>
              <span className="text-green-400 font-mono font-medium">{ciWidthNorm.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">p-value</span>
              <span className="text-white font-mono">{aggregatedNorm.pValue.toFixed(4)}</span>
            </div>
            <div className={`flex items-center gap-2 mt-2 p-2 rounded ${aggregatedNorm.significant ? 'bg-green-900/30' : 'bg-gray-800'}`}>
              {aggregatedNorm.significant ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-gray-500" />
              )}
              <span className={`text-sm ${aggregatedNorm.significant ? 'text-green-400' : 'text-gray-500'}`}>
                {aggregatedNorm.significant ? 'Significant' : 'Not Significant'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 rounded-xl border border-blue-800 p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-300 mb-1">Why Tighter CIs Matter</h4>
            <p className="text-xs text-blue-200">
              Normalisation collapses the distinct regional distributions into a single scale, eliminating the between-region variance that inflates standard errors. With the same sample size, you get narrower confidence intervals, making it easier to detect true effects and reducing the risk that random regional imbalances create false positives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
