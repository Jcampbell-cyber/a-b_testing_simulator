import { useState } from 'react';
import { WinsorizingControls, type SimulationMode } from './WinsorizingControls';
import { WinsorizingDistributionChart } from './WinsorizingDistributionChart';
import { WinsorizingResultsDisplay } from './WinsorizingResultsDisplay';
import { runWinsorizingSimulation, runABTestSimulation, type WinsorizingResults, type ABTestResults } from '../utils/winsorizingSimulation';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

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
        <Helmet>
    <title>Test Duration Calculator for A/B Testing</title>
    <meta
      name="description"
      content="Estimate how long your A/B test needs to run to reach statistical significance. Adjust metric type, MDE, traffic, and flights for accurate test duration calculation."
    />
  </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Winsorizing Simulator</h1>
          <p className="text-lg text-gray-300">
            Understand how winsorizing handles outliers and improves statistical precision
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
            <h3 className="text-lg font-semibold text-white mb-3">What is Winsorizing?</h3>
            <p className="text-sm text-gray-300 mb-3">
              <strong className="text-white">Winsorizing</strong> is a statistical technique for handling skewed distributions and outliers by capping extreme values
              at a specified percentile threshold, rather than removing them entirely. It's particularly effective for metrics with heavy tails or extreme values.
            </p>
            <p className="text-sm text-gray-300 mb-2">For example, with 99th percentile winsorizing:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-gray-300">
              <li>All values above the 99th percentile are capped to the 99th percentile value</li>
              <li>All other values remain unchanged</li>
              <li>No data points are removed, preserving sample size</li>
            </ul>
            <p className="text-sm text-gray-400 mt-3">
              <strong>Why it works:</strong> In skewed distributions, extreme outliers inflate variance and widen confidence intervals, making it harder to detect real effects.
              By capping these values, you reduce noise without losing the information that these data points exist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
              <h3 className="text-lg font-semibold text-emerald-400 mb-3">Key Benefits</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><strong className="text-white">Reduces variance:</strong> Controls the influence of extreme outliers</li>
                <li><strong className="text-white">Narrows confidence intervals:</strong> More precise estimates</li>
                <li><strong className="text-white">Preserves sample size:</strong> No data points discarded</li>
                <li><strong className="text-white">Improves power:</strong> Better ability to detect true effects</li>
                <li><strong className="text-white">Robust estimation:</strong> More stable estimates of central tendency</li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Choosing the Right Threshold</h3>
              <p className="text-sm text-gray-300 mb-2">
                A lower percentile caps more values and produces greater variance reduction:
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><strong className="text-white">90-95%:</strong> Stronger CI reduction, risks introducing bias</li>
                <li><strong className="text-white">99%:</strong> Conservative, only addresses extreme outliers</li>
                <li><strong className="text-white">Common practice:</strong> 95th-99th percentile is typical</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-cyan-700/50 p-5">
            <h3 className="text-lg font-semibold text-cyan-400 mb-3">How to Apply in A/B Tests</h3>
            <p className="text-sm text-gray-300 mb-2">
              Calculate the percentile threshold using the <strong className="text-white">combined population</strong> (both control and treatment together), then apply this single threshold to all data.
            </p>
            <ul className="space-y-1.5 text-sm text-gray-300 mt-3">
              <li><strong className="text-white">Do:</strong> Pool all data, find the 99th percentile, cap both groups at that value</li>
              <li><strong className="text-white">Don't:</strong> Calculate separate thresholds for control and treatment</li>
            </ul>
            <p className="text-sm text-gray-400 mt-3">
              Since both groups share the same threshold, winsorizing can affect each group's mean differently depending on their outlier distribution. A group with more extreme outliers will see a larger reduction in mean.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
              <h3 className="text-lg font-semibold text-green-400 mb-3">When to Use</h3>
              <ul className="space-y-1.5 text-sm text-gray-300">
                <li>Revenue per user with whale customers</li>
                <li>Session duration with tabs left open</li>
                <li>Ad spend with high-value campaigns</li>
                <li>Time-to-complete with extreme outliers</li>
                <li>Retention metrics with unusual engagement</li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
              <h3 className="text-lg font-semibold text-red-400 mb-3">When NOT to Use</h3>
              <ul className="space-y-1.5 text-sm text-gray-300">
                <li>Binary metrics (conversion, CTR)</li>
                <li>Count metrics with natural bounds</li>
                <li>When outliers are key business outcomes</li>
                <li>Already normally distributed metrics</li>
                <li>Treatment targets high-value users</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-900/30 rounded-lg border border-amber-700 p-5">
            <h3 className="text-lg font-semibold text-amber-300 mb-2">Important Note</h3>
            <p className="text-sm text-amber-200">
              Winsorizing should be pre-specified in your analysis plan, not applied post-hoc to achieve desired results.
              Document your winsorizing strategy before analyzing results.
            </p>
          </div>
        </div>

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
        <div className="bg-gray-700 rounded-lg p-6 text-center mt-12">
  <p className="text-gray-300 mb-4">
    Normalisation helps make metrics comparable after outlier treatment
  </p>
  <Link
    to="/normalisation"
    className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded transition-colors"
  >
    Go to Normalisation →
  </Link>
</div>

      </div>
    </div>
  );
}
