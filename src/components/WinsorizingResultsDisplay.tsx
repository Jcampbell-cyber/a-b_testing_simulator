import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircle2, XCircle, TrendingDown } from 'lucide-react';
import type { WinsorizingResults, ABTestResults } from '../utils/winsorizingSimulation';

interface WinsorizingResultsDisplayProps {
  results: WinsorizingResults | null;
  abTestResults: ABTestResults | null;
  mode: 'single' | 'abtest';
}

export function WinsorizingResultsDisplay({ results, abTestResults, mode }: WinsorizingResultsDisplayProps) {
  if (!results && !abTestResults) return null;

  if (mode === 'single' && results) {
    return <SingleSampleResults results={results} />;
  }

  if (mode === 'abtest' && abTestResults) {
    return <ABTestResultsDisplay results={abTestResults} />;
  }

  return null;
}

function SingleSampleResults({ results }: { results: WinsorizingResults }) {
  const comparisonData = [
    {
      metric: 'Mean',
      original: results.original.mean,
      winsorized: results.winsorized.mean
    },
    {
      metric: 'Std Dev',
      original: results.original.std,
      winsorized: results.winsorized.std
    },
    {
      metric: 'CI Width',
      original: results.comparison.ciWidthOriginal,
      winsorized: results.comparison.ciWidthWinsorized
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          title="Outliers Detected"
          value={results.original.outlierCount}
          subtitle={`${((results.original.outlierCount / results.original.data.length) * 100).toFixed(1)}% of sample`}
          icon={<TrendingDown className="w-5 h-5 text-red-500" />}
        />
        <MetricCard
          title="Values Capped"
          value={results.winsorized.cappedCount}
          subtitle={`${((results.winsorized.cappedCount / results.winsorized.data.length) * 100).toFixed(1)}% of sample`}
          icon={<TrendingDown className="w-5 h-5 text-orange-500" />}
        />
        <MetricCard
          title="CI Width Reduction"
          value={`${results.comparison.ciReduction.toFixed(1)}%`}
          subtitle="Narrower confidence interval"
          icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistical Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                      <p className="text-sm font-medium mb-2">{payload[0].payload.metric}</p>
                      <p className="text-sm text-blue-600">Original: {payload[0].value?.toFixed(2)}</p>
                      <p className="text-sm text-green-600">Winsorized: {payload[1].value?.toFixed(2)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="original" fill="#3b82f6" name="Original" />
            <Bar dataKey="winsorized" fill="#10b981" name="Winsorized" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatBox
          title="Original Data"
          stats={[
            { label: 'Mean', value: results.original.mean.toFixed(2) },
            { label: 'Std Dev', value: results.original.std.toFixed(2) },
            { label: 'CV', value: `${((results.original.std / results.original.mean) * 100).toFixed(1)}%` },
            { label: '95% CI', value: `[${results.original.ci[0].toFixed(2)}, ${results.original.ci[1].toFixed(2)}]` },
            { label: 'CI Width', value: results.comparison.ciWidthOriginal.toFixed(2) }
          ]}
          color="blue"
        />
        <StatBox
          title="Winsorized Data"
          stats={[
            { label: 'Mean', value: results.winsorized.mean.toFixed(2) },
            { label: 'Std Dev', value: results.winsorized.std.toFixed(2) },
            { label: 'CV', value: `${((results.winsorized.std / results.winsorized.mean) * 100).toFixed(1)}%` },
            { label: '95% CI', value: `[${results.winsorized.ci[0].toFixed(2)}, ${results.winsorized.ci[1].toFixed(2)}]` },
            { label: 'CI Width', value: results.comparison.ciWidthWinsorized.toFixed(2) }
          ]}
          color="green"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Key Insights</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Standard deviation reduced by {results.comparison.stdReduction.toFixed(1)}%</li>
          <li>• Confidence interval narrowed by {results.comparison.ciReduction.toFixed(1)}%</li>
          <li>• More precise estimates with controlled outlier influence</li>
          <li>• {results.winsorized.cappedCount} extreme values were capped to threshold limits</li>
        </ul>
      </div>
    </div>
  );
}

function ABTestResultsDisplay({ results }: { results: ABTestResults }) {
  const comparisonData = [
    {
      test: 'Original',
      lift: results.original.lift,
      pValue: results.original.pValue,
      ciWidth: results.original.ciUpper - results.original.ciLower
    },
    {
      test: 'Winsorized',
      lift: results.winsorized.lift,
      pValue: results.winsorized.pValue,
      ciWidth: results.winsorized.ciUpper - results.winsorized.ciLower
    }
  ];

  const ciReduction = ((comparisonData[0].ciWidth - comparisonData[1].ciWidth) / comparisonData[0].ciWidth) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Original A/B Test</h3>
            {results.original.significant ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Control Mean</p>
              <p className="text-2xl font-bold text-gray-900">{results.original.controlMean.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Treatment Mean</p>
              <p className="text-2xl font-bold text-gray-900">{results.original.treatmentMean.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Observed Lift</p>
              <p className="text-2xl font-bold text-blue-600">{results.original.lift.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">P-Value</p>
              <p className={`text-xl font-bold ${results.original.significant ? 'text-green-600' : 'text-red-600'}`}>
                {results.original.pValue.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">95% CI of Difference</p>
              <p className="text-sm font-medium text-gray-900">
                [{results.original.ciLower.toFixed(2)}, {results.original.ciUpper.toFixed(2)}]
              </p>
            </div>
            <div className={`mt-4 px-3 py-2 rounded ${results.original.significant ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="text-sm font-medium">
                {results.original.significant ? 'Statistically Significant' : 'Not Significant'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Winsorized A/B Test</h3>
            {results.winsorized.significant ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Control Mean</p>
              <p className="text-2xl font-bold text-gray-900">{results.winsorized.controlMean.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Treatment Mean</p>
              <p className="text-2xl font-bold text-gray-900">{results.winsorized.treatmentMean.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Observed Lift</p>
              <p className="text-2xl font-bold text-green-600">{results.winsorized.lift.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">P-Value</p>
              <p className={`text-xl font-bold ${results.winsorized.significant ? 'text-green-600' : 'text-red-600'}`}>
                {results.winsorized.pValue.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">95% CI of Difference</p>
              <p className="text-sm font-medium text-gray-900">
                [{results.winsorized.ciLower.toFixed(2)}, {results.winsorized.ciUpper.toFixed(2)}]
              </p>
            </div>
            <div className={`mt-4 px-3 py-2 rounded ${results.winsorized.significant ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="text-sm font-medium">
                {results.winsorized.significant ? 'Statistically Significant' : 'Not Significant'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">P-Value & CI Width Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="test" />
            <YAxis yAxisId="left" orientation="left" label={{ value: 'P-Value', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'CI Width', angle: 90, position: 'insideRight' }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                      <p className="text-sm font-medium mb-2">{payload[0].payload.test}</p>
                      <p className="text-sm text-blue-600">P-Value: {Number(payload[0].value).toFixed(4)}</p>
                      <p className="text-sm text-amber-600">CI Width: {Number(payload[1].value).toFixed(2)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="pValue" fill="#3b82f6" name="P-Value (left axis)" />
            <Bar yAxisId="right" dataKey="ciWidth" fill="#f59e0b" name="CI Width (right axis)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Key Insights</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Confidence interval width reduced by {ciReduction.toFixed(1)}%</li>
          <li>• {results.original.significant === results.winsorized.significant
            ? 'Statistical significance conclusion remained consistent'
            : 'Statistical significance conclusion changed after winsorizing'}</li>
          <li>• Winsorizing controlled outlier influence on treatment effect estimates</li>
          <li>• More stable and robust effect size measurement</li>
        </ul>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon }: { title: string, value: string | number, subtitle: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

function StatBox({ title, stats, color }: { title: string, stats: { label: string, value: string }[], color: string }) {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50'
  };

  return (
    <div className={`rounded-lg shadow-sm border p-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <h4 className="text-sm font-semibold text-gray-900 mb-3">{title}</h4>
      <div className="space-y-2">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{stat.label}:</span>
            <span className="text-sm font-medium text-gray-900">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
