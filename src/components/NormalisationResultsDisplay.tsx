import { NormalisationResults } from '../utils/normalisationSimulation';
import { CheckCircle, XCircle } from 'lucide-react';

interface Props {
  results: NormalisationResults;
}

export function NormalisationResultsDisplay({ results }: Props) {
  const { groups, aggregatedRaw, aggregatedNorm } = results;

  const ciWidthRawPercent = aggregatedRaw.ci95Percent[1] - aggregatedRaw.ci95Percent[0];
  const ciWidthNormPercent = aggregatedNorm.ci95Percent[1] - aggregatedNorm.ci95Percent[0];

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
                <th className="text-right py-2 px-3 text-gray-400 font-medium">% Lift</th>
                <th className="text-right py-2 px-3 text-gray-400 font-medium">Z-Score Ctrl</th>
                <th className="text-right py-2 px-3 text-gray-400 font-medium">Z-Score Trt</th>
                <th className="text-right py-2 px-3 text-gray-400 font-medium">Z % Lift</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group, index) => (
                <tr key={index} className="border-b border-gray-800">
                  <td className="py-2 px-3 text-white font-medium">{group.name}</td>
                  <td className="py-2 px-3 text-right text-gray-400">{group.baselineMean.toFixed(1)}</td>
                  <td className="py-2 px-3 text-right text-gray-300">{group.rawControlMean.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right text-gray-300">{group.rawTreatmentMean.toFixed(2)}</td>
                  <td className={`py-2 px-3 text-right font-medium ${group.rawLiftPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {group.rawLiftPercent >= 0 ? '+' : ''}{group.rawLiftPercent.toFixed(1)}%
                  </td>
                  <td className="py-2 px-3 text-right text-blue-300">{group.normControlMean.toFixed(3)}</td>
                  <td className="py-2 px-3 text-right text-blue-300">{group.normTreatmentMean.toFixed(3)}</td>
                  <td className={`py-2 px-3 text-right font-medium ${group.normLiftPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {group.normLiftPercent >= 0 ? '+' : ''}{group.normLiftPercent.toFixed(1)}%
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-700 bg-gray-800/50">
                <td className="py-2 px-3 text-white font-bold">Total</td>
                <td className="py-2 px-3 text-right text-gray-400">-</td>
                <td className="py-2 px-3 text-right text-white font-semibold">{aggregatedRaw.controlMean.toFixed(2)}</td>
                <td className="py-2 px-3 text-right text-white font-semibold">{aggregatedRaw.treatmentMean.toFixed(2)}</td>
                <td className={`py-2 px-3 text-right font-bold ${aggregatedRaw.liftPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {aggregatedRaw.liftPercent >= 0 ? '+' : ''}{aggregatedRaw.liftPercent.toFixed(1)}%
                </td>
                <td className="py-2 px-3 text-right text-blue-400 font-semibold">{aggregatedNorm.controlMean.toFixed(3)}</td>
                <td className="py-2 px-3 text-right text-blue-400 font-semibold">{aggregatedNorm.treatmentMean.toFixed(3)}</td>
                <td className={`py-2 px-3 text-right font-bold ${aggregatedNorm.liftPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {aggregatedNorm.liftPercent >= 0 ? '+' : ''}{aggregatedNorm.liftPercent.toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Z-scores standardize each region's values using that region's mean and std dev, putting all regions on a comparable scale before pooling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl border border-red-900/50 p-5">
          <h3 className="text-lg font-semibold text-red-400 mb-3">Raw Aggregation</h3>
          <p className="text-xs text-gray-400 mb-4">
            Pooling raw values across regions with different price levels
          </p>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Lift (%)</span>
              <span className={`font-mono font-medium ${aggregatedRaw.liftPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {aggregatedRaw.liftPercent >= 0 ? '+' : ''}{aggregatedRaw.liftPercent.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">95% CI (%)</span>
              <span className="text-white font-mono text-sm">
                [{aggregatedRaw.ci95Percent[0].toFixed(2)}%, {aggregatedRaw.ci95Percent[1].toFixed(2)}%]
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">CI Width (%)</span>
              <span className="text-red-400 font-mono font-medium">{ciWidthRawPercent.toFixed(2)}%</span>
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
              <span className="text-gray-400">Lift (%)</span>
              <span className={`font-mono font-medium ${aggregatedNorm.liftPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {aggregatedNorm.liftPercent >= 0 ? '+' : ''}{aggregatedNorm.liftPercent.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">95% CI (%)</span>
              <span className="text-white font-mono text-sm">
                [{aggregatedNorm.ci95Percent[0].toFixed(2)}%, {aggregatedNorm.ci95Percent[1].toFixed(2)}%]
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">CI Width (%)</span>
              <span className="text-green-400 font-mono font-medium">{ciWidthNormPercent.toFixed(2)}%</span>
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
