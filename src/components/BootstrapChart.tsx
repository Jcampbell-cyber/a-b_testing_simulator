import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';

type Props = {
  bootstrapStats: number[];
  pointEstimate: number;
  bootstrapCI: [number, number];
  analyticCI: [number, number];
};

function hist(data: number[], bins = 25) {
  if (!data?.length) return [];

  const min = Math.min(...data);
  const max = Math.max(...data);

  if (min === max) {
    return [{ x: min, y: data.length }];
  }

  const width = (max - min) / bins;

  const arr = Array.from({ length: bins }, (_, i) => ({
    x: min + i * width,
    y: 0,
  }));

  data.forEach(v => {
    const idx = Math.min(
      Math.floor((v - min) / width),
      bins - 1
    );

    if (arr[idx]) arr[idx].y += 1;
  });

  return arr;
}

export function BootstrapChart({
  bootstrapStats,
  pointEstimate,
  bootstrapCI,
  analyticCI,
}: Props) {
  if (!bootstrapStats?.length) return null;

  const data = hist(bootstrapStats);

  return (
    <div className="bg-gray-800 p-6 rounded">
      <h2 className="text-xl mb-2">
        Bootstrap Distribution (Δ A - B)
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid stroke="#374151" />

          <XAxis dataKey="x" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />

          <Tooltip />

          <Line dataKey="y" stroke="#60a5fa" dot={false} />

          <ReferenceLine
            x={pointEstimate}
            stroke="#f59e0b"
          />

          <ReferenceLine
            x={bootstrapCI?.[0]}
            stroke="#34d399"
            strokeDasharray="3 3"
          />

          <ReferenceLine
            x={bootstrapCI?.[1]}
            stroke="#34d399"
            strokeDasharray="3 3"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="text-sm text-gray-400 mt-2">
        CI = 2.5th → 97.5th percentile
      </div>
    </div>
  );
}
