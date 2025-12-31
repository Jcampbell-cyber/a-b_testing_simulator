import { NormalisationResults } from '../utils/normalisationSimulation';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Props {
  results: NormalisationResults;
}

export function NormalisationResultsDisplay({ results }: Props) {
  const { groups, aggregatedRaw, aggregatedNorm, trueEffectPercent } = results;

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl border border-red-900/50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-red-400">Raw Aggregation</h3>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Pooling raw values across regions with different price levels
          </p>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Control Mean</span>
              <span className="text-white font-mono">{aggregatedRaw.controlMean.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Treatment Mean</span>
              <span className="text-white font-mono">{aggregatedRaw.treatmentMean.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-700 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Absolute Lift</span>
                <span className={`font-mono font-medium ${aggregatedRaw.lift >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {aggregatedRaw.lift >= 0 ? '+' : ''}{aggregatedRaw.lift.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-400">Relative Lift</span>
                <span className={`font-mono font-medium ${aggregatedRaw.liftPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {aggregatedRaw.liftPercent >= 0 ? '+' : ''}{aggregatedRaw.liftPercent.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-400">p-value</span>
                <span className="text-white font-mono">{aggregatedRaw.pValue.toFixed(4)}</span>
              </div>
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

          <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-800/50">
            <p className="text-xs text-red-300">
              The aggregated mean is dominated by high-priced regions, making the result hard to interpret and potentially misleading.
            </p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-green-900/50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-green-400">Normalised Aggregation</h3>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Z-score standardisation within each region before pooling
          </p>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Control Mean (Z)</span>
              <span className="text-white font-mono">{aggregatedNorm.controlMean.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Treatment Mean (Z)</span>
              <span className="text-white font-mono">{aggregatedNorm.treatmentMean.toFixed(4)}</span>
            </div>
            <div className="border-t border-gray-700 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Effect (Z-score units)</span>
                <span className={`font-mono font-medium ${aggregatedNorm.lift >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {aggregatedNorm.lift >= 0 ? '+' : ''}{aggregatedNorm.lift.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-400">p-value</span>
                <span className="text-white font-mono">{aggregatedNorm.pValue.toFixed(4)}</span>
              </div>
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

          <div className="mt-4 p-3 bg-green-900/20 rounded-lg border border-green-800/50">
            <p className="text-xs text-green-300">
              Each region contributes equally to the result regardless of its local price level. The effect is measured in comparable units.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 rounded-xl border border-blue-800 p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-300 mb-1">Interpreting Normalised Results</h4>
            <p className="text-xs text-blue-200">
              After Z-score normalisation, the effect is measured in standard deviation units. A lift of 0.1 means the treatment moved outcomes by 0.1 standard deviations above control. This is comparable across regions regardless of their local price levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
