import { Helmet } from 'react-helmet-async';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';
import { Link } from 'react-router-dom';
import { Gauge } from 'lucide-react';

const data = [
  { proportion: 0.0, variance: 0.00, coev: 0.0, mde_prop: 0.00,  mde_cont: 0.00  },
  { proportion: 0.1, variance: 0.09, coev: 0.1, mde_prop: 2.63,  mde_cont: 0.88  },
  { proportion: 0.2, variance: 0.16, coev: 0.2, mde_prop: 3.51,  mde_cont: 1.75  },
  { proportion: 0.3, variance: 0.21, coev: 0.3, mde_prop: 4.02,  mde_cont: 2.63  },
  { proportion: 0.4, variance: 0.24, coev: 0.4, mde_prop: 4.29,  mde_cont: 3.51  },
  { proportion: 0.5, variance: 0.25, coev: 0.5, mde_prop: 4.38,  mde_cont: 4.38  },
  { proportion: 0.6, variance: 0.24, coev: 0.6, mde_prop: 4.29,  mde_cont: 5.26  },
  { proportion: 0.7, variance: 0.21, coev: 0.7, mde_prop: 4.02,  mde_cont: 6.14  },
  { proportion: 0.8, variance: 0.16, coev: 0.8, mde_prop: 3.51,  mde_cont: 7.01  },
  { proportion: 0.9, variance: 0.09, coev: 0.9, mde_prop: 2.63,  mde_cont: 7.89  },
  { proportion: 1.0, variance: 0.00, coev: 1.0, mde_prop: 0.00,  mde_cont: 8.77  },
];

// Custom tooltip showing CoV, MDE type clarifications, and runtime advantage
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  const row = data.find(d => d.proportion === label);
  const coev = row?.coev ?? label;
  const mde_prop = payload.find((p: any) => p.dataKey === 'mde_prop')?.value;
  const mde_cont = payload.find((p: any) => p.dataKey === 'mde_cont')?.value;

  let runtimeNote = null;
  if (mde_prop != null && mde_cont != null && mde_cont > 0 && mde_prop > 0) {
    // Sample size ∝ 1/MDE² so runtime ratio = (mde_prop/mde_cont)²
    const runtimeRatio = Math.pow(mde_cont / mde_prop, 2);
    if (runtimeRatio < 1) {
      const pctFaster = ((1 - runtimeRatio) * 100).toFixed(0);
      runtimeNote = `Continuous metric needs ~${pctFaster}% more samples than proportion at this point`;
    } else if (runtimeRatio > 1) {
      const pctFaster = ((1 - 1 / runtimeRatio) * 100).toFixed(0);
      runtimeNote = `Proportion metric needs ~${pctFaster}% more samples than continuous at this point`;
    } else {
      runtimeNote = 'Both metrics require equal sample sizes at this point';
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-600 rounded p-3 text-sm max-w-xs">
      <p className="text-white font-semibold mb-1">
        Proportion: {(label * 100).toFixed(0)}% &nbsp;|&nbsp; CoV: {coev.toFixed(1)}
      </p>
      {mde_prop != null && (
        <p className="text-blue-400">
          Proportion MDE: {mde_prop.toFixed(2)}%
          <span className="text-gray-400 text-xs block">Absolute percentage-point uplift required</span>
        </p>
      )}
      {mde_cont != null && (
        <p className="text-green-400 mt-1">
          Continuous MDE: {mde_cont.toFixed(2)}%
          <span className="text-gray-400 text-xs block">Relative % increase in metric required</span>
        </p>
      )}
      {runtimeNote && (
        <p className="text-amber-400 text-xs mt-2 border-t border-gray-700 pt-2">{runtimeNote}</p>
      )}
    </div>
  );
};

export function VariabilityVsCoevPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Helmet>
        <title>Metric Variability & Detectability | Experiment Tools</title>
        <meta
          name="description"
          content="Explore how binary proportions and continuous metrics behave under different levels of variability, and how this affects MDE and experiment runtime."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-2">
          <Gauge className="w-8 h-8 text-slate-400" />
          <h1 className="text-4xl font-bold text-white">Metric Variability & Detectability</h1>
        </div>
        <p className="text-lg text-gray-400 mb-8">
          The variability of your metric directly determines how long your experiment needs to run.
          Both <strong className="text-white">proportion metrics</strong> (e.g. conversion rate) and{' '}
          <strong className="text-white">continuous metrics</strong> (e.g. average revenue, scores) have
          different variability profiles — and choosing the right metric type can significantly reduce
          experiment runtime.
        </p>

        {/* Key insight callout */}
        <div className="bg-blue-900 border border-blue-700 rounded-lg p-5 mb-8">
          <p className="text-blue-100 font-semibold text-base mb-1">Key Insight</p>
          <p className="text-blue-200 text-sm">
            If your continuous metric has a <strong>Coefficient of Variation (CoV) above 0.5</strong>,
            consider whether you can reframe it as a proportion metric. This often results in a
            substantially lower MDE and faster experiment runtime — at the cost of a slight change
            in metric definition.
          </p>
        </div>

        {/* Chart */}
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-1">
            MDE by Proportion Baseline and Continuous Metric CoV
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Both axes use the same <strong className="text-white">n = 1,000 per group</strong>.
            Proportion MDE is expressed as an <em>absolute percentage-point uplift</em>;
            continuous MDE is expressed as a <em>relative % increase</em> in the metric value.
            Hover for runtime comparison.
          </p>
          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={data} margin={{ top: 20, right: 40, bottom: 50, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="proportion"
                tickFormatter={(v) => `${Math.round(v * 100)}%`}
                stroke="#9ca3af"
                label={{
                  value: 'Proportion baseline (left axis) / CoV of continuous metric (right axis)',
                  position: 'insideBottom',
                  offset: -30,
                  fill: '#9ca3af',
                  fontSize: 12,
                }}
              />
              <YAxis
                domain={[0, 9]}
                stroke="#9ca3af"
                label={{ value: 'MDE (%)', angle: -90, fill: '#9ca3af', position: 'insideLeft', offset: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: 30, color: '#9ca3af' }}
              />
              <Line
                type="monotone"
                dataKey="mde_prop"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
                name="Proportion MDE (abs pp uplift)"
              />
              <Line
                type="monotone"
                dataKey="mde_cont"
                stroke="#22c55e"
                strokeWidth={3}
                dot={false}
                name="Continuous MDE (relative % uplift)"
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-gray-400 text-sm mt-4">
            The proportion curve peaks at 50 % baseline and falls toward 0 % and 100 %.
            The continuous curve grows linearly with CoV.
            Where the <span className="text-green-400 font-semibold">green line sits above the blue</span>,
            switching to a proportion metric means a lower MDE and a faster experiment.
          </p>
        </div>

        {/* Metric redefinition trade-off */}
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            Switching Metric Type: The Trade-off
          </h2>
          <p className="text-base text-gray-400 mb-4">
            Converting a continuous metric to a proportion often means slightly redefining what you measure.
            The benefit is a large reduction in variability and experiment runtime.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded p-4">
              <p className="text-white font-semibold mb-2">Example</p>
              <p className="text-gray-300 text-sm mb-1">
                <span className="text-green-400 font-semibold">Continuous:</span>{' '}
                Average application quality score per user
                <span className="text-gray-500 text-xs block">(e.g. mean dotmatch score — high CoV, noisy)</span>
              </p>
              <p className="text-gray-300 text-sm mt-3">
                <span className="text-blue-400 font-semibold">Proportion equivalent:</span>{' '}
                % of users who submitted at least one high-fit application
                <span className="text-gray-500 text-xs block">(binary — did they hit the threshold? Much lower variance)</span>
              </p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <p className="text-white font-semibold mb-2">What changes</p>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>✅ Substantially lower MDE — detectable with fewer samples</li>
                <li>✅ Faster experiment runtime</li>
                <li>⚠️ Metric definition shifts slightly — you're now measuring a threshold, not an average</li>
                <li>⚠️ You lose granularity — a user scoring 0.95 vs 0.61 looks the same</li>
              </ul>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            Whether this trade-off is acceptable depends on your hypothesis. If the direction of the effect matters more than the magnitude, a proportion metric is often the right call.
          </p>
        </div>

        {/* CoV explainer */}
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">Understanding Coefficient of Variation (CoV)</h2>
          <p className="text-base text-gray-400 mb-3">
            For continuous metrics, the <strong className="text-white">Coefficient of Variation (CoV)</strong> captures
            how noisy the metric is relative to its mean:
          </p>
          <div className="bg-gray-900 rounded p-3 font-mono text-sm text-gray-200 mb-3">
            CoV = Standard Deviation ÷ Mean
          </div>
          <ul className="text-gray-400 text-sm space-y-2">
            <li><span className="text-white font-semibold">CoV &lt; 0.3</span> — low variability, fast experiments, small MDE achievable</li>
            <li><span className="text-white font-semibold">CoV ≈ 0.5</span> — similar variability to a 50 % proportion metric — this is the crossover point</li>
            <li><span className="text-white font-semibold">CoV &gt; 0.5</span> — high variability, slow experiments — consider a proportion equivalent</li>
          </ul>
          <p className="text-gray-400 text-sm mt-4">
            Revenue and score-based metrics often have CoV between 1 and 3 due to extreme outliers,
            making them inherently harder to detect changes in — even after winsorizing.
          </p>
        </div>

        {/* Footer links */}
        <div className="grid md:grid-cols-2 gap-4 mt-10">
          <div className="bg-gray-700 rounded-lg p-6 text-center">
            <p className="text-gray-300 mb-4">
              CUPED can reduce variance for continuous metrics — often a faster alternative to switching metric type.
            </p>
            <Link
              to="/cuped"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              Go to CUPED Variance Reduction →
            </Link>
          </div>
          <div className="bg-gray-700 rounded-lg p-6 text-center">
            <p className="text-gray-300 mb-4">
              Winsorizing can also reduce the impact of outliers on high-CoV continuous metrics.
            </p>
            <Link
              to="/winsorizing"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              Go to Winsorizing →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
