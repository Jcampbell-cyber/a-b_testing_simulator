import { useState } from 'react';
import { WinsorizingControls, type SimulationMode } from './WinsorizingControls';
import { WinsorizingDistributionChart } from './WinsorizingDistributionChart';
import { WinsorizingResultsDisplay } from './WinsorizingResultsDisplay';
import { runWinsorizingSimulation, runABTestSimulation, type WinsorizingResults, type ABTestResults } from '../utils/winsorizingSimulation';
import { InfoSection } from './InfoSection';

export function WinsorizingPage() {
  const [mode, setMode] = useState<SimulationMode>('single');
  const [sampleSize, setSampleSize] = useState(1000);
  const [baselineMean, setBaselineMean] = useState(1000);
  const [baselineStd, setBaselineStd] = useState(300);
  const [upperPercentile, setUpperPercentile] = useState(99);
  const [treatmentUplift, setTreatmentUplift] = useState(3);
  const [results, setResults] = useState<WinsorizingResults | null>(null);
  const [abTestResults, setAbTestResults] = useState<ABTestResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleSimulate = () => {
    setIsRunning(true);
    setTimeout(() => {
      if (mode === 'single') {
        const simResults = runWinsorizingSimulation(
          sampleSize,
          baselineMean,
          baselineStd,
          upperPercentile
        );
        setResults(simResults);
        setAbTestResults(null);
      } else {
        const abResults = runABTestSimulation(
          sampleSize,
          baselineMean,
          treatmentUplift,
          baselineStd,
          upperPercentile
        );
        setAbTestResults(abResults);
        setResults(null);
      }
      setIsRunning(false);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Winsorizing Simulator</h1>
          <p className="text-lg text-gray-300">
            Understand how winsorizing handles outliers and improves statistical precision
          </p>
        </div>

        <InfoSection
          title="What is Winsorizing?"
          content={
            <div className="space-y-3 text-sm">
              <p>
                <strong>Winsorizing</strong> is a statistical technique for handling outliers by capping extreme values
                at a specified percentile threshold, rather than removing them entirely.
              </p>
              <p>
                For example, with 99th percentile winsorizing:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>All values above the 99th percentile are capped to the 99th percentile value</li>
                <li>All other values remain unchanged</li>
                <li>No data points are removed, preserving sample size</li>
              </ul>
              <p className="mt-3">
                <strong>Key Benefits:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Reduces variance:</strong> Controls the influence of extreme outliers on statistical measures</li>
                <li><strong>Narrows confidence intervals:</strong> More precise estimates with smaller confidence intervals</li>
                <li><strong>Preserves sample size:</strong> Unlike trimming, no data points are discarded</li>
                <li><strong>Improves power:</strong> Can increase the ability to detect true effects in experiments</li>
                <li><strong>Robust estimation:</strong> Provides more stable estimates of central tendency</li>
              </ul>
              <p className="mt-3">
                <strong>When to Use Winsorizing:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Revenue per user in e-commerce where a few whale customers skew results</li>
                <li>Session duration metrics where some users leave tabs open for days</li>
                <li>Ad spend metrics with occasional very high-value campaigns</li>
                <li>Time-to-complete metrics with legitimate but extreme outliers</li>
                <li>Retention metrics where a small subset has unusually high engagement</li>
              </ul>
              <p className="mt-3">
                <strong>When NOT to Use Winsorizing:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Binary metrics (conversion rate, click-through rate) - use as is</li>
                <li>Count metrics with natural bounds (pages viewed: 1-10) - already constrained</li>
                <li>When outliers represent your key business outcomes (viral content, premium sales)</li>
                <li>Metrics that are already normally distributed without extreme tails</li>
                <li>When the treatment specifically targets high-value users or edge cases</li>
              </ul>
              <p className="mt-3">
                <strong>Choosing the Right Threshold:</strong>
              </p>
              <p>
                A lower percentile threshold (e.g., 95th vs 99th) caps more values and produces greater variance reduction:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li><strong>Lower threshold (90-95%):</strong> Stronger CI reduction, but risks introducing bias by modifying too much data</li>
                <li><strong>Higher threshold (99%):</strong> More conservative, only addresses extreme outliers with minimal bias risk</li>
                <li><strong>Common practice:</strong> 95th-99th percentile is typical; start conservative and justify more aggressive thresholds</li>
              </ul>
              <p className="mt-3">
                <strong>Effect on A/B Tests:</strong> Winsorizing will not always change the observed uplift (since it affects both control and treatment equally), but it should consistently reduce confidence interval width. This means tests become more sensitive to detecting true effects without systematically biasing the point estimate.
              </p>
              <p className="mt-3 text-amber-300 bg-amber-900/30 p-2 rounded border border-amber-800">
                <strong>Important:</strong> Winsorizing should be pre-specified in your analysis plan, not applied
                post-hoc to achieve desired results. Document your winsorizing strategy before analyzing results.
              </p>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-1">
            <WinsorizingControls
              mode={mode}
              setMode={setMode}
              sampleSize={sampleSize}
              setSampleSize={setSampleSize}
              baselineMean={baselineMean}
              setBaselineMean={setBaselineMean}
              baselineStd={baselineStd}
              setBaselineStd={setBaselineStd}
              upperPercentile={upperPercentile}
              setUpperPercentile={setUpperPercentile}
              treatmentUplift={treatmentUplift}
              setTreatmentUplift={setTreatmentUplift}
              onSimulate={handleSimulate}
              isRunning={isRunning}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {results && mode === 'single' && (
              <>
                <WinsorizingDistributionChart
                  originalData={results.original.data}
                  winsorizedData={results.winsorized.data}
                  upperPercentile={upperPercentile}
                />
                <WinsorizingResultsDisplay results={results} abTestResults={null} mode="single" />
              </>
            )}

            {abTestResults && mode === 'abtest' && (
              <WinsorizingResultsDisplay results={null} abTestResults={abTestResults} mode="abtest" />
            )}

            {!results && !abTestResults && (
              <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-12 text-center">
                <p className="text-gray-400">Configure parameters and click "Run Simulation" to see results</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Understanding the Results</h2>
          <div className="text-gray-300 space-y-3">
            <p>
              <strong>Single Sample Mode:</strong> Compare statistics between original and winsorized data to see
              how outlier treatment affects mean, standard deviation, and confidence intervals.
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>Distribution Chart:</strong> Shows original values with red markers indicating outliers that will be capped</li>
              <li><strong>Histogram Comparison:</strong> Visual comparison of original vs. winsorized distributions</li>
              <li><strong>CI Width Reduction:</strong> Percentage decrease in confidence interval width after winsorizing</li>
              <li><strong>Standard Deviation:</strong> Reduction in variability after capping extreme values</li>
            </ul>
            <p className="mt-3">
              <strong>A/B Test Mode:</strong> See how winsorizing affects statistical significance and effect size estimates
              in a two-sample comparison.
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>P-Value Comparison:</strong> How statistical significance changes with and without winsorizing</li>
              <li><strong>Effect Size:</strong> More stable lift estimates with reduced outlier influence</li>
              <li><strong>Confidence Intervals:</strong> Narrower CIs typically lead to more decisive test results</li>
            </ul>
            <p className="mt-3">
              <strong>Key insight:</strong> Winsorizing reduces the impact of extreme outliers while preserving sample size. By capping values at the upper percentile threshold, you prevent a few extreme observations from dominating your variance estimates and inflating confidence intervals. This often results in more statistically sensitive tests without removing legitimate data points.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
