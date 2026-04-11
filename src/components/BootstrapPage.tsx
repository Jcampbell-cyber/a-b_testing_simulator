import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { runBootstrapSimulation, type MetricType } from '../utils/bootstrapSimulation';

import { BootstrapChart } from './BootstrapChart';
import { RawDataChart } from './RawDataChart';

export function BootstrapPage() {
  const [sampleSize, setSampleSize] = useState(100);
  const [numResamples, setNumResamples] = useState(1000);
  const [metricType, setMetricType] = useState<MetricType>('mean');

  const [results, setResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);

    setTimeout(() => {
      const res = runBootstrapSimulation(
        sampleSize,
        numResamples,
        metricType
      );

      setResults(res);
      setIsRunning(false);
    }, 50);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Helmet>
        <title>Bootstrap Simulator</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <h1 className="text-4xl font-bold mb-2">
          Bootstrap Simulator
        </h1>

        <p className="text-gray-400 mb-6">
          Visualise uncertainty using resampling instead of analytical assumptions.
        </p>

        {/* Controls */}
        <div className="bg-gray-800 p-4 rounded mb-6 space-y-4">

          {/* Metric type */}
          <div>
            <label className="text-sm text-gray-300">Metric</label>
            <select
              className="block mt-1 bg-gray-700 p-2 rounded"
              value={metricType}
              onChange={(e) =>
                setMetricType(e.target.value as MetricType)
              }
            >
              <option value="mean">Mean (baseline)</option>
              <option value="ratio">Ratio (skewed metric)</option>
            </select>
          </div>

          {/* Sample size */}
          <div>
            <label className="text-sm text-gray-300">
              Sample size
            </label>
            <input
              type="number"
              className="block mt-1 bg-gray-700 p-2 rounded"
              value={sampleSize}
              onChange={(e) =>
                setSampleSize(Number(e.target.value))
              }
            />
          </div>

          {/* Resamples */}
          <div>
            <label className="text-sm text-gray-300">
              Bootstrap resamples
            </label>
            <input
              type="number"
              className="block mt-1 bg-gray-700 p-2 rounded"
              value={numResamples}
              onChange={(e) =>
                setNumResamples(Number(e.target.value))
              }
            />
          </div>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>

        {/* Raw data */}
        {results && (
          <div className="mb-6">
            <RawDataChart data={results.rawData} />
          </div>
        )}

        {/* Bootstrap distribution */}
        {results && (
          <div className="mb-6">
            <BootstrapChart
              bootstrapStats={results.bootstrapStats}
              pointEstimate={results.mean}
              bootstrapCI={results.ci}
              analyticCI={[0, 0]} // optional placeholder
            />
          </div>
        )}

        {/* Summary */}
        {results && (
          <div className="bg-gray-800 p-4 rounded mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Summary
            </h2>

            <div className="text-sm text-gray-300 space-y-1">
              <div>Mean: {results.mean.toFixed(4)}</div>
              <div>Std dev: {results.stdev.toFixed(4)}</div>
              <div>
                Bootstrap CI:{' '}
                {results.ci[0].toFixed(4)} →{' '}
                {results.ci[1].toFixed(4)}
              </div>
              <div className="text-gray-400">
                (2.5th – 97.5th percentile)
              </div>
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="bg-gray-800 p-6 rounded space-y-3">
          <h2 className="text-xl font-semibold">
            How bootstrap works
          </h2>

          <div className="text-gray-300 text-sm space-y-1">
            <div>1. Take original sample</div>
            <div>2. Resample WITH replacement</div>
            <div>3. Compute metric each time</div>
            <div>4. Repeat many times</div>
            <div>5. Build distribution of metrics</div>
            <div>6. Take 2.5% and 97.5% as CI</div>
          </div>
        </div>

        {/* When to use */}
        <div className="bg-gray-800 p-6 rounded mt-6">
          <h2 className="text-xl font-semibold mb-2">
            When to use bootstrap
          </h2>

          <div className="text-gray-300 text-sm space-y-1">
            <div>• Ratio metrics (skewed, noisy denominators)</div>
            <div>• Heavy-tailed data</div>
            <div>• Metrics without clean analytic SE</div>
          </div>
        </div>

      </div>
    </div>
  );
}
