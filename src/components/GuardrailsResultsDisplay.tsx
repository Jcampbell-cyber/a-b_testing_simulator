import { type GuardrailsSimulationResults } from '../utils/guardrailsSimulation';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface GuardrailsResultsDisplayProps {
  results: GuardrailsSimulationResults | null;
  guardrailType: 'manual' | 'statistical';
  manualGuardrail: number;
  statisticalConfidence: number;
}

export function GuardrailsResultsDisplay({
  results,
  guardrailType,
  manualGuardrail,
  statisticalConfidence,
}: GuardrailsResultsDisplayProps) {
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

  // Use the crossedGuardrail flag from simulation results (already computed correctly)
  const crossedGuardrailCount = results.allTimelines.filter((t) => t.crossedGuardrail).length;
  const crossedRate = (crossedGuardrailCount / results.totalRuns) * 100;

  const crossedButFinishedPositive = results.allTimelines.filter((t) => {
    if (!t.crossedGuardrail) return false;
    const lastPeek = t.peeks[t.peeks.length - 1];
    return lastPeek.lowerCI > 0;
  }).length;

  const finishedPositiveCount = results.allTimelines.filter((t) => {
    const lastPeek = t.peeks[t.peeks.length - 1];
    return lastPeek.lowerCI > 0;
  }).length;

  const crossedButPositiveRate = (crossedButFinishedPositive / results.totalRuns) * 100;
  const finishedPositiveRate = (finishedPositiveCount / results.totalRuns) * 100;

  return (
    <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        Guardrails Key Metrics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="font-semibold text-white">% Crossed Guardrail</h3>
          </div>
          <p className="text-3xl font-bold text-white">{crossedRate.toFixed(1)}%</p>
          <p className="text-sm text-red-300">
            {crossedGuardrailCount} of {results.totalRuns} runs
          </p>
        </div>

        <div className="bg-amber-900 border border-amber-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-white">
              % Crossed but Finished Positive
            </h3>
          </div>
          <p className="text-3xl font-bold text-white">{crossedButPositiveRate.toFixed(1)}%</p>
          <p className="text-sm text-amber-300">
            {crossedButFinishedPositive} of {results.totalRuns} runs
          </p>
        </div>

        <div className="bg-emerald-900 border border-emerald-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white">
              % Finished Positive
            </h3>
          </div>
          <p className="text-3xl font-bold text-white">{finishedPositiveRate.toFixed(1)}%</p>
          <p className="text-sm text-emerald-300">
            {finishedPositiveCount} of {results.totalRuns} runs
          </p>
        </div>
      </div>
    </div>
  );
}
 