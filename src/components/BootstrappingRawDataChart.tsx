import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

type Props = {
  dataA: number[];
  dataB: number[];
};

function histogram(data: number[], bins = 20) {
  const min = Math.min(...data);
  const max = Math.max(...data);

  const width = (max - min) / bins;

  const hist = Array.from({ length: bins }, (_, i) => ({
    x: min + i * width,
    a: 0,
    b: 0,
  }));

  return hist;
}

function fill(hist: any[], data: number[], key: 'a' | 'b') {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const width = (max - min) / 20;

  data.forEach(v => {
    const idx = Math.min(
      Math.floor((v - min) / width),
      hist.length - 1
    );

    hist[idx][key] += 1;
  });

  return hist;
}

export function BootstrappingRawDataChart({ dataA, dataB }: Props) {
  if (!dataA?.length || !dataB?.length) return null;

  let base = histogram(dataA);

  base = fill(base, dataA, 'a');
  base = fill(base, dataB, 'b');

  return (
    <div className="bg-gray-800 p-6 rounded mb-6">
      <h2 className="text-xl mb-3">Raw Data (A vs B)</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={base}>
          <CartesianGrid stroke="#374151" />
          <XAxis dataKey="x" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />
          <Legend />

          <Bar dataKey="a" fill="#60a5fa" />
          <Bar dataKey="b" fill="#34d399" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
