import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { runBootstrapAB } from './bootstrapSimulation';

import { BootstrapChart } from './BootstrapChart';
import { BootstrappingRawDataChart } from './BootstrappingRawDataChart';

export function BootstrapPage() {
  const [sampleSize, setSampleSize] = useState(120);
  const [numResamples, setNumResamples] = useState(800);

  const [results, setResults] = useState<any>(null);
  const [viewIndex, setViewIndex] = useState(800);
  const [isRunning, setIsRunning] = useState(false);

  const run = () => {
    setIsRunning(true);

    const res = runBootstrapAB(sampleSize, numResamples, 0.6);

    setResults(res);
    setViewIndex(0);

    // FAST animation (no rerender spam)
    let i = 0;

    const interval = setInterval(() => {
      i += 30; // FAST STEP

      setViewIndex(i);

      if (i >= res.bootstrapStats.length) {
        clearInterval(interval);
        setViewIndex(res.bootstrapStats.length);
        setIsRunning(false);
      }
    }, 20);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Helmet>
        <title>A/B Bootstrap Simulator</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-2">
          A/B Bootstrap Simulator
        </h1>

        <p className="text-gray-400 mb-6">
          See how uncertainty in A/B tests is built from resampling.
        </p>

        {/* CONTROLS (RESTORED PROPERLY) */}
        <div className="bg-gray-800 p-4 rounded mb-6 space-y-3">

          <div>
            <div className="text-sm text-gray-300">Sample size (per group)</div>
            <input
              type="number"
              value={sampleSize}
              onChange={e => setSampleSize(Number(e.target.value))}
              className="bg-gray-700 p-2 rounded w-full mt-1"
            />
          </div>

          <div>
            <div className="text-sm text-gray-300">Bootstrap resamples</div>
            <input
              type="number"
              value={numResamples}
              onChange={e => setNumResamples(Number(e.target.value))}
              className="bg-gray-700 p-2 rounded w-full mt-1"
            />
          </div>

          <button
            onClick={run}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            {isRunning ? 'Building distribution...' : 'Run simulation'}
          </button>
        </div>

        {/* RAW DATA */}
        {results && (
          <BootstrappingRawDataChart
            dataA={results.rawA}
            dataB={results.rawB}
          />
        )}

        {/* BOOTSTRAP (ANIMATED VIEW) */}
        {results && (
          <BootstrapChart
            bootstrapStats={results.bootstrapStats.slice(0, viewIndex)}
            pointEstimate={results.pointEstimate}
            bootstrapCI={results.ci}
            analyticCI={[0, 0]}
          />
        )}

        {/* PROGRESS TEXT */}
        {results && (
          <div className="text-sm text-gray-400 mt-2">
            Resamples: {viewIndex} / {results.bootstrapStats.length}
          </div>
        )}

        {/* SUMMARY */}
        {results && (
          <div className="bg-gray-800 p-4 rounded mt-6">
            <div>Mean A: {results.meanA.toFixed(3)}</div>
            <div>Mean B: {results.meanB.toFixed(3)}</div>
            <div>Δ: {results.pointEstimate.toFixed(3)}</div>
            <div>
              CI: {results.ci[0].toFixed(3)} → {results.ci[1].toFixed(3)}
            </div>
          </div>
        )}

        {/* EXPLANATION (RESTORED) */}
        <div className="bg-gray-800 p-6 rounded mt-6">
          <h2 className="text-xl mb-2">
            What’s happening
          </h2>

          <div className="text-sm text-gray-300 space-y-1">
            <div>1. We observe A and B groups</div>
            <div>2. We resample users with replacement</div>
            <div>3. We compute mean(A) - mean(B)</div>
            <div>4. Repeat many times</div>
            <div>5. Build distribution of differences</div>
            <div>6. Take 2.5% and 97.5% as CI</div>
          </div>
        </div>

      </div>
    </div>
  );
}
