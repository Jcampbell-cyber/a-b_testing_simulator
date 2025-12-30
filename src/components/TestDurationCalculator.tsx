import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface TestDurationCalculatorProps {
  onBack: () => void;
}

export function TestDurationCalculator({ onBack }: TestDurationCalculatorProps) {
  const [metricType, setMetricType] = useState<'continuous' | 'binary'>('continuous');
  const [testType, setTestType] = useState<'two-sided' | 'one-sided'>('two-sided');
  const [alpha, setAlpha] = useState(0.05);
  const [power, setPower] = useState(0.8);
  const [effectSize, setEffectSize] = useState(0.2);
  const [dailyUnits, setDailyUnits] = useState(10000);
  const [numFlights, setNumFlights] = useState(2);

  const calculateDuration = () => {
    const zAlpha = testType === 'two-sided' ? 1.96 : 1.645;
    const zBeta = 0.84;

    let variance = 1;
    if (metricType === 'binary') {
      const p = 0.5;
      variance = 2 * p * (1 - p);
    }

    const samplesPerGroup = Math.ceil(
      (variance * Math.pow(zAlpha + zBeta, 2)) / Math.pow(effectSize, 2)
    );

    const totalSamples = samplesPerGroup * numFlights;
    const samplesPerDay = dailyUnits;
    const daysNeeded = Math.ceil(totalSamples / samplesPerDay);

    return { daysNeeded, totalSamples, samplesPerDay };
  };

  const result = calculateDuration();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </button>

        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-white mb-2">Test Duration Calculator</h1>
          <p className="text-gray-300 mb-8">
            Estimate how long your test needs to run to reach statistical significance
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-3">Metric Type</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={metricType === 'continuous'}
                      onChange={() => setMetricType('continuous')}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">Continuous</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={metricType === 'binary'}
                      onChange={() => setMetricType('binary')}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">Binary</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">Test Type</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={testType === 'two-sided'}
                      onChange={() => setTestType('two-sided')}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">Two-sided</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={testType === 'one-sided'}
                      onChange={() => setTestType('one-sided')}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">One-sided</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">
                  Significance Level (α): {alpha.toFixed(3)}
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="0.2"
                  step="0.01"
                  value={alpha}
                  onChange={(e) => setAlpha(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">
                  Power (1 - β): {power.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="0.99"
                  step="0.01"
                  value={power}
                  onChange={(e) => setPower(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">
                  Minimum Detectable Effect Size: {effectSize.toFixed(3)}
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="1"
                  step="0.01"
                  value={effectSize}
                  onChange={(e) => setEffectSize(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">
                  Daily Traffic: {dailyUnits.toLocaleString()}
                </label>
                <input
                  type="number"
                  min="100"
                  value={dailyUnits}
                  onChange={(e) => setDailyUnits(Math.max(100, parseInt(e.target.value) || 100))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">
                  Number of Flights: {numFlights}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNumFlights(Math.max(2, numFlights - 1))}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="2"
                    value={numFlights}
                    onChange={(e) => setNumFlights(Math.max(2, parseInt(e.target.value) || 2))}
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded text-center"
                  />
                  <button
                    onClick={() => setNumFlights(numFlights + 1)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-white mb-6">Results</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-300 text-sm mb-1">Test Duration</p>
                  <p className="text-4xl font-bold text-blue-400">{result.daysNeeded}</p>
                  <p className="text-gray-400 text-xs mt-1">days</p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <p className="text-gray-300 text-sm mb-1">
                    {result.daysNeeded > 30 ? '~' : ''} {Math.ceil(result.daysNeeded / 7)} weeks
                  </p>
                  <p className="text-gray-400 text-xs">estimated duration</p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <p className="text-gray-300 text-sm mb-1">Total Samples Needed</p>
                  <p className="text-2xl font-bold text-gray-200">
                    {result.totalSamples.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">at {result.samplesPerDay.toLocaleString()} per day</p>
                </div>

                <div className="bg-gray-600 rounded p-4 text-sm text-gray-200">
                  <p className="font-semibold mb-2">Test Configuration</p>
                  <ul className="space-y-1 text-xs">
                    <li>Flights: {numFlights}</li>
                    <li>α = {alpha.toFixed(3)}, Power = {power.toFixed(2)}</li>
                    <li>MDE = {effectSize.toFixed(3)}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
