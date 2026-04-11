import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';

type Props = {
  bootstrapStats: number[];
  analyticCI: [number, number];
  bootstrapCI: [number, number];
  pointEstimate: number;
};

function createHistogram(data: number[], bins = 25) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const width = (max - min) / bins;

  const hist = Array.from({ length: bins }, (_, i) => ({
    x: min + i * width,
    count: 0,
  }));

  data.forEach((v) => {
    const idx = Math.min(Math.floor((v - min) / width), bins - 1);
    hist[idx].count += 1;
  });

  return hist;
}

export function BootstrapChart({
  bootstrapStats,
  analyticCI,
  bootstrapCI,
  pointEstimate,
}: Props) {
  const data = createHistogram(bootstrapStats);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-2">
        Bootstrap Distribution
      </h2>

      <p className="text-sm text-gray-400 mb-4">
        Each bar shows how often a resampled statistic appears
      </p>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

          <XAxis
            dataKey="x"
            stroke="#9ca3af"
            tickFormatter={(v) => v.toFixed(2)}
          />

          <YAxis stroke="#9ca3af" />

          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #374151',
              color: '#fff',
            }}
          />

          <Bar dataKey="count" fill="#60a5fa" />

          {/* Point estimate */}
          <ReferenceLine
            x={pointEstimate}
            stroke="#f59e0b"
            strokeWidth={2}
          />

          {/* Bootstrap CI */}
          <ReferenceLine
            x={bootstrapCI[0]}
            stroke="#10b981"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            x={bootstrapCI[1]}
            stroke="#10b981"
            strokeDasharray="3 3"
          />

          {/* Analytic CI (optional comparison) */}
          <ReferenceLine
            x={analyticCI[0]}
            stroke="#ef4444"
            strokeDasharray="2 2"
          />
          <ReferenceLine
            x={analyticCI[1]}
            stroke="#ef4444"
            strokeDasharray="2 2"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
