import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';
import { NormalisationControls } from './NormalisationControls';
import { NormalisationResultsDisplay } from './NormalisationResultsDisplay';
import { NormalisationHistogram } from './NormalisationHistogram';
import { runNormalisationSimulation, NormalisationResults, GroupConfig } from '../utils/normalisationSimulation';

interface Props {
  onBack: () => void;
}

const DEFAULT_GROUPS: GroupConfig[] = [
  { name: 'Southeast Asia', baselineMean: 25, baselineStd: 8 },
  { name: 'Europe', baselineMean: 75, baselineStd: 20 },
  { name: 'North America', baselineMean: 200, baselineStd: 50 }
];

export function NormalisationPage({ onBack }: Props) {
  const [groupConfigs, setGroupConfigs] = useState<GroupConfig[]>(DEFAULT_GROUPS);
  const [sampleSizePerGroup, setSampleSizePerGroup] = useState(1000);
  const [trueEffectPercent, setTrueEffectPercent] = useState(5);
  const [results, setResults] = useState<NormalisationResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleGroupConfigChange = (index: number, field: 'baselineMean' | 'baselineStd', value: number) => {
    const newConfigs = [...groupConfigs];
    newConfigs[index] = { ...newConfigs[index], [field]: value };
    setGroupConfigs(newConfigs);
  };

  const runSimulation = () => {
    setIsRunning(true);
    setTimeout(() => {
      const newResults = runNormalisationSimulation(groupConfigs, sampleSizePerGroup, trueEffectPercent);
      setResults(newResults);
      setIsRunning(false);
    }, 100);
  };

  useEffect(() => {
    runSimulation();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb
          items={[
            { label: 'Simulators', onClick: onBack },
            { label: 'Normalisation' }
          ]}
        />

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Simulators
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">Metric Normalisation</h1>
          <p className="text-gray-400">
            When running experiments across regions with different price levels, imbalanced user allocation can create spurious effects. Normalisation reduces variance by putting all regions on the same scale, leading to tighter confidence intervals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">The Problem</h3>
            <p className="text-sm text-gray-300 mb-3">
              Consider an experiment measuring order value across regions with different price levels. If randomisation happens to assign more users from a high-priced region to treatment, that group will show a higher average even if the treatment has no real effect.
            </p>
            <p className="text-sm text-gray-300">
              The raw data has high variance because values from different regions are on completely different scales. This inflates confidence intervals and makes it harder to detect true effects.
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <h3 className="text-lg font-semibold text-green-400 mb-3">The Solution</h3>
            <p className="text-sm text-gray-300 mb-3">
              Ideally, you would run separate experiments within each region and randomise within region to ensure balanced allocation. However, this isn't always practical - you may lack sufficient sample size per region, or operational constraints may prevent stratified randomisation.
            </p>
            <p className="text-sm text-gray-300 mb-3">
              When you must pool across regions, Z-score normalisation transforms each region's data to have mean 0 and standard deviation 1. This:
            </p>
            <ul className="space-y-1.5 text-sm text-gray-300">
              <li>Removes the scale differences between regions</li>
              <li>Dramatically reduces overall variance in the pooled data</li>
              <li>Produces tighter confidence intervals for the same sample size</li>
              <li>Prevents regional imbalances from creating false positives</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Normalisation Methods</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Method</th>
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Formula</th>
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">When to Use</th>
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800 bg-blue-900/20">
                  <td className="py-2 px-3 text-blue-400 font-medium">Z-score (Standardisation)</td>
                  <td className="py-2 px-3 text-gray-300 font-mono text-xs">x' = (x - mean) / std</td>
                  <td className="py-2 px-3 text-gray-300">Aggregation across regions</td>
                  <td className="py-2 px-3 text-gray-400">Widely used; centers and scales distribution</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2 px-3 text-white font-medium">Min-Max Scaling</td>
                  <td className="py-2 px-3 text-gray-300 font-mono text-xs">x' = (x - min) / (max - min)</td>
                  <td className="py-2 px-3 text-gray-300">Fixed, bounded range</td>
                  <td className="py-2 px-3 text-gray-400">Fast and intuitive; sensitive to outliers</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2 px-3 text-white font-medium">Divide by Max</td>
                  <td className="py-2 px-3 text-gray-300 font-mono text-xs">x' = x / max</td>
                  <td className="py-2 px-3 text-gray-300">Quick comparison, values greater than or equal to 0</td>
                  <td className="py-2 px-3 text-gray-400">Simpler; depends on max stability</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2 px-3 text-white font-medium">Percent-of-Mean</td>
                  <td className="py-2 px-3 text-gray-300 font-mono text-xs">x' = x / mean</td>
                  <td className="py-2 px-3 text-gray-300">Relative effect matters more</td>
                  <td className="py-2 px-3 text-gray-400">More interpretable in business settings</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            This simulator uses Z-score standardisation, highlighted above.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <NormalisationControls
              groupConfigs={groupConfigs}
              sampleSizePerGroup={sampleSizePerGroup}
              trueEffectPercent={trueEffectPercent}
              onGroupConfigChange={handleGroupConfigChange}
              onSampleSizeChange={setSampleSizePerGroup}
              onTrueEffectChange={setTrueEffectPercent}
              onRunSimulation={runSimulation}
              isRunning={isRunning}
            />
          </div>

          <div className="lg:col-span-3 space-y-4">
            {results && (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <NormalisationHistogram results={results} viewMode="raw" />
                  <NormalisationHistogram results={results} viewMode="normalised" />
                </div>
                <NormalisationResultsDisplay results={results} />
              </>
            )}
          </div>
        </div>

        <div className="mt-8 bg-amber-900/30 rounded-xl border border-amber-700 p-5">
          <h3 className="text-lg font-semibold text-amber-300 mb-2">When to Use Normalisation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-green-400 mb-2">Good Use Cases</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>Multi-region experiments with different price levels</li>
                <li>Cross-market analysis with currency differences</li>
                <li>Geographic regions with varying cost of living</li>
                <li>Markets at different maturity stages</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-red-400 mb-2">Caution Needed</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>When absolute revenue impact matters more than relative</li>
                <li>If regions have very different sample sizes</li>
                <li>When region-level effects need separate interpretation</li>
                <li>If normalisation parameters can be influenced by treatment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
