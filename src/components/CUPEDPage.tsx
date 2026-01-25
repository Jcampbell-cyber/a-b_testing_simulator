import { useState } from "react";
import { TrendingUp } from "lucide-react";

export function CUPEDPage() {
  const [rSquared, setRSquared] = useState(0.7);
  const [coverage, setCoverage] = useState(0.8); // % with historical data

  const avgValue = 1000;
  const sampleSize = 1000;

  // --- Effective CUPED strength ---
  const effectiveRSquared = rSquared * coverage;

  // --- Variance Calculations ---
  const baselineStd = avgValue * 0.25;
  const cupedStd = baselineStd * Math.sqrt(1 - effectiveRSquared);

  const stdErrorBaseline = baselineStd / Math.sqrt(sampleSize / 2);
  const stdErrorCuped = cupedStd / Math.sqrt(sampleSize / 2);

  const mdeBaseline = (1.96 * 2 * stdErrorBaseline / avgValue) * 100;
  const mdeCuped = (1.96 * 2 * stdErrorCuped / avgValue) * 100;

  const mdeReduction = ((mdeBaseline - mdeCuped) / mdeBaseline) * 100;

  // --- Distribution Generators ---
  const generateNormalDistribution = (mean: number, std: number) => {
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

  const baselineDist = generateNormalDistribution(avgValue, baselineStd);
  const cupedDist = generateNormalDistribution(avgValue, cupedStd);

  // --- Distribution Chart Scales ---
  const distChartWidth = 560;
  const distChartHeight = 300;
  const padding = { left: 60, bottom: 50, top: 30, right: 30 };

  const distMinX = avgValue - baselineStd * 2.3;
  const distMaxX = avgValue + baselineStd * 2.3;
  const distXRange = distMaxX - distMinX;

  const distMaxY = Math.max(
    ...baselineDist.map(p => p.y),
    ...cupedDist.map(p => p.y)
  );

  const xScale = (x: number) =>
    padding.left +
    ((x - distMinX) / distXRange) *
      (distChartWidth - padding.left - padding.right);

  const yScale = (y: number) =>
    distChartHeight -
    padding.bottom -
    (y / distMaxY) *
      (distChartHeight - padding.top - padding.bottom);

  const createPath = (dist: any[]) => {
    let path = `M ${xScale(dist[0].x)} ${yScale(dist[0].y)}`;
    for (let i = 1; i < dist.length; i++) {
      path += ` L ${xScale(dist[i].x)} ${yScale(dist[i].y)}`;
    }
    return path;
  };

  // --- R² Bar Chart ---
  const r2ChartWidth = 360;
  const barHeight = 26;
  const barMaxWidth = 260;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-8 h-8 text-emerald-300" />
          <h1 className="text-4xl font-bold text-white">
            CUPED Variance Reduction
          </h1>
        </div>
        <p className="text-lg text-gray-400 mb-6">
          CUPED reduces variance in A/B tests using pre-experiment data. In practice,
          the benefit depends on both <strong>correlation strength</strong> and
          <strong> how many users actually have historical data</strong>.
        </p>

        {/* Parameters */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Parameters</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* R² */}
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
                How predictive pre-experiment data is for in-experiment behavior.
              </p>
            </div>

            {/* Coverage */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                % of Records with Historical Data
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={coverage}
                onChange={e => setCoverage(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-400 mt-1">
                {(coverage * 100).toFixed(0)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Users eligible for CUPED adjustment.
              </p>
            </div>

            {/* Effective Result */}
            <div className="bg-emerald-900 border border-emerald-700 rounded-md p-3">
              <p className="text-sm font-medium text-white">
                Effective Variance Reduction
              </p>
              <p className="text-2xl font-bold text-emerald-400">
                {(effectiveRSquared * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-emerald-200 mt-1">
                R² × Coverage
              </p>
            </div>
          </div>
        </div>

        {/* R² Impact Chart */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            How Coverage Dampens CUPED
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Even with strong correlation, CUPED’s real-world impact shrinks if
            historical data is missing for many users.
          </p>

          <svg width="100%" height="120" viewBox={`0 0 ${r2ChartWidth} 120`}>
            {/* Raw R² */}
            <text x="0" y="24" className="fill-gray-300 text-sm">Raw R²</text>
            <rect
              x="80"
              y="10"
              height={barHeight}
              width={barMaxWidth * rSquared}
              fill="#94a3b8"
              rx="6"
            />
            <text
              x={80 + barMaxWidth * rSquared + 6}
              y="28"
              className="fill-gray-300 text-sm"
            >
              {rSquared.toFixed(2)}
            </text>

            {/* Effective R² */}
            <text x="0" y="70" className="fill-emerald-400 text-sm">
              Effective R²
            </text>
            <rect
              x="80"
              y="56"
              height={barHeight}
              width={barMaxWidth * effectiveRSquared}
              fill="#10b981"
              rx="6"
            />
            <text
              x={80 + barMaxWidth * effectiveRSquared + 6}
              y="74"
              className="fill-emerald-400 text-sm font-semibold"
            >
              {effectiveRSquared.toFixed(2)}
            </text>
          </svg>
        </div>

        {/* Distribution + MDE */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            Variance & Minimum Detectable Effect
          </h2>

          <svg
            width="100%"
            height={distChartHeight}
            viewBox={`0 0 ${distChartWidth} ${distChartHeight}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d={createPath(baselineDist)}
              fill="#94a3b8"
              fillOpacity="0.3"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            <path
              d={createPath(cupedDist)}
              fill="#10b981"
              fillOpacity="0.4"
              stroke="#10b981"
              strokeWidth="2"
            />
          </svg>

          <div className="mt-4 text-center text-sm text-emerald-400 font-semibold">
            {mdeReduction.toFixed(1)}% smaller MDE with effective CUPED
          </div>
        </div>

        {/* Key Insight */}
        <div className="bg-emerald-900/40 border border-emerald-700 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Key Insight</h3>
          <p className="text-sm text-emerald-200">
            CUPED’s theoretical power assumes perfect coverage. In practice,
            <strong> missing historical data linearly reduces its impact</strong>.
            High R² alone is not enough — coverage matters just as much.
          </p>
        </div>
      </div>
    </div>
  );
}
