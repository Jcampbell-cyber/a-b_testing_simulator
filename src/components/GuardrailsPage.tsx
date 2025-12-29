import { useState, useMemo } from 'react';
import { GuardrailsControls, type TestType, type PeekingMode, type GuardrailType } from './GuardrailsControls';
import { runGuardrailsSimulation, type GuardrailsSimulationResults } from '../utils/guardrailsSimulation';
import { calculateMDE } from '../utils/mde';
import { GuardrailsTimelineChart } from './GuardrailsTimelineChart';
import { GuardrailsResultsDisplay } from './GuardrailsResultsDisplay';

export function GuardrailsPage() {
  const [testType, setTestType] = useState<TestType>('AA');
  const [baselineMean, setBaselineMean] = useState(1000);
  const [expectedUplift, setExpectedUplift] = useState(5);
  const [stdev, setStdev] = useState(400);
  const [sampleSize, setSampleSize] = useState(1000);
  const [testDuration, setTestDuration] = useState(14);
  const [numSimulations, setNumSimulations] = useState(100);
  const [guardrailType, setGuardrailType] = useState<GuardrailType>('statistical');
  const [manualGuardrail, setManualGuardrail] = useState(-5);
  const [statisticalConfidence, setStatisticalConfidence] = useState(99);
  const [peekingMode, setPeekingMode] = useState<PeekingMode>('weekly');
  const [peekingFrequency, setPeekingFrequency] = useState(5);
  const [results, setResults] = useState<GuardrailsSimulationResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const mde = useMemo(() => {
    return calculateMDE(sampleSize, stdev, baselineMean);
  }, [sampleSize, stdev, baselineMean]);

  const calculatePeeks = () => {
    if (peekingMode === 'daily') return testDuration;
    if (peekingMode === 'weekly') return Math.ceil(testDuration / 7);
    return peekingFrequency;
  };

  const handleRunSimulation = () => {
    setIsRunning(true);

    setTimeout(() => {
      const trueUplift = testType === 'AB' ? expectedUplift : 0;
      const actualPeeks = calculatePeeks();

      const simulationResults = runGuardrailsSimulation(
        trueUplift,
        baselineMean,
        stdev,
        sampleSize,
        numSimulations,
        guardrailType,
        manualGuardrail,
        statisticalConfidence,
        actualPeeks,
        testDuration
      );

      setResults(simulationResults);
      setIsRunning(false);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Guardrails Simulator</h1>
          <p className="text-lg text-gray-400">
            Simulate A/B tests with guardrails to detect when metrics fall below acceptable thresholds and stop tests early to prevent damage.
          </p>
        </div>

        <div className="mb-6">
          <GuardrailsControls
            testType={testType}
            baselineMean={baselineMean}
            expectedUplift={expectedUplift}
            stdev={stdev}
            sampleSize={sampleSize}
            numSimulations={numSimulations}
            guardrailType={guardrailType}
            manualGuardrail={manualGuardrail}
            statisticalConfidence={statisticalConfidence}
            peekingMode={peekingMode}
            peekingFrequency={peekingFrequency}
            testDuration={testDuration}
            mde={mde}
            onTestTypeChange={setTestType}
            onBaselineMeanChange={setBaselineMean}
            onExpectedUpliftChange={setExpectedUplift}
            onStdevChange={setStdev}
            onSampleSizeChange={setSampleSize}
            onNumSimulationsChange={setNumSimulations}
            onGuardrailTypeChange={setGuardrailType}
            onManualGuardrailChange={setManualGuardrail}
            onStatisticalConfidenceChange={setStatisticalConfidence}
            onPeekingModeChange={setPeekingMode}
            onPeekingFrequencyChange={setPeekingFrequency}
            onTestDurationChange={setTestDuration}
            onRunSimulation={handleRunSimulation}
            isRunning={isRunning}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GuardrailsResultsDisplay
            results={results}
            guardrailType={guardrailType}
            manualGuardrail={manualGuardrail}
            statisticalConfidence={statisticalConfidence}
          />

          {results && results.allTimelines.length > 0 && (
            <GuardrailsTimelineChart
              timelines={results.allTimelines}
              guardrailType={guardrailType}
              manualGuardrail={manualGuardrail}
              testDuration={testDuration}
            />
          )}
        </div>
      </div>
    </div>
  );
}
