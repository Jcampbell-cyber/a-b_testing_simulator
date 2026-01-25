import React, { useState, useMemo } from 'react';
import { Info } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from 'recharts';

const NHSTPage: React.FC = () => {
  const [power, setPower] = useState(0.8);
  const [sampleSize, setSampleSize] = useState(50);
  const [alpha, setAlpha] = useState(0.05);
  const [testType, setTestType] = useState<'one-sided' | 'two-sided'>('two-sided');

  // Memoized distribution calculations
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
        h0Reject = x >= criticalValue || (criticalValueLower !== null && x <= criticalValueLower) ? h0Density : 0;
      } else {
        h0Reject = x >= criticalValue ? h0Density : 0;
      }

      points.push({
        x,
        h0: h0Density,
        h1: h1Density,
        h0Reject,
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
      maxDensity,
    };
  }, [power, sampleSize, alpha, testType]);

  // Normal PDF
  function normalPDF(x: number, mean: number, sd: number) {
    const exponent = -0.5 * Math.pow((x - mean) / sd, 2);
    return (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
  }

  // Normal CDF
  function normalCDF(x: number, mean: number, sd: number) {
    const z = (x - mean) / sd;
    return 0.5 * (1 + erf(z / Math.sqrt(2)));
  }

  // Error function approximation
  function erf(x: number) {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    const a1 = 0.254829592,
      a2 = -0.284496736,
      a3 = 1.421413741,
      a4 = -1.453152027,
      a5 = 1.061405429,
      p = 0.3275911;
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));
    return sign * y;
  }

  function getZCritical(alpha: number) {
    return inverseNormalCDF(1 - alpha);
  }

  function inverseNormalCDF(p: number) {
    const a = [
        -3.969683028665376e1,
        2.209460984245205e2,
        -2.759285104469687e2,
        1.383577518672690e2,
        -3.066479806614716e1,
        2.506628277459239,
      ],
      b = [
        -5.447609879822406e1,
        1.615858368580409e2,
        -1.556989798598866e2,
        6.680131188771972e1,
        -1.328068155288572e1,
      ],
      c = [
        -7.784894002430293e-3,
        -3.223964580411365e-1,
        -2.400758277161838,
        -2.549732539343734,
        4.374664141464968,
        2.938163982698783,
      ],
      d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];

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

  function calculateBeta(mean1: number, sd: number, criticalValue: number) {
    return normalCDF(criticalValue, mean1, sd);
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Helmet>
        <title>Null Hypothesis Significance Testing | Guardrails</title>
        <meta
          name="description"
          content="Interactive visualization of statistical power, Type I & II errors, effect sizes, and how they relate to experimental guardrails."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Understanding Null Hypothesis Significance Testing</h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            An interactive visualization of statistical power, Type I and Type II errors, and effect sizes.
          </p>
        </div>

        {/* Controls */}
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
            {/* Power Control */}
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
                onChange={e => setPower(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5%</span>
                <span>99%</span>
              </div>
            </div>

            {/* Sample Size Control */}
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
                onChange={e => setSampleSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>10</span>
                <span>200</span>
              </div>
            </div>

            {/* Alpha Control */}
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

            {/* Test Type Buttons */}
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
          </div> {/* closes grid of controls */}

          {/* Sampling Distributions Chart */}
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
                  cursor={false}
                  isAnimationActive={false}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />

                {/* Reference lines */}
                <ReferenceLine
                  x={calculateDistributions.mean0}
                  stroke="#1e40af"
                  strokeWidth={3}
                  label={{
                    value: 'μ₀',
                    position: 'top',
                    fill: '#1e40af',
                    fontWeight: 'bold',
                    fontSize: 13,
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
                        fontSize: 13,
                      }}
                      ifOverflow="extendDomain"
                    />
                    <ReferenceLine
                      segment={[
                        { x: calculateDistributions.mean0, y: calculateDistributions.maxDensity * 0.15 },
                        { x: calculateDistributions.mean1, y: calculateDistributions.maxDensity * 0.15 },
                      ]}
                      stroke="#a78bfa"
                      strokeWidth={4}
                      label={{
                        value: `Cohen's d = ${calculateDistributions.effectSize.toFixed(3)}`,
                        position: 'center',
                        fill: '#c4b5fd',
                        fontWeight: 'bold',
                        fontSize: 12,
                        offset: -15,
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
                    fontSize: 12,
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
                      fontSize: 12,
                    }}
                    ifOverflow="extendDomain"
                  />
                )}

                {/* Shaded areas */}
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

                {/* Lines */}
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
            {/* Alpha Control */}
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

            {/* Test Type Buttons */}
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
          </div> {/* closes grid of controls */}

          {/* Sampling Distributions Chart */}
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
                  cursor={false}
                  isAnimationActive={false}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />

                {/* Reference lines */}
                <ReferenceLine
                  x={calculateDistributions.mean0}
                  stroke="#1e40af"
                  strokeWidth={3}
                  label={{
                    value: 'μ₀',
                    position: 'top',
                    fill: '#1e40af',
                    fontWeight: 'bold',
                    fontSize: 13,
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
                        fontSize: 13,
                      }}
                      ifOverflow="extendDomain"
                    />
                    <ReferenceLine
                      segment={[
                        { x: calculateDistributions.mean0, y: calculateDistributions.maxDensity * 0.15 },
                        { x: calculateDistributions.mean1, y: calculateDistributions.maxDensity * 0.15 },
                      ]}
                      stroke="#a78bfa"
                      strokeWidth={4}
                      label={{
                        value: `Cohen's d = ${calculateDistributions.effectSize.toFixed(3)}`,
                        position: 'center',
                        fill: '#c4b5fd',
                        fontWeight: 'bold',
                        fontSize: 12,
                        offset: -15,
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
                    fontSize: 12,
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
                      fontSize: 12,
                    }}
                    ifOverflow="extendDomain"
                  />
                )}

                {/* Shaded areas */}
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

                {/* Lines */}
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
