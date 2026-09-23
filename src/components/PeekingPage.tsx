import { useState, useMemo } from 'react';
import { PeekingControls, type TestType, type PeekingMode } from './PeekingControls';
import { runPeekingSimulation, type PeekingSimulationResults } from '../utils/peekingSimulation';
import { calculateMDE } from '../utils/mde';
import { PeekingTimelineChart } from './PeekingTimelineChart';
import { PeekingResultsDisplay } from './PeekingResultsDisplay';
import { Helmet } from "react-helmet-async";
import { Link } from 'react-router-dom';

export function PeekingPage() {
  const [testType, setTestType] = useState<TestType>('AA');
  const [baselineMean, setBaselineMean] = useState(1000);
  const [expectedUplift, setExpectedUplift] = useState(5);
  const [stdev, setStdev] = useState(400);
  const [sampleSize, setSampleSize] = useState(1000);
  const [testDuration, setTestDuration] = useState(28);
  const [numSimulations, setNumSimulations] = useState(100);
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [peekingMode, setPeekingMode] = useState<PeekingMode>('daily');
  const [peekingFrequency, setPeekingFrequency] = useState(5);
  const [results, setResults] = useState<PeekingSimulationResults | null>(null);
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

      const simulationResults = runPeekingSimulation(
        trueUplift,
        baselineMean,
        stdev,
        sampleSize,
        numSimulations,
        confidenceLevel,
        actualPeeks,
        testDuration
      );

      setResults(simulationResults);
      setIsRunning(false);
    }, 100);
  };

  return (
    <div className="bg-gray-900"> 
      <Helmet>
        <title>Peeking Analysis Tool | Your Brand</title>
        <meta name="description" content="Explore how frequent checking of test results impacts false positive rates and experiment reliability." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Peeking Simulator</h1>
          <p className="text-lg text-gray-300">
            Simulate A/B tests with multiple peeks to understand false positive rates when checking results before test completion.
          </p>
        </div>

        <div className="mb-6">
          <PeekingControls
            testType={testType}
            baselineMean={baselineMean}
            expectedUplift={expectedUplift}
            stdev={stdev}
            sampleSize={sampleSize}
            numSimulations={numSimulations}
            confidenceLevel={confidenceLevel}
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
            onConfidenceLevelChange={setConfidenceLevel}
            onPeekingModeChange={setPeekingMode}
            onPeekingFrequencyChange={setPeekingFrequency}
            onTestDurationChange={setTestDuration}
            onRunSimulation={handleRunSimulation}
            isRunning={isRunning}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PeekingResultsDisplay results={results} confidenceLevel={confidenceLevel} />

          {results && results.allTimelines.length > 0 && (
            <PeekingTimelineChart
              timelines={results.allTimelines}
              confidenceLevel={confidenceLevel}
              testDuration={testDuration}
            />
          )}
        </div>

        <div className="mt-8 bg-gray-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Understanding the Visualisation</h2>
          <div className="text-gray-300 space-y-3">
            <p>
              The visualization demonstrates how frequent checking (peeking) inflates the false positive rate beyond your chosen significance level. Each time you check your test results, you're essentially running a new hypothesis test, increasing the probability of finding a significant result by chance alone.
            </p>
            <p>
              In the timeline chart, you can see how p-values fluctuate naturally throughout the test duration. When peeking frequently, you're more likely to catch a moment when the p-value dips below your significance threshold (e.g., 0.05) even when there's no true effect (A/A test).
            </p>
            <p>
              <strong>Key insight:</strong> The more often you check your results, the higher your actual false positive rate becomes. For example, if you check daily over 28 days with α = 0.05, your true false positive rate can exceed 20-30%, far above the intended 5%. This is why it's critical to either:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Wait until your predetermined sample size is reached before checking</li>
              <li>Use sequential testing methods (e.g., always valid p-values, spending functions)</li>
              <li>Apply multiple testing corrections (e.g., Bonferroni) to your significance threshold</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 bg-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-300 mb-4">
            Learn how peeking and frequent checks relate to experimental guardrails.
          </p>
          <Link
            to="/resources/best-practices/guardrails"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded transition-colors"
          >
            Learn About Setting Statistical Guardrails →
          </Link>
        </div>
      </div>
    </div>
  );
}