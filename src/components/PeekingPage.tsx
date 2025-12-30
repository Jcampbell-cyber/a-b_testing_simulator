import { useState, useMemo } from 'react';
import { PeekingControls, type TestType, type PeekingMode } from './PeekingControls';
import { runPeekingSimulation, type PeekingSimulationResults } from '../utils/peekingSimulation';
import { calculateMDE } from '../utils/mde';
import { PeekingTimelineChart } from './PeekingTimelineChart';
import { PeekingResultsDisplay } from './PeekingResultsDisplay';

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
    <div className="min-h-screen bg-gray-900">
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
      </div>
    </div>
  );
}
