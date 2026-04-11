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
  if (!data || data.length === 0) return [];

  const min = Math.min(...data);
  const max = Math.max(...data);

  // handle edge case: all values identical
  if (min === max) {
    return [
      {
        x: min,
        count: data.length,
      },
    ];
  }

  const width = (max - min) / bins;

  const hist = Array.from({ length: bins }, (_, i) => ({
    x: min + i * width,
    count: 0,
  }));

  data.forEach((v) => {
    if (!Number.isFinite(v)) return;

    const idx = Math.min(
      Math.floor((v - min) / width),
      bins - 1
    );

    if (hist[idx]) {
      hist[idx].count += 1;
    }
  });

  return hist;
}

export function BootstrapChart({
  bootstrapStats,
  analyticCI,
  bootstrapCI,
  pointEstimate,
}: Props) {
  // 🚨 guard: prevents full crash
  if (!bootstrapStats || bootstrapStats.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-white">
        No bootstrap data yet — click Run
      </div>
    );
  }

  const data = createHistogram(bootstrapStats);

  const safe = (v: number) =>
    Number.isFinite(v) ? v : null;

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
            tickFormatter={(v) =>
              Number.isFinite(v) ? v.toFixed(2) : ''
            }
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
          {safe(pointEstimate) !== null && (
            <ReferenceLine
              x={pointEstimate}
              stroke="#f59e0b"
              strokeWidth={2}
            />
          )}

          {/* Bootstrap CI */}
          {bootstrapCI && (
            <>
              <ReferenceLine
                x={safe(bootstrapCI[0])}
                stroke="#10b981"
                strokeDasharray="3 3"
              />
              <ReferenceLine
                x={safe(bootstrapCI[1])}
                stroke="#10b981"
                strokeDasharray="3 3"
              />
            </>
          )}

          {/* Analytic CI */}
          {analyticCI && (
            <>
              <ReferenceLine
                x={safe(analyticCI[0])}
                stroke="#ef4444"
                strokeDasharray="2 2"
              />
              <ReferenceLine
                x={safe(analyticCI[1])}
                stroke="#ef4444"
                strokeDasharray="2 2"
              />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
