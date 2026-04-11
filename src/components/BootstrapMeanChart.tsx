import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
} from 'recharts';

type Props = {
  stats: number[];
  mean: number;
  ci: [number, number];
};

function hist(data: number[], bins = 20) {
  const min = Math.min(...data);
  const max = Math.max(...data);

  const width = (max - min) / bins;

  const arr = Array.from({ length: bins }, (_, i) => ({
    x: (min + i * width).toFixed(2),
    y: 0,
  }));

  data.forEach(v => {
    const idx = Math.min(
      Math.floor((v - min) / width),
      bins - 1
    );

    arr[idx].y += 1;
  });

  return arr;
}

export function BootstrapMeanChart({ stats, mean, ci }: Props) {
  if (!stats?.length) return null;

  const data = hist(stats);

  return (
    <div className="bg-gray-800 p-6 rounded">
      <h2 className="text-xl mb-3">
        Bootstrap Distribution of the Mean
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid stroke="#374151" />
          <XAxis dataKey="x" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />

          <Bar dataKey="y" fill="#60a5fa" />

          <ReferenceLine x={mean} stroke="#f59e0b" />
          <ReferenceLine x={ci[0]} stroke="#34d399" strokeDasharray="3 3" />
          <ReferenceLine x={ci[1]} stroke="#34d399" strokeDasharray="3 3" />
        </BarChart>
      </ResponsiveContainer>

      <div className="text-sm text-gray-400 mt-2">
        Orange = mean | Green = 95% CI
      </div>
    </div>
  );
}
