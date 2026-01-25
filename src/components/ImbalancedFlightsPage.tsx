import { useState } from 'react';
import { GitBranch } from 'lucide-react';
import { calculateMDE } from '../utils/mde';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export function ImbalancedFlightsPage() {
  const [baselineMean] = useState(1000);
  const [stdev] = useState(400);
  const [sampleSize] = useState(1000);
  const [selectedSplit, setSelectedSplit] = useState(50);

  const controlSize = Math.floor((selectedSplit / 100) * sampleSize);
  const treatmentSize = sampleSize - controlSize;
  const smallerSize = Math.min(controlSize, treatmentSize);

  const mde = calculateMDE(smallerSize, stdev, baselineMean);

  const knownPowerRates = [
    { split: 10, rate: 45 },
    { split: 20, rate: 60 },
    { split: 30, rate: 70 },
    { split: 40, rate: 77 },
    { split: 50, rate: 80 },
    { split: 60, rate: 77 },
    { split: 70, rate: 70 },
    { split: 80, rate: 60 },
    { split: 90, rate: 45 },
  ];

  const knownSampleIncreases = [
    { split: 10, increase: 178 },
    { split: 20, increase: 56 },
    { split: 30, increase: 19 },
    { split: 40, increase: 4 },
    { split: 50, increase: 0 },
    { split: 60, increase: 4 },
    { split: 70, increase: 19 },
    { split: 80, increase: 56 },
    { split: 90, increase: 178 },
  ];

  const chartHeight = 400;
  const chartWidth = 900;
  const chartPadding = { top: 40, right: 60, bottom: 60, left: 60 };

  const yMaxFP = 70;
  const yMaxSample = 200;

  const yScaleFP = (value) =>
    chartPadding.top +
    ((yMaxFP - value) / yMaxFP) *
      (chartHeight - chartPadding.top - chartPadding.bottom);

  const yScaleSample = (value) =>
    chartPadding.top +
    ((yMaxSample - value) / yMaxSample) *
      (chartHeight - chartPadding.top - chartPadding.bottom);

  const xScale = (split) =>
    chartPadding.left +
    ((split - 10) / 80) *
      (chartWidth - chartPadding.left - chartPadding.right);

  const controlPercent = selectedSplit;
  const treatmentPercent = 100 - selectedSplit;

  const controlMean = baselineMean;
  const treatmentMean = baselineMean * (1 + mde / 100);

  const controlStdError = stdev / Math.sqrt(controlSize);
  const treatmentStdError = stdev / Math.sqrt(treatmentSize);

  const cohenD = (treatmentMean - controlMean) / stdev;

  // --- FIXED DISTRIBUTION X RANGE ---
  const distChartHeight = 400;
  const distChartWidth = 900;
  const distChartPadding = { top: 40, right: 60, bottom: 60, left: 80 };

  const fixedRange = baselineMean * 0.1;
  const minXFixed = baselineMean - fixedRange;
  const maxXFixed = baselineMean + baselineMean * 0.15;
  const xRangeFixed = maxXFixed - minXFixed;

  const generateDistribution = (mean, std) => {
    const points = [];
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const x = minXFixed + (xRangeFixed * i) / steps;
      const y =
        (1 / (std * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
      points.push({ x, y });
    }
    return points;
  };

  const controlDist = generateDistribution(controlMean, controlStdError);
  const treatmentDist = generateDistribution(treatmentMean, treatmentStdError);

  const allYValues = [...controlDist.map((p) => p.y), ...treatmentDist.map((p) => p.y)];
  const maxY = Math.max(...allYValues);

  const criticalValue = controlMean + 1.96 * controlStdError;

  const xScaleDist = (value) =>
    distChartPadding.left +
    ((value - minXFixed) / xRangeFixed) *
      (distChartWidth - distChartPadding.left - distChartPadding.right);

  const yScaleDist = (value) =>
    distChartHeight -
    distChartPadding.bottom -
    (value / maxY) *
      (distChartHeight - distChartPadding.top - distChartPadding.bottom) *
      0.9;

  const createPath = (points) => {
    if (points.length === 0) return '';
    let path = `M ${xScaleDist(points[0].x)} ${yScaleDist(points[0].y)}`;
    for (let p of points) path += ` L ${xScaleDist(p.x)} ${yScaleDist(p.y)}`;
    return path;
  };

  const currentPower =
    knownPowerRates.find((p) => p.split === selectedSplit)?.rate || 80;

  return (
    <div className="min-h-screen bg-gray-900">
            <Helmet>
        <title>Null Hypothesis Significance Testing | Guardrails</title>
        <meta
          name="description"
          content="Interactive visualization of statistical power, Type I & II errors, effect sizes, and how they relate to experimental guardrails."
        />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <GitBranch className="w-8 h-8 text-slate-600" />
            <h1 className="text-4xl font-bold text-white">Imbalanced Flights Simulator</h1>
          </div>
          <p className="text-lg text-gray-400">
            Explore how imbalanced sample splits affect statistical power and required sample sizes in A/B tests
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Parameters</h2>
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <label className="block text-base font-medium text-gray-300 mb-2">
                Control/Treatment Split
              </label>
              <input
                type="range"
                min="10"
                max="90"
                step="10"
                value={selectedSplit}
                onChange={(e) => setSelectedSplit(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-base text-gray-400 mt-1">
                {controlPercent}/{treatmentPercent} split
              </div>
            </div>
            <div className="bg-gray-700 border border-gray-600 rounded-md p-3 space-y-2 text-base">
              <div className="flex justify-between">
                <span className="text-gray-300">Power (estimated):</span>
                <span className="font-semibold text-white">{currentPower}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* --- Distribution visualization --- */}
          <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Distribution Visualization</h2>
            <p className="text-base text-gray-400 mb-4">
              Sampling distributions for control (blue) and treatment (green) groups. As imbalance increases, standard errors differ, reducing overlap and statistical power.
            </p>

            <svg width="100%" height={distChartHeight} viewBox={`0 0 ${distChartWidth} ${distChartHeight}`} preserveAspectRatio="xMidYMid meet">
              {/* All content inside one block */}
              {/* Distribution curves */}
              <path d={createPath(controlDist)} stroke="#3b82f6" fill="none" strokeWidth="2" />
              <path d={createPath(treatmentDist)} stroke="#22c55e" fill="none" strokeWidth="2" />

              {/* Critical value vertical line */}
              <line
                x1={xScaleDist(criticalValue)}
                y1={distChartPadding.top}
                x2={xScaleDist(criticalValue)}
                y2={distChartHeight - distChartPadding.bottom}
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="5,5"
              />

              {/* Axes */}
              <line
                x1={distChartPadding.left}
                y1={distChartHeight - distChartPadding.bottom}
                x2={distChartWidth - distChartPadding.right}
                y2={distChartHeight - distChartPadding.bottom}
                stroke="#4b5563"
                strokeWidth="2"
              />
              <line
                x1={distChartPadding.left}
                y1={distChartPadding.top}
                x2={distChartPadding.left}
                y2={distChartHeight - distChartPadding.bottom}
                stroke="#4b5563"
                strokeWidth="2"
              />

              {/* MDE Arrow */}
              <defs>
                <marker id="arrowheadStart" markerWidth="6" markerHeight="6" refX="2" refY="3" orient="auto">
                  <path d="M4 0 L0 3 L4 6 Z" fill="#f59e0b" />
                </marker>
                <marker id="arrowheadEnd" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                  <path d="M0 0 L4 3 L0 6 Z" fill="#f59e0b" />
                </marker>
              </defs>
              <line
                x1={xScaleDist(controlMean)}
                y1={distChartPadding.top + 30}
                x2={xScaleDist(treatmentMean)}
                y2={distChartPadding.top + 30}
                stroke="#f59e0b"
                strokeWidth="3"
                markerStart="url(#arrowheadStart)"
                markerEnd="url(#arrowheadEnd)"
              />
              <text
                x={(xScaleDist(controlMean) + xScaleDist(treatmentMean)) / 2}
                y={distChartPadding.top + 20}
                textAnchor="middle"
                className="text-base fill-amber-400"
              >
                Cohen's d = {cohenD.toFixed(3)}
              </text>

              {/* Axis labels */}
              <text
                x={distChartWidth / 2}
                y={distChartHeight - 10}
                textAnchor="middle"
                className="text-base fill-gray-300 font-semibold"
              >
                Metric Value
              </text>
              <text
                x={distChartPadding.left / 2}
                y={distChartHeight / 2}
                textAnchor="middle"
                transform={`rotate(-90, ${distChartPadding.left / 2}, ${distChartHeight / 2})`}
                className="text-base fill-gray-300 font-semibold"
              >
                Probability Density
              </text>

              {/* Legend inside SVG */}
              <g transform={`translate(${distChartWidth - distChartPadding.right - 170}, ${distChartPadding.top})`}>
                <line x1="0" y1="5" x2="25" y2="5" stroke="#3b82f6" strokeWidth="2" />
                <text x="30" y="10" className="text-base fill-white">Null (H₀)</text>
                <line x1="0" y1="30" x2="25" y2="30" stroke="#22c55e" strokeWidth="2" />
                <text x="30" y="35" className="text-base fill-white">Alternative (H₁)</text>
                <line x1="0" y1="55" x2="25" y2="55" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
                <text x="30" y="60" className="text-base fill-white">Critical value</text>
                <rect x="0" y="75" width="25" height="15" fill="#ef4444" fillOpacity="0.3" />
                <text x="30" y="85" className="text-base fill-white">Type I error (α)</text>
                <rect x="0" y="100" width="25" height="15" fill="#22c55e" fillOpacity="0.4" />
                <text x="30" y="110" className="text-base fill-white">Power (1-β)</text>
              </g>
            </svg>
          </div>

          {/* --- Power Chart --- */}
          <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Power at Different Splits – Ability to Detect a True Difference</h2>
            <p className="text-base text-gray-400 mb-4">
              Statistical power represents your ability to detect a true difference when one exists. At a 50/50 split, you achieve 80% power. Imbalanced splits reduce your ability to detect true effects.
            </p>
            <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
              {[0, 10, 20, 30, 40, 50, 60, 70].map((value) => {
                const y = yScaleFP(value);
                return (
                  <g key={value}>
                    <line
                      x1={chartPadding.left}
                      y1={y}
                      x2={chartWidth - chartPadding.right}
                      y2={y}
                      stroke="#e5e7eb"
                      strokeWidth={1}
                    />
                    <text
                      x={chartPadding.left - 10}
                      y={y}
                      textAnchor="end"
                      alignmentBaseline="middle"
                      className="text-base fill-gray-300"
                    >
                      {value}%
                    </text>
                  </g>
                );
              })}
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((split) => {
                const x = xScale(split);
                return (
                  <g key={split}>
                    <line
                      x1={x}
                      y1={chartHeight - chartPadding.bottom}
                      x2={x}
                      y2={chartHeight - chartPadding.bottom + 6}
                      stroke="#4b5563"
                      strokeWidth={2}
                    />
                    <text
                      x={x}
                      y={chartHeight - chartPadding.bottom + 20}
                      textAnchor="middle"
                      className="text-base fill-gray-300"
                    >
                      {split}/{100 - split}
                    </text>
                  </g>
                );
              })}
              <line
                x1={chartPadding.left}
                y1={chartHeight - chartPadding.bottom}
                x2={chartWidth - chartPadding.right}
                y2={chartHeight - chartPadding.bottom}
                stroke="#4b5563"
                strokeWidth={2}
              />
              <line
                x1={chartPadding.left}
                y1={chartPadding.top}
                x2={chartPadding.left}
                y2={chartHeight - chartPadding.bottom}
                stroke="#4b5563"
                strokeWidth={2}
              />
              {knownPowerRates.map((data, index) => {
                if (index === 0) return null;
                const prevData = knownPowerRates[index - 1];
                const x1 = xScale(prevData.split);
                const y1 = yScaleFP(prevData.rate);
                const x2 = xScale(data.split);
                const y2 = yScaleFP(data.rate);
                return (
                  <line
                    key={data.split}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#ef4444"
                    strokeWidth={3}
                  />
                );
              })}
              {knownPowerRates.map((data) => {
                const x = xScale(data.split);
                const y = yScaleFP(data.rate);
                return (
                  <g key={`point-${data.split}`}>
                    <circle cx={x} cy={y} r={5} fill="#ef4444" />
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      className="text-base fill-red-500 font-semibold"
                    >
                      {data.rate.toFixed(1)}%
                    </text>
                  </g>
                );
              })}
              <text
                x={chartWidth / 2}
                y={chartHeight - 10}
                textAnchor="middle"
                className="text-base fill-gray-300 font-semibold"
              >
                Control/Treatment Split
              </text>
              <text
                x={chartPadding.left / 2}
                y={chartHeight / 2}
                textAnchor="middle"
                transform={`rotate(-90, ${chartPadding.left / 2}, ${chartHeight / 2})`}
                className="text-base fill-gray-300 font-semibold"
              >
                Power (%)
              </text>
            </svg>
          </div>

          {/* --- Sample Size Increase Chart --- */}
          <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Extra Sample Size Required vs 50/50 Split</h2>
            <p className="text-base text-gray-400 mb-4">
              Percentage increase in total sample size needed to maintain the same statistical power as a balanced 50/50 split.
            </p>
            <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
              {[0, 50, 100, 150, 200].map((value) => {
                const y = yScaleSample(value);
                return (
                  <g key={value}>
                    <line
                      x1={chartPadding.left}
                      y1={y}
                      x2={chartWidth - chartPadding.right}
                      y2={y}
                      stroke="#e5e7eb"
                      strokeWidth={1}
                    />
                    <text
                      x={chartPadding.left - 10}
                      y={y}
                      textAnchor="end"
                      alignmentBaseline="middle"
                      className="text-base fill-gray-300"
                    >
                      {value}%
                    </text>
                  </g>
                );
              })}
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((split) => {
                const x = xScale(split);
                return (
                  <g key={split}>
                    <line
                      x1={x}
                      y1={chartHeight - chartPadding.bottom}
                      x2={x}
                      y2={chartHeight - chartPadding.bottom + 6}
                      stroke="#4b5563"
                      strokeWidth={2}
                    />
                    <text
                      x={x}
                      y={chartHeight - chartPadding.bottom + 20}
                      textAnchor="middle"
                      className="text-base fill-gray-300"
                    >
                      {split}/{100 - split}
                    </text>
                  </g>
                );
              })}
              <line
                x1={chartPadding.left}
                y1={chartHeight - chartPadding.bottom}
                x2={chartWidth - chartPadding.right}
                y2={chartHeight - chartPadding.bottom}
                stroke="#4b5563"
                strokeWidth={2}
              />
              <line
                x1={chartPadding.left}
                y1={chartPadding.top}
                x2={chartPadding.left}
                y2={chartHeight - chartPadding.bottom}
                stroke="#4b5563"
                strokeWidth={2}
              />
              {knownSampleIncreases.map((data, index) => {
                if (index === 0) return null;
                const prevData = knownSampleIncreases[index - 1];
                const x1 = xScale(prevData.split);
                const y1 = yScaleSample(prevData.increase);
                const x2 = xScale(data.split);
                const y2 = yScaleSample(data.increase);
                return (
                  <line
                    key={data.split}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#7c3aed"
                    strokeWidth={3}
                  />
                );
              })}
              {knownSampleIncreases.map((data) => {
                const x = xScale(data.split);
                const y = yScaleSample(data.increase);
                return (
                  <g key={`sample-point-${data.split}`}>
                    <circle cx={x} cy={y} r={5} fill="#7c3aed" />
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      className="text-base fill-purple-500 font-semibold"
                    >
                      {data.increase}%
                    </text>
                  </g>
                );
              })}
              <text
                x={chartWidth / 2}
                y={chartHeight - 10}
                textAnchor="middle"
                className="text-base fill-gray-300 font-semibold"
              >
                Control/Treatment Split
              </text>
              <text
                x={chartPadding.left / 2}
                y={chartHeight / 2}
                textAnchor="middle"
                transform={`rotate(-90, ${chartPadding.left / 2}, ${chartHeight / 2})`}
                className="text-base fill-gray-300 font-semibold"
              >
                Extra Sample Size Required (%)
              </text>
            </svg>
          </div>
          <div className="bg-gray-700 rounded-lg p-6 text-center mt-12">
  <p className="text-gray-300 mb-4">
    CUPED can reduce variance introduced by imbalanced flights
  </p>
  <Link
    to="/cuped"
    className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded transition-colors"
  >
    Go to CUPED Variance Reduction →
  </Link>
</div>
        </div>
      </div>
    </div>
  );
}
