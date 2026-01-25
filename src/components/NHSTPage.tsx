import React, { useState, useMemo } from 'react';
import { Info } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';  
import { LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ComposedChart } from 'recharts';

const NHSTPage: React.FC = () => {
  const [power, setPower] = useState(0.8);
  const [sampleSize, setSampleSize] = useState(50);
  const [alpha, setAlpha] = useState(0.05);
  const [testType, setTestType] = useState<'one-sided' | 'two-sided'>('two-sided');

  const calculateDistributions = useMemo(() => {
    const standardError = 1 / Math.sqrt(sampleSize);
    const mean0 = 0;

    const zAlpha = testType === 'two-sided' ? getZCritical(alpha / 2) : getZCritical(alpha);
    const zBeta = getZCritical(1 - power);

    const effectSize = (zAlpha + zBeta) * standardError;
    const mean1 = effectSize;

    const criticalValue = mean0 + zAlpha * standardError;
    const criticalValueLower = testType === 'two-sided' ? mean0 - zAlpha * standardError : null;

    const beta = effectSize === 0 ? null : calculateBeta(mean1, standardError, criticalValue);
    const actualPower = effectSize === 0 ? null : (beta !== null ? 1 - beta : null);

    const points = [];
    const min = Math.min(mean0, mean1) - 4 * standardError;
    const max = Math.max(mean0, mean1) + 4 * standardError;
    const step = (max - min) / 200;

    for (let x = min; x <= max; x += step) {
      const h0Density = normalPDF(x, mean0, standardError);
      const h1Density = effectSize === 0 ? 0 : normalPDF(x, mean1, standardError);

      let h0Reject = 0;
      if (testType === 'two-sided') {
        h0Reject = (x >= criticalValue || (criticalValueLower !== null && x <= criticalValueLower)) ? h0Density : 0;
      } else {
        h0Reject = x >= criticalValue ? h0Density : 0;
      }

      points.push({
        x: x,
        h0: h0Density,
        h1: h1Density,
        h0Reject: h0Reject,
        h1Accept: x < criticalValue && effectSize !== 0 ? h1Density : 0,
        h1Reject: x >= criticalValue && effectSize !== 0 ? h1Density : 0,
      });
    }

    const maxDensity = Math.max(...points.map(p => Math.max(p.h0, p.h1)));

    return {
      points,
      criticalValue,
      criticalValueLower,
      zCritical: zAlpha,
      beta,
      power: actualPower,
      effectSize,
      standardError,
      mean0,
      mean1,
      maxDensity
    };
  }, [power, sampleSize, alpha, testType]);

  function normalPDF(x: number, mean: number, sd: number): number {
    const exponent = -0.5 * Math.pow((x - mean) / sd, 2);
    return (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
  }

  function normalCDF(x: number, mean: number, sd: number): number {
    const z = (x - mean) / sd;
    return 0.5 * (1 + erf(z / Math.sqrt(2)));
  }

  function erf(x: number): number {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  }

  function getZCritical(alpha: number): number {
    return inverseNormalCDF(1 - alpha);
  }

  function inverseNormalCDF(p: number): number {
    const a = [
      -3.969683028665376e+01, 2.209460984245205e+02,
      -2.759285104469687e+02, 1.383577518672690e+02,
      -3.066479806614716e+01, 2.506628277459239e+00
    ];
    const b = [
      -5.447609879822406e+01, 1.615858368580409e+02,
      -1.556989798598866e+02, 6.680131188771972e+01,
      -1.328068155288572e+01
    ];
    const c = [
      -7.784894002430293e-03, -3.223964580411365e-01,
      -2.400758277161838e+00, -2.549732539343734e+00,
      4.374664141464968e+00, 2.938163982698783e+00
    ];
    const d = [
      7.784695709041462e-03, 3.224671290700398e-01,
      2.445134137142996e+00, 3.754408661907416e+00
    ];

    if (p < 0.02425) {
      const q = Math.sqrt(-2 * Math.log(p));
      return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    } else if (p <= 0.97575) {
      const q = p - 0.5;
      const r = q * q;
      return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
        (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    } else {
      const q = Math.sqrt(-2 * Math.log(1 - p));
      return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
  }

  function calculateBeta(mean1: number, sd: number, criticalValue: number): number {
    return normalCDF(criticalValue, mean1, sd);
  }

  return (
    <div className="min-h-screen bg-gray-900"> 
      <Helmet>
        <title>Null Hypothesis Significance Testing | Guardrails</title>
        <meta name="description" content="Interactive visualization of statistical power, Type I & II errors, effect sizes, and how they relate to experimental guardrails." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            Understanding Null Hypothesis Significance Testing
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            An interactive visualization of statistical power, Type I and Type II errors, and effect sizes
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 mb-6">
          <div className="mb-6">
            <div className="flex items-start gap-3 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-200">
                <p className="mb-2">
                  This visualization shows the sampling distributions under the null hypothesis (H₀) and
                  alternative hypothesis (H₁) for a one-sample Z-test. Adjust the parameters below to see
                  how they affect statistical power, Type I error (α), and Type II error (β).
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Type I error (α)</strong>: Rejecting H₀ when it's true (false positive)</li>
                  <li><strong>Type II error (β)</strong>: Failing to reject H₀ when it's false (false negative)</li>
                  <li><strong>Power (1-β)</strong>: Probability of correctly rejecting a false H₀</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Statistical Power (1-β): {(power * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.05"
                max="0.99"
                step="0.01"
                value={power}
                onChange={(e) => setPower(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5%</span>
                <span>99%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Sample Size (n): {sampleSize}
              </label>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={sampleSize}
                onChange={(e) => setSampleSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>10</span>
                <span>200</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Significance Level (α): {(alpha * 100).toFixed(1)}%
              </label>
              <input
                type="range"
                min="0.001"
                max="0.15"
                step="0.001"
                value={alpha}
                onChange={(e) => setAlpha(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0.1%</span>
                <span>15.0%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Test Type
              </label>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => setTestType('one-sided')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    testType === 'one-sided'
                      ? 'bg-[#0017D2] text-white'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  }`}
                >
                  One-Sided
                </button>
                <button
                  onClick={() => setTestType('two-sided')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    testType === 'two-sided'
                      ? 'bg-[#0017D2] text-white'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  }`}
                >
                  Two-Sided
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Sampling Distributions</h3>
            <ResponsiveContainer width="100%" height={450}>
              <ComposedChart data={calculateDistributions.points} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="x"
                  stroke="#9ca3af"
                  label={{ value: 'Test Statistic', position: 'insideBottom', offset: -5, fill: '#d1d5db' }}
                  tickFormatter={(val) => val.toFixed(1)}
                  tick={{ fill: '#d1d5db' }}
                />
                <YAxis
                  stroke="#9ca3af"
                  label={{ value: 'Probability Density', angle: -90, position: 'insideLeft', fill: '#d1d5db' }}
                  tick={{ fill: '#d1d5db' }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.95)', border: '1px solid #4b5563', borderRadius: '8px' }}
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null;

                    // Find the item with the highest value (most relevant)
                    const item = payload.reduce((max, curr) =>
                      (curr.value || 0) > (max.value || 0) ? curr : max
                    );

                    if (!item || !item.value) return null;

                    let label = '';
                    if (item.name === 'H₀: μ = 0') label = 'Null Hypothesis';
                    else if (item.name?.toString().startsWith('H₁:')) label = 'Alternative Hypothesis';
                    else if (item.name === 'α (Type I Error)') label = 'Type I Error';
                    else if (item.name === 'β (Type II Error)') label = 'Type II Error';
                    else if (item.name === 'Power (1-β)') label = 'Statistical Power';

                    if (!label) return null;

                    return (
                      <div style={{
                        backgroundColor: 'rgba(31, 41, 55, 0.95)',
                        border: '1px solid #4b5563',
                        borderRadius: '8px',
                        padding: '8px 12px'
                      }}>
                        <p style={{ margin: 0, fontWeight: 500, color: '#e5e7eb' }}>{label}</p>
                      </div>
                    );
                  }}
                  cursor={false}
                  isAnimationActive={false}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />

                <ReferenceLine
                  x={calculateDistributions.mean0}
                  stroke="#1e40af"
                  strokeWidth={3}
                  label={{
                    value: 'μ₀',
                    position: 'top',
                    fill: '#1e40af',
                    fontWeight: 'bold',
                    fontSize: 13
                  }}
                  ifOverflow="extendDomain"
                />

                {calculateDistributions.effectSize > 0 && (
                  <>
                    <ReferenceLine
                      x={calculateDistributions.mean1}
                      stroke="#dc2626"
                      strokeWidth={3}
                      label={{
                        value: `μ₁`,
                        position: 'top',
                        fill: '#dc2626',
                        fontWeight: 'bold',
                        fontSize: 13
                      }}
                      ifOverflow="extendDomain"
                    />
                    <ReferenceLine
                      segment={[
                        { x: calculateDistributions.mean0, y: calculateDistributions.maxDensity * 0.15 },
                        { x: calculateDistributions.mean1, y: calculateDistributions.maxDensity * 0.15 }
                      ]}
                      stroke="#a78bfa"
                      strokeWidth={4}
                      label={{
                        value: `Cohen's d = ${calculateDistributions.effectSize.toFixed(3)}`,
                        position: 'center',
                        fill: '#c4b5fd',
                        fontWeight: 'bold',
                        fontSize: 12,
                        offset: -15
                      }}
                      ifOverflow="extendDomain"
                    />
                  </>
                )}

                <ReferenceLine
                  x={calculateDistributions.criticalValue}
                  stroke="#0ea5e9"
                  strokeWidth={2.5}
                  strokeDasharray="6 3"
                  label={{
                    value: testType === 'two-sided' ? 'Upper' : 'Critical',
                    position: 'insideTopRight',
                    fill: '#0ea5e9',
                    fontWeight: 'bold',
                    fontSize: 12
                  }}
                  ifOverflow="extendDomain"
                />

                {testType === 'two-sided' && calculateDistributions.criticalValueLower !== null && (
                  <ReferenceLine
                    x={calculateDistributions.criticalValueLower}
                    stroke="#0ea5e9"
                    strokeWidth={2.5}
                    strokeDasharray="6 3"
                    label={{
                      value: 'Lower',
                      position: 'insideTopLeft',
                      fill: '#0ea5e9',
                      fontWeight: 'bold',
                      fontSize: 12
                    }}
                    ifOverflow="extendDomain"
                  />
                )}

                <Area
                  type="step"
                  dataKey="h0Reject"
                  fill="#ef4444"
                  fillOpacity={0.25}
                  stroke="none"
                  name="α (Type I Error)"
                  isAnimationActive={false}
                />

                {calculateDistributions.effectSize > 0 && (
                  <>
                    <Area
                      type="step"
                      dataKey="h1Accept"
                      fill="#f97316"
                      fillOpacity={0.25}
                      stroke="none"
                      name="β (Type II Error)"
                      isAnimationActive={false}
                    />
                    <Area
                      type="step"
                      dataKey="h1Reject"
                      fill="#22c55e"
                      fillOpacity={0.25}
                      stroke="none"
                      name="Power (1-β)"
                      isAnimationActive={false}
                    />
                  </>
                )}

                <Line
                  type="monotone"
                  dataKey="h0"
                  stroke="#1e40af"
                  strokeWidth={3.5}
                  dot={false}
                  name="H₀: μ = 0"
                  isAnimationActive={false}
                />

                {calculateDistributions.effectSize > 0 && (
                  <Line
                    type="monotone"
                    dataKey="h1"
                    stroke="#dc2626"
                    strokeWidth={3.5}
                    dot={false}
                    name={`H₁: μ = ${calculateDistributions.effectSize.toFixed(2)}`}
                    isAnimationActive={false}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 p-3 bg-blue-900/30 rounded-lg border border-blue-600">
                <div className="w-1 h-6" style={{ backgroundColor: '#1e40af' }}></div>
                <span className="text-blue-200"><strong>μ₀ = 0:</strong> H₀ mean</span>
              </div>
              {calculateDistributions.effectSize > 0 && (
                <div className="flex items-center gap-2 p-3 bg-red-900/30 rounded-lg border border-red-600">
                  <div className="w-1 h-6" style={{ backgroundColor: '#dc2626' }}></div>
                  <span className="text-red-200"><strong>μ₁ = {calculateDistributions.effectSize.toFixed(3)}:</strong> H₁ mean</span>
                </div>
              )}
              <div className="flex items-center gap-2 p-3 bg-cyan-900/30 rounded-lg border border-cyan-600">
                <div className="w-4 h-0.5" style={{ borderTop: '3px dashed #0ea5e9' }}></div>
                <span className="text-cyan-200"><strong>Critical Value{testType === 'two-sided' ? 's' : ''}:</strong> Decision threshold{testType === 'two-sided' ? 's' : ''}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-600">
              <div className="text-xs font-semibold text-purple-300 mb-1">Effect Size (Cohen's d)</div>
              <div className="text-2xl font-bold text-purple-100">{calculateDistributions.effectSize.toFixed(3)}</div>
              <div className="text-xs text-purple-400 mt-1">Calculated from power</div>
            </div>

            <div className="bg-red-900/30 p-4 rounded-lg border border-red-600">
              <div className="text-xs font-semibold text-red-300 mb-1">Type I Error (α)</div>
              <div className="text-2xl font-bold text-red-100">{(alpha * 100).toFixed(2)}%</div>
              <div className="text-xs text-red-400 mt-1">False Positive Rate</div>
            </div>

            <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-600">
              <div className="text-xs font-semibold text-orange-300 mb-1">Type II Error (β)</div>
              <div className="text-2xl font-bold text-orange-100">{((1 - power) * 100).toFixed(2)}%</div>
              <div className="text-xs text-orange-400 mt-1">False Negative Rate</div>
            </div>

            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-600">
              <div className="text-xs font-semibold text-blue-300 mb-1">Critical Value{testType === 'two-sided' ? 's' : ''}</div>
              <div className="text-lg font-bold text-blue-100">
                {testType === 'two-sided' && calculateDistributions.criticalValueLower !== null
                  ? `±${calculateDistributions.criticalValue.toFixed(3)}`
                  : calculateDistributions.criticalValue.toFixed(3)}
              </div>
              <div className="text-xs text-blue-400 mt-1">z = {calculateDistributions.zCritical.toFixed(3)}</div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Understanding the Visualization</h2>

          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold text-lg text-white mb-2">The Distributions</h3>
              <p className="leading-relaxed mb-2">
                The <span className="font-semibold text-blue-400">blue curve</span> (H₀) represents the sampling distribution
                under the null hypothesis, centered at μ₀ = 0. The <span className="font-semibold text-red-400">red curve</span> (H₁) represents
                the sampling distribution under the alternative hypothesis. The solid vertical lines mark the mean (center) of each distribution.
                The <span className="font-semibold text-purple-400">purple horizontal line</span> between the means shows Cohen's d—the standardized distance between the two distributions.
              </p>
              <p className="leading-relaxed text-sm bg-gray-900/50 p-3 rounded border border-gray-700">
                <strong>Key insight:</strong> This visualization calculates the required <strong>effect size (Cohen's d)</strong> based on your desired power, sample size, and alpha level.
                The H₀ distribution never moves (always centered at 0). Changing <strong>alpha (α)</strong> moves the <strong>critical value</strong> (cyan dashed line).
                Changing <strong>power</strong> adjusts how far apart the distributions need to be.
              </p>

              {/* --- Added Cohen's d Explanation --- */}
              <p className="leading-relaxed text-sm bg-gray-900/50 p-3 rounded border border-gray-700 mt-2">
                <strong>Cohen's d:</strong> Cohen's d measures the standardized difference between the two distributions' means.
                It is calculated as the difference between the means divided by the pooled standard deviation.
                Larger values indicate greater separation between groups, making effects easier to detect.
                In the visualization, the purple line shows this distance relative to the spread of the distributions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-white mb-2">One-Sided vs Two-Sided Tests</h3>
              <p className="leading-relaxed">
                A <strong>one-sided test</strong> only rejects H₀ if the test statistic is in one tail (upper or lower).
                A <strong>two-sided test</strong> rejects H₀ if the test statistic is in either tail. Two-sided tests split
                the alpha level between both tails (α/2 each), making them more conservative for detecting effects in a specific direction.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-white mb-2">Type I Error (α)</h3>
              <p className="leading-relaxed">
                The <span className="font-semibold text-red-400">red shaded area</span> under the H₀ distribution represents
                the Type I error rate—the probability of incorrectly rejecting a true null hypothesis (false positive).
                For two-sided tests, this area is split between both tails. Adjusting α changes where the critical value(s) sit.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-white mb-2">Type II Error (β) and Power</h3>
              <p className="leading-relaxed mb-2">
                The <span className="font-semibold text-orange-400">orange shaded area</span> under the H₁ distribution
                (to the left of the critical value) represents Type II error (β)—the probability of failing to detect a true effect (false negative).
              </p>
              <p className="leading-relaxed">
                The <span className="font-semibold text-green-400">green shaded area</span> represents statistical power (1-β)—
                the probability of correctly rejecting a false null hypothesis. When you set the desired power, the visualization
                calculates what effect size you'd need to achieve that power given your sample size and alpha level.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-white mb-2">How the Parameters Interact</h3>
              <div className="space-y-2 leading-relaxed">
                <p><strong>Power (1-β):</strong> Set your desired power level (typically 0.80). Higher power requires a larger effect size (distributions further apart) or larger sample size.</p>
                <p><strong>Sample Size (n):</strong> Larger samples make distributions narrower (smaller standard error), allowing detection of smaller effects while maintaining the same power.</p>
                <p><strong>Alpha (α):</strong> Controls the Type I error rate. Lower α (more conservative) moves the critical value(s) further out, requiring larger effects to achieve the same power.</p>
                <p><strong>Test Type:</strong> Two-sided tests split alpha between both tails, requiring slightly larger effect sizes than one-sided tests to achieve the same power.</p>
              </div>
            </div>
            <div className="mt-12 bg-gray-700 rounded-lg p-6 text-center">
              <p className="text-gray-300 mb-4">
                See how frequent peeking can inflate false positives in A/B tests
              </p>
              <Link
                to="/peeking"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded transition-colors"
              >
                Explore False Positives from Peeking →
              </Link>
            </div>
    );
};

export default NHSTPage;