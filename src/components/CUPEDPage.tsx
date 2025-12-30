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

  // --- Distributions ---
  const baselineDist = generateNormalDistribution(avgValue, baselineStd);
  const cupedDist = generateNormalDistribution(avgValue, cupedStd);

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

  const mdeReduction = ((mdeBaseline - mdeCuped) / mdeBaseline * 100);

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

        {/* --- Combined Visualization Section --- */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-md mb-6 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Variance Reduction Visualization */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Variance Reduction</h2>
              <p className="text-sm text-gray-400 mb-4">
                CUPED narrows the distribution by removing predictable variance.
              </p>
              <svg
                width="100%"
                height={distChartHeight}
                viewBox={`0 0 ${distChartWidth} ${distChartHeight}`}
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d={createDistPath(baselineDist)}
                  fill="#94a3b8"
                  fillOpacity="0.3"
                  stroke="#94a3b8"
                  strokeWidth="2"
                />
                <path
                  d={createDistPath(cupedDist)}
                  fill="#10b981"
                  fillOpacity="0.4"
                  stroke="#10b981"
                  strokeWidth="2"
                />
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
                <rect x={distChartWidth - 180} y={40} width="22" height="12" fill="#94a3b8" fillOpacity="0.3" />
                <text x={distChartWidth - 150} y={50} className="text-sm fill-gray-200">Standard</text>
                <rect x={distChartWidth - 180} y={60} width="22" height="12" fill="#10b981" fillOpacity="0.4" />
                <text x={distChartWidth - 150} y={70} className="text-sm fill-gray-200">CUPED</text>
              </svg>
            </div>

            {/* Right: MDE Comparison Bar Chart */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Minimum Detectable Effect</h2>
              <p className="text-sm text-gray-400 mb-4">
                Lower MDE means you can detect smaller effects with the same sample size.
              </p>
              <div className="flex flex-col justify-center h-[260px]">
                <div className="space-y-6">
                  {/* Standard MDE Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-300">Standard A/B</span>
                      <span className="text-lg font-bold text-gray-300">{mdeBaseline.toFixed(2)}%</span>
                    </div>
                    <div className="h-10 bg-gray-700 rounded-lg overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-gray-500 to-gray-400 rounded-lg transition-all duration-500"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  {/* CUPED MDE Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-emerald-400">With CUPED</span>
                      <span className="text-lg font-bold text-emerald-400">{mdeCuped.toFixed(2)}%</span>
                    </div>
                    <div className="h-10 bg-gray-700 rounded-lg overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-lg transition-all duration-500"
                        style={{ width: `${(mdeCuped / mdeBaseline) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* MDE Reduction Summary */}
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <div className="h-px flex-1 bg-gray-600" />
                    <span className="text-emerald-400 font-semibold text-sm px-3">
                      {mdeReduction.toFixed(1)}% smaller MDE
                    </span>
                    <div className="h-px flex-1 bg-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Key Insight --- */}
        <div className="mb-6 bg-emerald-900/50 border border-emerald-700 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Key Insight</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-emerald-200">
              <span className="text-emerald-400 font-semibold">Std Dev:</span> {baselineStd.toFixed(0)} → {cupedStd.toFixed(0)} ({((1 - cupedStd / baselineStd) * 100).toFixed(1)}% reduction)
            </div>
            <div className="text-emerald-200">
              <span className="text-emerald-400 font-semibold">Sample Savings:</span> {sampleReductionPercent}% fewer samples needed
            </div>
            <div className="text-emerald-200">
              <span className="text-emerald-400 font-semibold">MDE Improvement:</span> {mdeBaseline.toFixed(2)}% → {mdeCuped.toFixed(2)}%
            </div>
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

        {/* --- Benefits of CUPED --- */}
        <div className="mt-6 bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Why Use CUPED?</h2>
          <div className="text-gray-300 space-y-3">
            <p>
              CUPED's effectiveness depends entirely on <strong>how well your pre-experiment data correlates with in-experiment behavior</strong>. When R² is high (strong correlation), CUPED delivers substantial benefits:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <strong>Faster Test Results:</strong> With reduced variance, you reach statistical significance sooner—potentially cutting test duration in half or more when R² is high.
              </li>
              <li>
                <strong>Smaller Sample Requirements:</strong> Achieve the same statistical power with fewer samples. For example, R² = 0.7 means you need ~70% fewer samples to detect the same effect size.
              </li>
              <li>
                <strong>Detect Smaller Effects:</strong> Lower variance means you can reliably detect more subtle changes in user behavior, making tests more sensitive.
              </li>
              <li>
                <strong>Better ROI on Experimentation:</strong> Run more tests with the same traffic, iterate faster, and make data-driven decisions with greater confidence.
              </li>
            </ul>
            <div className="bg-emerald-900/30 border border-emerald-700 rounded p-4 mt-4">
              <p className="text-sm">
                <strong>Key Principle:</strong> The stronger the relationship between past and present behavior (higher R²), the more predictive power CUPED provides. Metrics like revenue, engagement time, or conversion rates often show strong correlations, making them ideal candidates for CUPED. However, even moderate correlations (R² = 0.3-0.5) can meaningfully accelerate your testing program.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
