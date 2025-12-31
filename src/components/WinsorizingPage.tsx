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
  const [outlierRate, setOutlierRate] = useState(0.05);
  const [outlierMagnitude, setOutlierMagnitude] = useState(5);
  const [lowerPercentile, setLowerPercentile] = useState(1);
  const [upperPercentile, setUpperPercentile] = useState(99);
  const [treatmentUplift, setTreatmentUplift] = useState(5);
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
          outlierRate,
          outlierMagnitude,
          lowerPercentile,
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
          outlierRate,
          outlierMagnitude,
          lowerPercentile,
          upperPercentile
        );
        setAbTestResults(abResults);
        setResults(null);
      }
      setIsRunning(false);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Winsorizing Simulator</h1>
          <p className="text-lg text-gray-600">
            Understand how winsorizing handles outliers and improves statistical precision
          </p>
        </div>

        <InfoSection
          title="What is Winsorizing?"
          content={
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>Winsorizing</strong> is a statistical technique for handling outliers by replacing extreme values
                with less extreme values at specified percentile thresholds, rather than removing them entirely.
              </p>
              <p>
                For example, with 1st and 99th percentile winsorizing:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>All values below the 1st percentile are replaced with the 1st percentile value</li>
                <li>All values above the 99th percentile are replaced with the 99th percentile value</li>
                <li>All other values remain unchanged</li>
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
                <li>When you have a metric with heavy-tailed distributions or outliers</li>
                <li>In A/B testing with high-variance metrics like revenue or session duration</li>
                <li>When outliers are legitimate but shouldn't dominate the analysis</li>
                <li>To make results more robust to extreme values while maintaining sample size</li>
              </ul>
              <p className="mt-3 text-amber-700 bg-amber-50 p-2 rounded">
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
              outlierRate={outlierRate}
              setOutlierRate={setOutlierRate}
              outlierMagnitude={outlierMagnitude}
              setOutlierMagnitude={setOutlierMagnitude}
              lowerPercentile={lowerPercentile}
              setLowerPercentile={setLowerPercentile}
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
                  lowerPercentile={lowerPercentile}
                  upperPercentile={upperPercentile}
                />
                <WinsorizingResultsDisplay results={results} abTestResults={null} mode="single" />
              </>
            )}

            {abTestResults && mode === 'abtest' && (
              <WinsorizingResultsDisplay results={null} abTestResults={abTestResults} mode="abtest" />
            )}

            {!results && !abTestResults && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-500">Configure parameters and click "Run Simulation" to see results</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <InfoSection
            title="Understanding the Results"
            content={
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <strong>Single Sample Mode:</strong> Compare statistics between original and winsorized data to see
                  how outlier treatment affects mean, standard deviation, and confidence intervals.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Distribution Chart:</strong> Shows original values with red markers indicating outliers that will be capped</li>
                  <li><strong>Histogram Comparison:</strong> Visual comparison of original vs. winsorized distributions</li>
                  <li><strong>CI Width Reduction:</strong> Percentage decrease in confidence interval width after winsorizing</li>
                  <li><strong>Standard Deviation:</strong> Reduction in variability after capping extreme values</li>
                </ul>
                <p className="mt-3">
                  <strong>A/B Test Mode:</strong> See how winsorizing affects statistical significance and effect size estimates
                  in a two-sample comparison.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>P-Value Comparison:</strong> How statistical significance changes with and without winsorizing</li>
                  <li><strong>Effect Size:</strong> More stable lift estimates with reduced outlier influence</li>
                  <li><strong>Confidence Intervals:</strong> Narrower CIs typically lead to more decisive test results</li>
                </ul>
                <p className="mt-3 text-blue-700 bg-blue-50 p-2 rounded">
                  <strong>Pro Tip:</strong> Try different outlier rates (2-10%) and percentile thresholds (1-10% and 90-99%)
                  to see how they affect your results. Common choices are 1st/99th (default) or 5th/95th percentiles.
                </p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
