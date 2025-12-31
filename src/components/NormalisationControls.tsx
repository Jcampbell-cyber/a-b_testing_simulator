import { RefreshCw } from 'lucide-react';
import { GroupConfig } from '../utils/normalisationSimulation';

interface Props {
  groupConfigs: GroupConfig[];
  sampleSizePerGroup: number;
  trueEffectPercent: number;
  onGroupConfigChange: (index: number, field: 'baselineMean' | 'baselineStd', value: number) => void;
  onSampleSizeChange: (value: number) => void;
  onTrueEffectChange: (value: number) => void;
  onRunSimulation: () => void;
  isRunning: boolean;
}

export function NormalisationControls({
  groupConfigs,
  sampleSizePerGroup,
  trueEffectPercent,
  onGroupConfigChange,
  onSampleSizeChange,
  onTrueEffectChange,
  onRunSimulation,
  isRunning
}: Props) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
      <h3 className="text-lg font-semibold text-white mb-4">Simulation Parameters</h3>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Segment Configurations
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Each segment has a different baseline distribution (e.g., different markets, user types, or product categories)
          </p>

          <div className="space-y-3">
            {groupConfigs.map((config, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="text-sm font-medium text-gray-200 mb-2">{config.name}</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Baseline Mean</label>
                    <input
                      type="number"
                      value={config.baselineMean}
                      onChange={(e) => onGroupConfigChange(index, 'baselineMean', Number(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Std Dev</label>
                    <input
                      type="number"
                      value={config.baselineStd}
                      onChange={(e) => onGroupConfigChange(index, 'baselineStd', Number(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Sample Size per Segment: {sampleSizePerGroup.toLocaleString()}
          </label>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={sampleSizePerGroup}
            onChange={(e) => onSampleSizeChange(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>100</span>
            <span>5,000</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            True Treatment Effect: {trueEffectPercent}%
          </label>
          <p className="text-xs text-gray-500 mb-2">
            The same relative effect is applied to all segments
          </p>
          <input
            type="range"
            min="-10"
            max="20"
            step="0.5"
            value={trueEffectPercent}
            onChange={(e) => onTrueEffectChange(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>-10%</span>
            <span>+20%</span>
          </div>
        </div>

        <button
          onClick={onRunSimulation}
          disabled={isRunning}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Running...' : 'Run Simulation'}
        </button>
      </div>
    </div>
  );
}
