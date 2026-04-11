import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { runBootstrapAB } from './bootstrapSimulation';

import { BootstrapChart } from './BootstrapChart';
import { BootstrappingRawDataChart } from './BootstrappingRawDataChart';

export function BootstrapPage() {
  const [sampleSize, setSampleSize] = useState(100);
  const [numResamples, setNumResamples] = useState(800);

  const [results, setResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const run = async () => {
    setIsRunning(true);

    const res = runBootstrapAB(sampleSize, numResamples, 0.7);

    const partial: number[] = [];
    const step = Math.max(1, Math.floor(numResamples / 80));

    for (let i = 0; i < res.bootstrapStats.length; i += step) {
      partial.push(...res.bootstrapStats.slice(i, i + step));

      setResults({
        ...res,
        bootstrapStats: [...partial],
      });

      await new Promise(r => setTimeout(r, 15));
    }

    setResults(res);
    setIsRunning(false);
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
          Understand uncertainty in the difference in means.
        </p>

        {/* CONTROLS */}
        <div className="bg-gray-800 p-4 rounded mb-6 space-y-4">

          <div>
            <label className="text-sm">Sample size per group</label>
            <input
              className="block bg-gray-700 p-2 rounded mt-1"
              type="number"
              value={sampleSize}
              onChange={e => setSampleSize(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm">Bootstrap resamples</label>
            <input
              className="block bg-gray-700 p-2 rounded mt-1"
              type="number"
              value={numResamples}
              onChange={e => setNumResamples(Number(e.target.value))}
            />
          </div>

          <button
            onClick={run}
            disabled={isRunning}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            {isRunning ? 'Running...' : 'Run simulation'}
          </button>
        </div>

        {/* RAW DATA (A vs B) */}
        {results && (
          <BootstrappingRawDataChart
            dataA={results.rawA}
            dataB={results.rawB}
          />
        )}

        {/* BOOTSTRAP DISTRIBUTION */}
        {results && (
          <BootstrapChart
            bootstrapStats={results.bootstrapStats}
            pointEstimate={results.pointEstimate}
            bootstrapCI={results.ci}
            analyticCI={[0, 0]}
          />
        )}

        {/* SUMMARY */}
        {results && (
          <div className="bg-gray-800 p-4 rounded mt-6">
            <h2 className="text-xl mb-2">Summary</h2>

            <div className="text-sm text-gray-300 space-y-1">
              <div>
                Mean A: {results.meanA.toFixed(3)}
              </div>
              <div>
                Mean B: {results.meanB.toFixed(3)}
              </div>
              <div>
                Δ (A - B): {results.pointEstimate.toFixed(3)}
              </div>
              <div>
                CI: {results.ci[0].toFixed(3)} → {results.ci[1].toFixed(3)}
              </div>
            </div>
          </div>
        )}

        {/* EXPLANATION */}
        <div className="bg-gray-800 p-6 rounded mt-6">
          <h2 className="text-xl mb-2">
            What bootstrap is doing
          </h2>

          <div className="text-sm text-gray-300 space-y-1">
            <div>1. We observe A and B samples</div>
            <div>2. Resample A and B with replacement</div>
            <div>3. Compute (meanA - meanB)</div>
            <div>4. Repeat many times</div>
            <div>5. Build distribution of Δ</div>
            <div>6. Take 2.5% and 97.5% as CI</div>
          </div>
        </div>

      </div>
    </div>
  );
}
