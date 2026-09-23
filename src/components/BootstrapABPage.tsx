import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { runBootstrapAB } from './bootstrapABSimulation';

import { BootstrapABChart } from './BootstrapABChart';
import { BootstrapRawDistributionChart } from './BootstrapRawDistributionChart';

export function BootstrapABPage() {
  const [sampleSize, setSampleSize] = useState(100);
  const [resamples, setResamples] = useState(700);

  const [results, setResults] = useState<ReturnType<typeof runBootstrapAB> | null>(null);
  const [view, setView] = useState(0);
  const [running, setRunning] = useState(false);

  const run = () => {
    setRunning(true);

    const res = runBootstrapAB(sampleSize, resamples, 0.6);

    setResults(res);
    setView(0);

    let i = 0;

    const interval = setInterval(() => {
      i += 30;

      setView(i);

      if (i >= res.bootstrapStats.length) {
        clearInterval(interval);
        setView(res.bootstrapStats.length);
        setRunning(false);
      }
    }, 20);
  };

  return (
    <div className="bg-gray-900 text-white">
      <Helmet>
        <title>A/B Bootstrap (Difference in Means)</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">

        <h1 className="text-4xl font-bold mb-2">
          Bootstrap A/B Test
        </h1>

        <p className="text-gray-400 mb-6">
          Estimate uncertainty in the difference between flights using resampling.
        </p>

        {/* CONTROLS */}
        <div className="bg-gray-800 p-4 rounded mb-6 space-y-3">

          <div className="text-sm text-gray-300">
            Sample size per group
          </div>
          <input
            type="number"
            value={sampleSize}
            onChange={e => setSampleSize(Number(e.target.value))}
            className="bg-gray-700 p-2 rounded w-full"
          />

          <div className="text-sm text-gray-300">
            Bootstrap resamples
          </div>
          <input
            type="number"
            value={resamples}
            onChange={e => setResamples(Number(e.target.value))}
            className="bg-gray-700 p-2 rounded w-full"
          />

          <button
            onClick={run}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            {running ? 'Running...' : 'Run A/B bootstrap'}
          </button>
        </div>

        {/* RAW A vs B */}
        {results && (
          <BootstrapRawDistributionChart
            dataA={results.rawA}
            dataB={results.rawB}
          />
        )}

        {/* MAIN RESULT: Δ DISTRIBUTION */}
        {results && (
          <BootstrapABChart
            stats={results.bootstrapStats.slice(0, view)}
            delta={results.pointEstimate}
            ci={results.ci}
          />
        )}

        {/* PROGRESS */}
        {results && (
          <div className="text-sm text-gray-400 mt-2">
            Building Δ distribution: {view} / {results.bootstrapStats.length}
          </div>
        )}

        {/* SUMMARY */}
        {results && (
          <div className="bg-gray-800 p-4 rounded mt-6 text-sm">
            <div>A mean: {results.meanA.toFixed(3)}</div>
            <div>B mean: {results.meanB.toFixed(3)}</div>
            <div>Δ (A - B): {results.pointEstimate.toFixed(3)}</div>
            <div>
              95% CI: {results.ci[0].toFixed(3)} → {results.ci[1].toFixed(3)}
            </div>
          </div>
        )}

        {/* EXPLANATION */}
        <div className="bg-gray-800 p-6 rounded mt-6">
          <h2 className="text-xl mb-2">
            What’s happening
          </h2>

          <div className="text-sm text-gray-300 space-y-1">
            <div>1. We observe A and B groups</div>
            <div>2. We resample each group independently</div>
            <div>3. We compute Δ = mean(A) - mean(B)</div>
            <div>4. Repeat many times</div>
            <div>5. We build distribution of Δ</div>
            <div>6. CI = 2.5th → 97.5th percentile</div>
            <div>7. If our CI does not straddle the zero line - this is statistically significant</div>
          </div>
        </div>

      </div>
    </div>
  );
}
