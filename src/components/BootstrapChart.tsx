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
};

function toCurve(data: number[]) {
  const sorted = [...data].sort((a, b) => a - b);
  return sorted.map((v, i) => ({
    x: v,
    y: i,
  }));
}

export function BootstrapChart({
  bootstrapStats,
  pointEstimate,
  bootstrapCI,
}: Props) {
  if (!bootstrapStats?.length) return null;

  const data = toCurve(bootstrapStats);

  return (
    <div className="bg-gray-800 p-6 rounded">
      <h2 className="text-xl mb-3">
        Bootstrap Distribution (Δ = A − B)
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid stroke="#374151" />

          <XAxis dataKey="x" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />

          <Tooltip />

          <Line dataKey="y" stroke="#60a5fa" dot={false} />

          {/* point estimate */}
          <ReferenceLine
            x={pointEstimate}
            stroke="#f59e0b"
          />

          {/* CI bounds */}
          <ReferenceLine
            x={bootstrapCI[0]}
            stroke="#34d399"
            strokeDasharray="4 4"
          />

          <ReferenceLine
            x={bootstrapCI[1]}
            stroke="#34d399"
            strokeDasharray="4 4"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="text-sm text-gray-400 mt-2">
        Green lines = 2.5th / 97.5th percentiles
      </div>
    </div>
  );
}
