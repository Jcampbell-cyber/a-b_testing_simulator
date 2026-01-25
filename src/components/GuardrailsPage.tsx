import { useState, useMemo } from 'react';
import { GuardrailsControls, type TestType, type PeekingMode, type GuardrailType } from './GuardrailsControls';
import { runGuardrailsSimulation, type GuardrailsSimulationResults } from '../utils/guardrailsSimulation';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { calculateMDE } from '../utils/mde';
import { GuardrailsTimelineChart } from './GuardrailsTimelineChart';
import { GuardrailsResultsDisplay } from './GuardrailsResultsDisplay';

export function GuardrailsPage() {
  const [testType, setTestType] = useState<TestType>('AA');
  const [baselineMean, setBaselineMean] = useState(1000);
  const [expectedUplift, setExpectedUplift] = useState(5);
  const [stdev, setStdev] = useState(400);
  const [sampleSize, setSampleSize] = useState(1000);
  const [testDuration, setTestDuration] = useState(28);
  const [numSimulations, setNumSimulations] = useState(100);
  const [guardrailType, setGuardrailType] = useState<GuardrailType>('statistical');
  const [manualGuardrail, setManualGuardrail] = useState(-5);
  const [statisticalConfidence, setStatisticalConfidence] = useState(99);
  const [peekingMode, setPeekingMode] = useState<PeekingMode>('daily');
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
<Helmet>
  <title>Statistical Guardrails for A/B Tests</title>
  <meta
    name="description"
    content="Learn how to set up statistical guardrails in A/B tests to monitor experiment health, reduce false positives, and stop harmful experiments early."
  />
</Helmet>

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

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Understanding Guardrails</h2>
          <div className="text-gray-300 space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Manual Guardrails</h3>
              <p>
                Manual guardrails use fixed thresholds (e.g., stop if metric drops below -5%) to protect against severe negative impacts. While simple and intuitive, they have a significant drawback: <strong>high variance early in the test can easily trigger false alarms</strong>.
              </p>
              <p className="mt-2">
                With limited early data, natural statistical fluctuations can cause metrics to temporarily breach your manual threshold even when no real harm is occurring. This leads to prematurely stopping potentially neutral or positive experiments.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Statistical Guardrails</h3>
              <p>
                Statistical guardrails account for variance by requiring <strong>statistical significance</strong> of the negative effect before triggering. They use confidence intervals (e.g., 99% confidence) to determine if the observed drop is likely real or just noise.
              </p>
              <p className="mt-2">
                This approach is far more robust: it's extremely unlikely for a metric to show a statistically significant -99% effect and then recover to become significantly positive. Statistical guardrails adapt to sample size—requiring stronger evidence when data is limited—making them ideal for continuous monitoring throughout your test.
              </p>
            </div>
            <div className="bg-gray-700 rounded p-4 mt-4">
              <p className="text-sm">
                <strong>Recommendation:</strong> Use statistical guardrails for ongoing monitoring, as they balance safety with statistical rigor. Reserve manual guardrails only for absolute red-line thresholds where any breach—regardless of statistical significance—requires immediate action.
              </p>
              <p className="text-sm">
                <strong>Peeking frequency:</strong> Weekly guardrail checks reduce false early stops compared to daily monitoring. Daily peeks inflate volatility at low sample sizes, increasing noise-driven guardrail breaches without improving detection of genuinely harmful effects.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-6 text-center mt-12">
          <p className="text-gray-300 mb-4">
            Imbalanced exposure can distort guardrail metrics in A/B tests
          </p>
          <Link
            to="/imbalanced"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded transition-colors"
          >
            Go to Imbalanced Experiments →
          </Link>
        </div>

      </div>
    </div>
  );
}
