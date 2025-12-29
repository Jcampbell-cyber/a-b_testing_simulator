import { useState } from "react";
import { TrendingUp } from "lucide-react";

export function CUPEDPage() {
  const [rSquared, setRSquared] = useState(0.7);

  const avgValue = 1000;
  const sampleSize = 1000;

  // --- Variance Calculations ---
  const baselineStd = avgValue * 0.25;
  const cupedStd = baselineStd * Math.sqrt(1 - rSquared);

  const stdErrorBaseline = baselineStd / Math.sqrt(sampleSize / 2);
  const stdErrorCuped = cupedStd / Math.sqrt(sampleSize / 2);

  const mdeBaseline = (1.96 * 2 * stdErrorBaseline / avgValue) * 100;
  const mdeCuped = (1.96 * 2 * stdErrorCuped / avgValue) * 100;

  const sampleReductionPercent = (rSquared * 100).toFixed(1);

  // --- Distribution Generators ---
  const generateNormalDistribution = (mean, std) => {
    const points = [];
    const range = 4 * std;
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const x = mean - range / 2 + (range * i) / steps;
      const y =
        (1 / (std * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
      points.push({ x, y });
    }
    return points;
  };

  // --- Distributions for both charts ---
  const baselineDist = generateNormalDistribution(avgValue, baselineStd);
  const cupedDist = generateNormalDistribution(avgValue, cupedStd);

  const controlMean = avgValue;
  const treatmentMeanBaseline = avgValue * (1 + mdeBaseline / 100 / 2);
  const treatmentMeanCuped = avgValue * (1 + mdeCuped / 100 / 2);

  const distControlPre = generateNormalDistribution(controlMean, baselineStd);
  const distTreatmentPre = generateNormalDistribution(treatmentMeanBaseline, baselineStd);
  const distControlCuped = generateNormalDistribution(controlMean, cupedStd);
  const distTreatmentCuped = generateNormalDistribution(treatmentMeanCuped, cupedStd);

  // --- Axis and path for distribution chart ---
  const distChartWidth = 560;
  const distChartHeight = 300;
  const distChartPadding = { left: 60, bottom: 50, top: 30, right: 30 };

  const distMinX = avgValue - baselineStd * 2.3;
  const distMaxX = avgValue + baselineStd * 2.3;
  const distXRange = distMaxX - distMinX;

  const distMaxY = Math.max(
    ...baselineDist.map(p => p.y),
    ...cupedDist.map(p => p.y)
  );

  const xScaleDist = x =>
    distChartPadding.left +
    ((x - distMinX) / distXRange) *
      (distChartWidth - distChartPadding.left - distChartPadding.right);

  const yScaleDist = y =>
    distChartHeight -
    distChartPadding.bottom -
    (y / distMaxY) *
      (distChartHeight - distChartPadding.top - distChartPadding.bottom);

  const createDistPath = dist => {
    if (dist.length === 0) return "";
    let path = `M ${xScaleDist(dist[0].x)} ${yScaleDist(dist[0].y)}`;
    for (let i = 1; i < dist.length; i++) {
      path += ` L ${xScaleDist(dist[i].x)} ${yScaleDist(dist[i].y)}`;
    }
    return path;
  };

  // --- Axis and path for MDE comparison chart ---
  const mdeChartWidth = 540;
  const mdeChartHeight = 340;
  const mdePadding = { left: 60, right: 30, top: 30, bottom: 50 };

  const mdeMinX = avgValue - baselineStd * 1.2;
  const mdeMaxX = avgValue * 1.08 + baselineStd * 1.2;
  const mdeXRange = mdeMaxX - mdeMinX;

  const mdeMaxY = Math.max(
    ...distControlPre.map(p => p.y),
    ...distTreatmentPre.map(p => p.y),
    ...distControlCuped.map(p => p.y),
    ...distTreatmentCuped.map(p => p.y)
  );

  const xScaleMDE = x =>
    mdePadding.left +
    ((x - mdeMinX) / mdeXRange) *
      (mdeChartWidth - mdePadding.left - mdePadding.right);

  // Trick: vertically separate top/bottom pairs by shifting y coordinate
  // Multipliers help visually compress the density for stacked displays
  const shiftY = (dist, offset) => {
    const maxY = mdeMaxY;
    return dist.map(p => ({
      x: p.x,
      y: p.y * 0.85 + offset,
    }));
  };

  const createMdePath = (dist, offsetY = 0) => {
    if (dist.length === 0) return "";
    let path = `M ${xScaleMDE(dist[0].x)} ${mdeChartHeight - mdePadding.bottom - (dist[0].y / mdeMaxY) * (mdeChartHeight - mdePadding.top - mdePadding.bottom) * 0.85 - offsetY}`;
    for (let i = 1; i < dist.length; i++) {
      const y =
        mdeChartHeight -
        mdePadding.bottom -
        (dist[i].y / mdeMaxY) *
          (mdeChartHeight - mdePadding.top - mdePadding.bottom) *
          0.85 -
        offsetY;
      path += ` L ${xScaleMDE(dist[i].x)} ${y}`;
    }
    return path;
  };

  // Y positions for each layer
  const standardOffset = 0;
  const cupedOffset = -115;

  // --- Arrow positions ---
  const standardArrowY = 110;
  const cupedArrowY = 245;

  // --------------------------------
  // Render
  // --------------------------------

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-8 h-8 text-emerald-300" />
          <h1 className="text-4xl font-bold text-white">CUPED Variance Reduction</h1>
        </div>
        <p className="text-lg text-gray-400 mb-6">
          CUPED (Controlled-experiment Using Pre-Experiment Data) reduces variance in A/B tests by leveraging pre-experiment metrics.
        </p>

        {/* Parameters */}
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                R² (Correlation Strength)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={rSquared}
                onChange={e => setRSquared(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-400 mt-1">
                R² = {rSquared.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                How well pre-experiment data predicts current values.
              </p>
            </div>
            <div className="bg-emerald-900 border border-emerald-700 rounded-md p-3">
              <p className="text-sm font-medium text-white">Variance Reduction</p>
              <p className="text-2xl font-bold text-emerald-400">
                {(rSquared * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* --- Distribution Chart --- */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-md mb-6 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Variance Reduction Visualization</h2>
          <p className="text-sm text-gray-300 mb-2">
            The classic distribution (gray) is wider, while CUPED's (green) is tighter and centered.
          </p>
          <svg
            width={distChartWidth}
            height={distChartHeight}
            viewBox={`0 0 ${distChartWidth} ${distChartHeight}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Classic distribution */}
            <path
              d={createDistPath(baselineDist)}
              fill="#94a3b8"
              fillOpacity="0.3"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            {/* CUPED distribution */}
            <path
              d={createDistPath(cupedDist)}
              fill="#10b981"
              fillOpacity="0.4"
              stroke="#10b981"
              strokeWidth="2"
            />
            {/* Axis labels */}
            <text
              x={distChartWidth / 2}
              y={distChartHeight - 4}
              textAnchor="middle"
              className="text-base fill-gray-300 font-semibold"
            >
              Metric Value
            </text>
            <text
              x={26}
              y={distChartHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90, 26, ${distChartHeight / 2})`}
              className="text-base fill-gray-300 font-semibold"
            >
              Density
            </text>
            {/* Legend */}
            <rect x={distChartWidth - 180} y={40} width="22" height="12" fill="#94a3b8" fillOpacity="0.3" />
            <text x={distChartWidth - 150} y={50} className="text-sm fill-gray-200">Classic</text>
            <rect x={distChartWidth - 180} y={60} width="22" height="12" fill="#10b981" fillOpacity="0.4" />
            <text x={distChartWidth - 150} y={70} className="text-sm fill-gray-200">CUPED</text>
          </svg>
        </div>

        {/* --- Key Insight --- */}
        <div className="mb-6 bg-emerald-900 border border-emerald-700 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Key Insight</h3>
          <p className="text-sm text-emerald-200">
            Standard deviation reduction: {baselineStd.toFixed(0)} → {cupedStd.toFixed(0)} (
            {((1 - cupedStd / baselineStd) * 100).toFixed(1)}% reduction)
          </p>
          <p className="text-sm text-emerald-200 mt-2">
            You need <strong>{sampleReductionPercent}% fewer samples</strong> to achieve the same statistical power.
          </p>
        </div>

        {/* --- MDE Comparison Chart --- */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-md mb-6 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Minimum Detectable Effect Comparison</h2>
          <p className="text-sm text-gray-300 mb-2">
            Top: Standard A/B (wider, larger MDE). Bottom: CUPED (thinner, smaller MDE). Arrows show the MDE.
          </p>
          <svg
            width={mdeChartWidth}
            height={mdeChartHeight}
            viewBox={`0 0 ${mdeChartWidth} ${mdeChartHeight}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Classic Pair (top) */}
            <g>
              <path
                d={createMdePath(distControlPre, standardOffset)}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              <path
                d={createMdePath(distTreatmentPre, standardOffset)}
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
              />
              {/* Classic MDE Arrow */}
              <defs>
                <marker id="classicStart" markerWidth="7" markerHeight="7" refX="2" refY="3.5" orient="auto">
                  <path d="M6 0 L0 3.5 L6 7" fill="#f59e0b" />
                </marker>
                <marker id="classicEnd" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <path d="M0 0 L6 3.5 L0 7" fill="#f59e0b" />
                </marker>
              </defs>
              <line
                x1={xScaleMDE(controlMean)}
                y1={standardArrowY}
                x2={xScaleMDE(treatmentMeanBaseline)}
                y2={standardArrowY}
                stroke="#f59e0b"
                strokeWidth="3"
                markerStart="url(#classicStart)"
                markerEnd="url(#classicEnd)"
              />
              <text
                x={(xScaleMDE(controlMean) + xScaleMDE(treatmentMeanBaseline)) / 2}
                y={standardArrowY - 12}
                textAnchor="middle"
                className="text-xs fill-amber-400"
              >
                MDE = {mdeBaseline.toFixed(2)}%
              </text>
              <text
                x={70}
                y={70}
                className="text-xs fill-gray-400"
              >
                Standard A/B
              </text>
            </g>
            {/* CUPED Pair (bottom) */}
            <g>
              <path
                d={createMdePath(distControlCuped, cupedOffset)}
                fill="none"
                stroke="#94a3b8"
                strokeDasharray="4,4"
                strokeWidth="2"
              />
              <path
                d={createMdePath(distTreatmentCuped, cupedOffset)}
                fill="none"
                stroke="#10b981"
                strokeDasharray="4,4"
                strokeWidth="2"
              />
              {/* CUPED MDE Arrow */}
              <defs>
                <marker id="cupedStart" markerWidth="7" markerHeight="7" refX="2" refY="3.5" orient="auto">
                  <path d="M6 0 L0 3.5 L6 7" fill="#10b981" />
                </marker>
                <marker id="cupedEnd" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <path d="M0 0 L6 3.5 L0 7" fill="#10b981" />
                </marker>
              </defs>
              <line
                x1={xScaleMDE(controlMean)}
                y1={cupedArrowY}
                x2={xScaleMDE(treatmentMeanCuped)}
                y2={cupedArrowY}
                stroke="#10b981"
                strokeWidth="3"
                markerStart="url(#cupedStart)"
                markerEnd="url(#cupedEnd)"
              />
              <text
                x={(xScaleMDE(controlMean) + xScaleMDE(treatmentMeanCuped)) / 2}
                y={cupedArrowY - 12}
                textAnchor="middle"
                className="text-xs fill-emerald-300"
              >
                MDE = {mdeCuped.toFixed(2)}%
              </text>
              <text
                x={70}
                y={215}
                className="text-xs fill-gray-400"
              >
                CUPED A/B
              </text>
            </g>
            {/* Axis labels */}
            <text
              x={mdeChartWidth / 2}
              y={mdeChartHeight - 4}
              textAnchor="middle"
              className="text-base fill-gray-300 font-semibold"
            >
              Metric Value
            </text>
            <text
              x={32}
              y={188}
              textAnchor="middle"
              transform={`rotate(-90, 32, 188)`}
              className="text-base fill-gray-300 font-semibold"
            >
              Density
            </text>
          </svg>
        </div>

        {/* --- Value cards --- */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-900 border border-blue-700 rounded-lg p-3">
            <p className="text-sm font-semibold text-white">MDE Without CUPED</p>
            <p className="text-2xl font-bold text-blue-400">{mdeBaseline.toFixed(2)}%</p>
          </div>
          <div className="bg-emerald-900 border border-emerald-700 rounded-lg p-3">
            <p className="text-sm font-semibold text-white">MDE With CUPED</p>
            <p className="text-2xl font-bold text-emerald-400">{mdeCuped.toFixed(2)}%</p>
          </div>
        </div>

        {/* --- How CUPED Works --- */}
        <div className="mt-6 bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">How CUPED Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">1. Collect Pre-Experiment Data</h3>
              <p>Collect the same metric from a historical period before running your A/B test.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">2. Calculate Correlation</h3>
              <p>Measure how well the pre-experiment metric predicts the experiment metric (R²).</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">3. Adjust for Covariates</h3>
              <p>CUPED adjusts each user's metric by subtracting their expected value based on history.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">4. Reduced Variance</h3>
              <p>This removes variance explained by pre-experiment behavior, clarifying treatment effects.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
