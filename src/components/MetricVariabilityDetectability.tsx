import { Helmet } from 'react-helmet-async';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import { Gauge } from 'lucide-react';

export function VariabilityVsCoevPage() {
  const data = [
    { proportion: 0.1, variance: 0.09, coev: 0.1, mde_prop: 2.63, mde_cont: 0.88 },
    { proportion: 0.2, variance: 0.16, coev: 0.2, mde_prop: 3.51, mde_cont: 1.75 },
    { proportion: 0.3, variance: 0.21, coev: 0.3, mde_prop: 4.02, mde_cont: 2.63 },
    { proportion: 0.4, variance: 0.24, coev: 0.4, mde_prop: 4.29, mde_cont: 3.51 },
    { proportion: 0.5, variance: 0.25, coev: 0.5, mde_prop: 4.38, mde_cont: 4.38 },
    { proportion: 0.6, variance: 0.24, coev: 0.6, mde_prop: 4.29, mde_cont: 5.26 },
    { proportion: 0.7, variance: 0.21, coev: 0.7, mde_prop: 4.02, mde_cont: 6.14 },
    { proportion: 0.8, variance: 0.16, coev: 0.8, mde_prop: 3.51, mde_cont: 7.01 },
    { proportion: 0.9, variance: 0.09, coev: 0.9, mde_prop: 2.63, mde_cont: 7.89 },
    { proportion: 1, variance: 0, coev: 1, mde_prop: 0, mde_cont: 8.77 }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Helmet>
        <title>Variability vs Coefficient of Variation</title>
        <meta
          name="description"
          content="Explore how binary proportions and continuous metrics behave under different levels of variability, and how this affects minimum detectable effect (MDE) and experiment runtime."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-2">
          <Gauge className="w-8 h-8 text-slate-600" />
          <h1 className="text-4xl font-bold text-white">Proportion Variability vs Coefficient of Variation</h1>
        </div>
        <p className="text-lg text-gray-400 mb-8">
          Both proportion metrics (<em>e.g. conversion rate</em>) and continuous metrics (<em>e.g. score, revenue</em>) experience their worst variability when their values sit near the middle of their range.
          This chart shows a conceptual link: a proportion of 50 % behaves similarly to a continuous metric with a CoV ≈ 0.5 in terms of minimum detectable effect and variance.
        </p>

        {/* Variability Chart */}
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Trade‑off Between Variability and Detectability (MDE)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 40, bottom: 40, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="proportion"
                tickFormatter={(v) => `${Math.round(v * 100)}%`}
                stroke="#9ca3af"
                label={{ value: 'Proportion or CoV', position: 'bottom', fill: '#9ca3af' }}
              />
              <YAxis
                domain={[0, 9]}
                stroke="#9ca3af"
                label={{ value: 'MDE (%)', angle: -90, fill: '#9ca3af', position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', color: '#e5e7eb' }}
                formatter={(v) => `${v.toFixed(2)}%`}
              />
              <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 20, color: '#9ca3af' }} />
              <Line
                type="monotone"
                dataKey="mde_prop"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Proportion MDE"
              />
              <Line
                type="monotone"
                dataKey="mde_cont"
                stroke="#22c55e"
                strokeWidth={3}
                name="Continuous MDE (CoV equivalent)"
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-gray-400 mt-4">
            As proportions move toward 50 % or CoV increases, variability peaks — MDEs rise and larger sample sizes are needed.
            The curves intersect near p ≈ 0.5 ⇄ CoV ≈ 0.5, marking the point of maximum variance and slowest runtime.
          </p>
        </div>

        {/* CoV Explain Section */}
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Understanding the Coefficient of Variation</h2>
          <p className="text-base text-gray-400 mb-4">
            For continuous metrics, variability is described by the <strong>Coefficient of Variation (CoV)</strong>, defined as:
            <br />
            <code className="text-gray-300">CoV = Standard Deviation ÷ Mean</code>.
          </p>
          <p className="text-base text-gray-400">
            A higher CoV means the metric’s standard deviation is large relative to its mean, which increases uncertainty and raises MDE.
            When CoV ≈ 0.5, the metric behaves similarly to a proportion ≈ 50 % — both show maximum variability and slowest detection.
            As CoV falls below 0.3 or rises above 1.0, variability decreases and experiments detect effects faster.
          </p>
        </div>

        <div className="bg-gray-700 rounded-lg p-6 text-center mt-10">
          <p className="text-gray-300 mb-4">
            CUPED can also help reduce variance, especially for metrics that sit near their peak variability.
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
  );
}
