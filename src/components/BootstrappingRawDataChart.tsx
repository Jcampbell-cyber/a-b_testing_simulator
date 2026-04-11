import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

type Props = {
  data: number[];
};

function createHistogram(data: number[], bins = 25) {
  if (!data || data.length === 0) return [];

  const min = Math.min(...data);
  const max = Math.max(...data);

  if (min === max) {
    return [{ x: min, count: data.length }];
  }

  const width = (max - min) / bins;

  const hist = Array.from({ length: bins }, (_, i) => ({
    x: min + i * width,
    count: 0,
  }));

  data.forEach((v) => {
    const idx = Math.min(
      Math.floor((v - min) / width),
      bins - 1
    );

    if (hist[idx]) hist[idx].count += 1;
  });

  return hist;
}

export function BootstrappingRawDataChart({ data }: Props) {
  const hist = createHistogram(data);

  const mean =
    data.length > 0
      ? data.reduce((a, b) => a + b, 0) / data.length
      : 0;

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-2">
        Raw Data Distribution
      </h2>

      <p className="text-sm text-gray-400 mb-4">
        This is the observed data before resampling
      </p>

      <div className="text-sm text-gray-300 mb-4">
        Mean: {mean.toFixed(4)} | n: {data.length}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={hist}>
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

          <Bar dataKey="count" fill="#9ca3af" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
