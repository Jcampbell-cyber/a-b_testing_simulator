import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import {
  runBootstrapSimulation,
  type MetricType,
} from '/bootstrapSimulation';

import { BootstrapChart } from './BootstrapChart';
import { BootstrappingRawDataChart } from './BootstrappingRawDataChart';

export function BootstrapPage() {
  const [sampleSize, setSampleSize] = useState(120);
  const [numResamples, setNumResamples] = useState(1000);
  const [metricType, setMetricType] = useState<MetricType>('mean');

  const [results, setResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runAnimated = async () => {
    setIsRunning(true);

    const full = runBootstrapSimulation(
      sampleSize,
      numResamples,
      metricType
    );

    const partial: number[] = [];
    const step = Math.max(1, Math.floor(numResamples / 80));

    for (let i = 0; i < full.bootstrapStats.length; i += step) {
      partial.push(
        ...full.bootstrapStats.slice(i, i + step)
      );

      setResults({
        ...full,
        bootstrapStats: [...partial],
      });

      await new Promise((r) => setTimeout(r, 15));
    }

    setResults(full);
    setIsRunning(false);
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
          See how uncertainty is built by resampling your data.
        </p>

        {/* Controls */}
        <div className="bg-gray-800 p-4 rounded mb-6 space-y-4">

          <div>
            <label className="text-sm text-gray-300">
              Metric
            </label>

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

          <div>
            <label className="text-sm text-gray-300">
              Resamples
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
            onClick={runAnimated}
            disabled={isRunning}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            {isRunning ? 'Building distribution...' : 'Run bootstrap'}
          </button>
        </div>

        {/* RAW DATA */}
        {results && (
          <div className="mb-6">
            <BootstrappingRawDataChart data={results.rawData} />
          </div>
        )}

        {/* BOOTSTRAP */}
        {results && (
          <div className="mb-6">
            <BootstrapChart
              bootstrapStats={results.bootstrapStats}
              pointEstimate={results.mean}
              bootstrapCI={results.ci}
              analyticCI={[0, 0]}
            />
          </div>
        )}

        {/* SUMMARY */}
        {results && (
          <div className="bg-gray-800 p-4 rounded mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Summary
            </h2>

            <div className="text-sm text-gray-300 space-y-1">
              <div>
                Mean: {results.mean.toFixed(4)}
              </div>
              <div>
                Std dev: {results.stdev.toFixed(4)}
              </div>
              <div>
                CI: {results.ci[0].toFixed(4)} →{' '}
                {results.ci[1].toFixed(4)}
              </div>
              <div className="text-gray-400">
                (2.5th – 97.5th percentile)
              </div>
            </div>
          </div>
        )}

        {/* HOW IT WORKS */}
        <div className="bg-gray-800 p-6 rounded mb-6">
          <h2 className="text-xl font-semibold mb-3">
            How bootstrap works
          </h2>

          <div className="text-sm text-gray-300 space-y-1">
            <div>1. Start with observed data</div>
            <div>2. Sample WITH replacement</div>
            <div>3. Compute metric each time</div>
            <div>4. Repeat many times</div>
            <div>5. Build distribution of estimates</div>
            <div>6. Take 2.5% and 97.5% as CI</div>
          </div>
        </div>

        {/* WHEN TO USE */}
        <div className="bg-gray-800 p-6 rounded">
          <h2 className="text-xl font-semibold mb-3">
            When to use bootstrap
          </h2>

          <div className="text-sm text-gray-300 space-y-1">
            <div>
              • Ratio metrics (skewed / zero-heavy data)
            </div>
            <div>
              • Heavy-tailed distributions
            </div>
            <div>
              • Metrics without clean analytical SE
            </div>
            <div>
              • Distribution-shape metrics (e.g. Gini, TVD)
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
