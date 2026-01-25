import { useState } from "react";
import { TrendingUp } from "lucide-react";

export function CUPEDPage() {
  const [rSquared, setRSquared] = useState(0.7);
  const [coverage, setCoverage] = useState(0.8); // Users with historical data

  const avgValue = 1000;
  const sampleSize = 1000;

  // Effective CUPED strength
  const effectiveRSquared = rSquared * coverage;

  // Variance Calculations
  const baselineStd = avgValue * 0.25;
  const cupedStd = baselineStd * Math.sqrt(1 - effectiveRSquared);

  const stdErrorBaseline = baselineStd / Math.sqrt(sampleSize / 2);
  const stdErrorCuped = cupedStd / Math.sqrt(sampleSize / 2);

  const mdeBaseline = (1.96 * 2 * stdErrorBaseline / avgValue) * 100;
  const mdeCuped = (1.96 * 2 * stdErrorCuped / avgValue) * 100;

  const mdeReduction = ((mdeBaseline - mdeCuped) / mdeBaseline) * 100;

  // Distribution generator
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

  // Distribution chart scales
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

  // R² bar chart
  const r2ChartWidth = 360;
  const barHeight = 26;
  const barMaxWidth = 260;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-8 h-8 text-emerald-300" />
          <h1 className="text-4xl font-bold text-white">CUPED Variance Reduction</h1>
        </div>
        <p className="text-lg text-gray-400 mb-6">
          CUPED reduces variance in A/B tests using pre-experiment data. Its real-world impact depends on both <strong>correlation strength</strong> and <strong>how many users actually have historical data</strong>.
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
              <div className="text-center text-sm text-gray-400 mt-1">R² = {rSquared.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">
                How predictive pre-experiment data is for in-experiment behavior.
              </p>
            </div>

            {/* Coverage */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Users with Pre-Experiment Data
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
              <div className="text-center text-sm text-gray-400 mt-1">{(coverage * 100).toFixed(0)}%</div>
              <p className="text-xs text-gray-500 mt-1">
                Fraction of users eligible for CUPED adjustment.
              </p>
            </div>

            {/* Effective Result */}
            <div className="bg-emerald-900 border border-emerald-700 rounded-md p-3">
              <p className="text-sm font-medium text-white">Effective Variance Reduction</p>
              <p className="text-2xl font-bold text-emerald-400">{(effectiveRSquared * 100).toFixed(1)}%</p>
              <p className="text-xs text-emerald-200 mt-1">R² × Coverage</p>
            </div>
          </div>
        </div>

        {/* Distribution + MDE */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <path d={createPath(baselineDist)} fill="#94a3b8" fillOpacity="0.3" stroke="#94a3b8" strokeWidth="2" />
              <path d={createPath(cupedDist)} fill="#10b981" fillOpacity="0.4" stroke="#10b981" strokeWidth="2" />
            </svg>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Minimum Detectable Effect</h2>
            <p className="text-sm text-gray-400 mb-4">
              Lower MDE means you can detect smaller effects with the same sample size.
            </p>
            <div className="flex flex-col justify-center h-[260px] space-y-6">
              {/* Standard MDE Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">Standard A/B</span>
                  <span className="text-lg font-bold text-gray-300">{mdeBaseline.toFixed(2)}%</span>
                </div>
                <div className="h-10 bg-gray-700 rounded-lg overflow-hidden relative">
                  <div className="h-full bg-gradient-to-r from-gray-500 to-gray-400 rounded-lg transition-all duration-500" style={{ width: '100%' }} />
                </div>
              </div>

              {/* CUPED MDE Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-emerald-400">With CUPED</span>
                  <span className="text-lg font-bold text-emerald-400">{mdeCuped.toFixed(2)}%</span>
                </div>
                <div className="h-10 bg-gray-700 rounded-lg overflow-hidden relative">
                  <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-lg transition-all duration-500" style={{ width: `${(mdeCuped / mdeBaseline) * 100}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="h-px flex-1 bg-gray-600" />
                <span className="text-emerald-400 font-semibold text-sm px-3">{mdeReduction.toFixed(1)}% smaller MDE</span>
                <div className="h-px flex-1 bg-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* How Coverage Dampens CUPED */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">How Coverage Dampens CUPED</h2>
          <p className="text-sm text-gray-400 mb-4">
            Even with strong correlation, CUPED’s real-world impact shrinks if historical data is missing for many users.
          </p>
          <svg width="100%" height="120" viewBox={`0 0 ${r2ChartWidth} 120`}>
            {/* Raw R² */}
            <text x="0" y="24" className="fill-gray-300 text-sm">Raw R²</text>
            <rect x="80" y="10" height={barHeight} width={barMaxWidth * rSquared} fill="#94a3b8" rx="6" />
            <text x={80 + barMaxWidth * rSquared + 6} y="28" className="fill-gray-300 text-sm">{rSquared.toFixed(2)}</text>
            {/* Effective R² */}
            <text x="0" y="70" className="fill-emerald-400 text-sm">Effective R²</text>
            <rect x="80" y="56" height={barHeight} width={barMaxWidth * effectiveRSquared} fill="#10b981" rx="6" />
            <text x={80 + barMaxWidth * effectiveRSquared + 6} y="74" className="fill-emerald-400 text-sm font-semibold">{effectiveRSquared.toFixed(2)}</text>
          </svg>
        </div>

        {/* How CUPED Works */}
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

        {/* Key Insight */}
        <div className="mb-6 bg-emerald-900/50 border border-emerald-700 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Key Insight</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-emerald-200">
              <span className="text-emerald-400 font-semibold">Std Dev:</span> {baselineStd.toFixed(0)} → {cupedStd.toFixed(0)} ({((1 - cupedStd / baselineStd) * 100).toFixed(1)}% reduction)
            </div>
            <div className="text-emerald-200">
              <span className="text-emerald-400 font-semibold">Sample Savings:</span> {(effectiveRSquared * 100).toFixed(1)}% fewer samples needed
            </div>
            <div className="text-emerald-200">
              <span className="text-emerald-400 font-semibold">MDE Improvement:</span> {mdeBaseline.toFixed(2)}% → {mdeCuped.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Why Use CUPED */}
        <div className="mt-6 bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Why Use CUPED?</h2>
          <div className="text-gray-300 space-y-3">
            <p>
              CUPED's effectiveness depends on <strong>how well your pre-experiment data correlates with in-experiment behavior</strong>. When R² is high (strong correlation) and coverage is high, CUPED delivers substantial benefits:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Faster Test Results:</strong> Reduced variance allows faster detection of significant effects.</li>
              <li><strong>Smaller Sample Requirements:</strong> Achieve the same power with fewer users.</li>
              <li><strong>Detect Smaller Effects:</strong> Variance reduction makes tests more sensitive.</li>
              <li><strong>Better ROI:</strong> Run more experiments with the same traffic.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
