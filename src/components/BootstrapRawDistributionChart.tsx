import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export function RawDistributionChart({ data }: { data: number[] }) {
  if (!data?.length) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const bins = 15;

  const width = (max - min) / bins;

  const hist = Array.from({ length: bins }, (_, i) => ({
    x: (min + i * width).toFixed(1),
    y: 0,
  }));

  data.forEach(v => {
    const idx = Math.min(
      Math.floor((v - min) / width),
      bins - 1
    );

    hist[idx].y += 1;
  });

  return (
    <div className="bg-gray-800 p-6 rounded mb-6">
      <h2 className="text-xl mb-3">Raw Data Distribution</h2>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={hist}>
          <CartesianGrid stroke="#374151" />
          <XAxis dataKey="x" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />
          <Bar dataKey="y" fill="#34d399" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
