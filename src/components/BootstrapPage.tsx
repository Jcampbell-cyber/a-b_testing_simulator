import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BootstrapControls } from './BootstrapControls';
import { runBootstrapSimulation } from './bootstrapSimulation';
import { BootstrapChart } from './BootstrapChart';
import { BootstrapComparison } from './BootstrapComparison';

export function BootstrapPage() {
  const [distribution, setDistribution] = useState<'normal' | 'skewed' | 'bimodal'>('normal');
  const [sampleSize, setSampleSize] = useState(50);
  const [numResamples, setNumResamples] = useState(1000);
  const [metric, setMetric] = useState<'mean' | 'median'>('mean');
  const [results, setResults] = useState<BootstrapResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);

    setTimeout(() => {
      const res = runBootstrapSimulation({
        distribution,
        sampleSize,
        numResamples,
        metric,
      });

      setResults(res);
      setIsRunning(false);
    }, 50);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Helmet>
        <title>Bootstrap Simulator</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl text-white font-bold mb-2">
          Bootstrap Simulator
        </h1>
        <p className="text-gray-400 mb-6">
          Estimate uncertainty directly from your data using resampling.
        </p>

        <BootstrapControls
          distribution={distribution}
          sampleSize={sampleSize}
          numResamples={numResamples}
          metric={metric}
          onDistributionChange={setDistribution}
          onSampleSizeChange={setSampleSize}
          onNumResamplesChange={setNumResamples}
          onMetricChange={setMetric}
          onRun={handleRun}
          isRunning={isRunning}
        />

        {results && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <BootstrapChart
                sample={results.sample}
                bootstrapStats={results.bootstrapStats}
              />

              <BootstrapComparison results={results} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
