import { useState } from 'react';
import { Network } from 'lucide-react';
import { FWERMethodologyExplainer } from './FWERMethodologyExplainer';
import { FWERControls } from './FWERControls';
import { FWERResultsDisplay } from './FWERResultsDisplay';
import { FWERErrorRateChart } from './FWERErrorRateChart';
import { runFWERSimulation, type FWERSimulationResults } from '../utils/fwerSimulation';

export function FWERPage() {
  const [testType, setTestType] = useState<'aa' | 'ab'>('ab');
  const [numFlights, setNumFlights] = useState(3);
  const [comparisonType, setComparisonType] = useState<'pairwise' | 'control'>('pairwise');
  const [baselineMean, setBaselineMean] = useState(1000);
  const [stdev, setStdev] = useState(400);
  const [sampleSize, setSampleSize] = useState(1000);
  const [alpha, setAlpha] = useState(0.05);
  const [trueUplift, setTrueUplift] = useState(5);
  const [numSimulations, setNumSimulations] = useState(100);
  const [results, setResults] = useState<FWERSimulationResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunSimulation = () => {
    setIsRunning(true);
    setTimeout(() => {
      const effectiveUplift = testType === 'aa' ? 0 : trueUplift;
      const simulationResults = runFWERSimulation(
        numFlights,
        comparisonType,
        baselineMean,
        stdev,
        sampleSize,
        alpha,
        effectiveUplift,
        numSimulations
      );
      setResults(simulationResults);
      setIsRunning(false);
    }, 100);
  };

  const numComparisons = comparisonType === 'pairwise'
    ? (numFlights * (numFlights - 1)) / 2
    : numFlights - 1;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Network className="w-8 h-8 text-emerald-600" />
            <h1 className="text-4xl font-bold text-white">Family-Wise Error Rate Simulator</h1>
          </div>
          <p className="text-lg text-gray-400">
            Explore how multiple comparison corrections (Bonferroni, Holm, Tukey, Dunnett) affect false positive and false negative error rates when testing multiple hypotheses simultaneously.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">The Multiple Comparisons Problem</h2>

          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-emerald-400 mb-2">Why This Matters</h3>
              <p>
                When testing multiple flights (variants) simultaneously, each individual test might use α = 0.05, giving a 5% chance of a false positive.
                But when you run multiple tests, the probability that <span className="font-semibold text-white">at least one</span> produces a false positive increases dramatically.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-400 mb-2">Understanding Pairwise Comparisons</h3>
              {comparisonType === 'pairwise' ? (
                <div>
                  <p>
                    With {numFlights} flights (including control), pairwise comparisons test every possible combination:
                  </p>
                  <div className="mt-3 bg-gray-900 rounded p-4">
                    <p className="font-semibold text-white mb-2">Example with {numFlights} flights:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      {numFlights === 3 && (
                        <>
                          <li>A vs B</li>
                          <li>A vs C</li>
                          <li>B vs C</li>
                        </>
                      )}
                      {numFlights === 4 && (
                        <>
                          <li>A vs B, A vs C, A vs D</li>
                          <li>B vs C, B vs D</li>
                          <li>C vs D</li>
                        </>
                      )}
                      {numFlights > 4 && (
                        <li className="text-gray-400">({numComparisons} total pairwise comparisons)</li>
                      )}
                    </ul>
                    <p className="mt-3 text-sm font-semibold text-emerald-400">
                      Total comparisons: n × (n-1) / 2 = {numFlights} × {numFlights - 1} / 2 = {numComparisons}
                    </p>
                  </div>
                  <p className="mt-3">
                    <strong>This grows quickly:</strong> 3 flights = 3 comparisons, 4 flights = 6 comparisons, 5 flights = 10 comparisons, 6 flights = 15 comparisons. The number of comparisons grows quadratically with the number of flights!
                  </p>
                </div>
              ) : (
                <p>
                  With control comparisons, you only test each variant against the control: {numFlights - 1} comparisons total (each treatment vs. control).
                </p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-400 mb-2">The Math Behind It</h3>
              <p>
                With <span className="font-semibold text-white">{numComparisons} independent comparisons</span>,
                the probability of making <span className="font-semibold text-red-400">at least one false positive</span> (Family-Wise Error Rate) without correction is:
              </p>
              <p className="mt-2 text-center bg-gray-900 rounded p-3 font-mono">
                FWER = 1 - (1 - α)ⁿ = 1 - (1 - {alpha})^{numComparisons} = {((1 - Math.pow(1 - alpha, numComparisons)) * 100).toFixed(1)}%
              </p>
              <p className="mt-2 text-sm text-gray-400">
                That's <span className="font-semibold text-red-400">{((1 - Math.pow(1 - alpha, numComparisons)) / alpha).toFixed(1)}x higher</span> than your nominal α = {alpha} threshold!
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-400 mb-2">Real-World Scenario</h3>
              <p>
                In A/B/n testing, you might test multiple variations of a product feature. Without proper correction:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>You'll falsely declare "winners" far too often in A/A tests</li>
                <li>Your published results will be misleading and unreliable</li>
                <li>Downstream teams will waste resources implementing changes that don't actually work</li>
              </ul>
              <p className="mt-3">
                <span className="font-semibold text-white">FWER correction methods</span> adjust your significance thresholds to maintain the overall error rate at your desired level,
                preventing false discoveries while balancing the trade-off with statistical power.
              </p>
            </div>
          </div>
        </div>

        <FWERControls
          testType={testType}
          numFlights={numFlights}
          comparisonType={comparisonType}
          baselineMean={baselineMean}
          stdev={stdev}
          sampleSize={sampleSize}
          alpha={alpha}
          trueUplift={trueUplift}
          numSimulations={numSimulations}
          onTestTypeChange={setTestType}
          onNumFlightsChange={setNumFlights}
          onComparisonTypeChange={setComparisonType}
          onBaselineMeanChange={setBaselineMean}
          onStdevChange={setStdev}
          onSampleSizeChange={setSampleSize}
          onAlphaChange={setAlpha}
          onTrueUpliftChange={setTrueUplift}
          onNumSimulationsChange={setNumSimulations}
          onRunSimulation={handleRunSimulation}
          isRunning={isRunning}
        />

        {results && (
          <div className="mt-8 space-y-6">
            <FWERResultsDisplay
              results={results}
              testType={testType}
              numFlights={numFlights}
              comparisonType={comparisonType}
            />

            <FWERMethodologyExplainer
              alpha={alpha}
              numFlights={numFlights}
              comparisonType={comparisonType}
            />

            <div className="mt-8">
              <FWERErrorRateChart
                comparisonType={comparisonType}
                baselineMean={baselineMean}
                stdev={stdev}
                sampleSize={sampleSize}
                alpha={alpha}
                trueUplift={trueUplift}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}