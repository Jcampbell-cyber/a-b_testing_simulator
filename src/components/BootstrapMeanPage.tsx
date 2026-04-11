import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { runBootstrapMean } from '../utils/bootstrapMeanSimulation';

import { BootstrapMeanChart } from './BootstrapMeanChart';
import { RawDistributionChart } from './RawDistributionChart';

export function BootstrapMeanPage() {
  const [sampleSize, setSampleSize] = useState(80);
  const [resamples, setResamples] = useState(600);

  const [results, setResults] = useState<any>(null);
  const [view, setView] = useState(0);
  const [running, setRunning] = useState(false);

  const run = () => {
    setRunning(true);

    const res = runBootstrapMean(sampleSize, resamples);

    setResults(res);
    setView(0);

    let i = 0;

    const interval = setInterval(() => {
      i += 25;
      setView(i);

      if (i >= res.bootstrapStats.length) {
        clearInterval(interval);
        setView(res.bootstrapStats.length);
        setRunning(false);
      }
    }, 20);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Helmet>
        <title>Bootstrap Mean</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">

        <h1 className="text-4xl font-bold mb-2">
          Bootstrap a Mean
        </h1>

        <p className="text-gray-400 mb-6">
          Understand uncertainty in a single metric using resampling.
        </p>

        {/* CONTROLS */}
        <div className="bg-gray-800 p-4 rounded mb-6 space-y-3">

          <div className="text-sm text-gray-300">
            Sample size
          </div>
          <input
            className="bg-gray-700 p-2 rounded w-full"
            type="number"
            value={sampleSize}
            onChange={e => setSampleSize(Number(e.target.value))}
          />

          <div className="text-sm text-gray-300">
            Bootstrap resamples
          </div>
          <input
            className="bg-gray-700 p-2 rounded w-full"
            type="number"
            value={resamples}
            onChange={e => setResamples(Number(e.target.value))}
          />

          <button
            onClick={run}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            {running ? 'Building...' : 'Run bootstrap'}
          </button>
        </div>

        {/* RAW DATA */}
        {results && (
          <RawDistributionChart data={results.raw} />
        )}

        {/* BOOTSTRAP DISTRIBUTION */}
        {results && (
          <BootstrapMeanChart
            stats={results.bootstrapStats.slice(0, view)}
            mean={results.pointEstimate}
            ci={results.ci}
          />
        )}

        {/* PROGRESS */}
        {results && (
          <div className="text-sm text-gray-400 mt-2">
            Resamples: {view} / {results.bootstrapStats.length}
          </div>
        )}

        {/* EXPLANATION */}
        <div className="bg-gray-800 p-6 rounded mt-6">
          <h2 className="text-xl mb-2">What’s happening</h2>

          <div className="text-sm text-gray-300 space-y-1">
            <div>1. We observe one sample</div>
            <div>2. We resample with replacement</div>
            <div>3. We compute the mean each time</div>
            <div>4. We build a distribution of means</div>
            <div>5. CI = 2.5th → 97.5th percentile</div>
          </div>
        </div>

      </div>
    </div>
  );
}
