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
  stats: number[];
  delta: number;
  ci: [number, number];
};

function histogram(data: number[], bins = 20) {
  if (!data?.length) return [];

  const min = Math.min(...data);
  const max = Math.max(...data);

  const width = (max - min) / bins;

  const hist = Array.from({ length: bins }, (_, i) => ({
    x: (min + i * width).toFixed(3),
    y: 0,
  }));

  data.forEach(v => {
    const idx = Math.min(
      Math.floor((v - min) / width),
      bins - 1
    );

    hist[idx].y += 1;
  });

  return hist;
}

export function BootstrapABChart({
  stats,
  delta,
  ci,
}: Props) {
  if (!stats?.length) return null;

  const data = histogram(stats);

  return (
    <div className="bg-gray-800 p-6 rounded">
      <h2 className="text-xl mb-3">
        Bootstrap Distribution of Lift (Δ)
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid stroke="#374151" />

          <XAxis dataKey="x" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />

          <Tooltip />

          <Bar dataKey="y" fill="#60a5fa" />

          {/* point estimate */}
          <ReferenceLine x={delta} stroke="#f59e0b" />

          {/* CI */}
          <ReferenceLine
            x={ci[0]}
            stroke="#34d399"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            x={ci[1]}
            stroke="#34d399"
            strokeDasharray="3 3"
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="text-sm text-gray-400 mt-2">
        Δ distribution from bootstrap resampling
      </div>
    </div>
  );
}
