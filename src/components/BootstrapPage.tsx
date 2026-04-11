import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { runBootstrapAB } from './bootstrapSimulation';

import { BootstrapChart } from './BootstrapChart';
import { BootstrappingRawDataChart } from './BootstrappingRawDataChart';

export function BootstrapPage() {
  const [sampleSize, setSampleSize] = useState(100);
  const [numResamples, setNumResamples] = useState(600);

  const [results, setResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const run = async () => {
    setIsRunning(true);

    const full = runBootstrapAB(sampleSize, numResamples, 0.6);

    for (let i = 1; i <= full.bootstrapStats.length; i++) {
      setResults({
        ...full,
        bootstrapStats: full.bootstrapStats.slice(0, i),
      });

      await new Promise(r => setTimeout(r, 5));
    }

    setResults(full);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Helmet>
        <title>A/B Bootstrap Simulator</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">

        <h1 className="text-4xl font-bold mb-4">
          A/B Bootstrap Simulator
        </h1>

        {/* controls */}
        <div className="bg-gray-800 p-4 rounded mb-6 space-y-3">

          <input
            type="number"
            value={sampleSize}
            onChange={e => setSampleSize(Number(e.target.value))}
            className="bg-gray-700 p-2 rounded block"
            placeholder="sample size"
          />

          <input
            type="number"
            value={numResamples}
            onChange={e => setNumResamples(Number(e.target.value))}
            className="bg-gray-700 p-2 rounded block"
            placeholder="resamples"
          />

          <button
            onClick={run}
            disabled={isRunning}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>

        {/* RAW DATA */}
        {results?.rawA && results?.rawB && (
          <BootstrappingRawDataChart
            dataA={results.rawA}
            dataB={results.rawB}
          />
        )}

        {/* BOOTSTRAP */}
        {results?.bootstrapStats && (
          <BootstrapChart
            bootstrapStats={results.bootstrapStats}
            pointEstimate={results.pointEstimate ?? 0}
            bootstrapCI={results.ci ?? [0, 0]}
            analyticCI={[0, 0]}
          />
        )}

        {/* SUMMARY */}
        {results && (
          <div className="bg-gray-800 p-4 rounded mt-6 text-sm">
            <div>A mean: {results.meanA?.toFixed(3)}</div>
            <div>B mean: {results.meanB?.toFixed(3)}</div>
            <div>Δ: {results.pointEstimate?.toFixed(3)}</div>
            <div>
              CI: {results.ci?.[0]?.toFixed(3)} → {results.ci?.[1]?.toFixed(3)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
