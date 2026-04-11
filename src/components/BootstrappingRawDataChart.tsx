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
  dataA: number[];
  dataB: number[];
};

function hist(data: number[], bins = 20) {
  if (!data?.length) return [];

  const min = Math.min(...data);
  const max = Math.max(...data);

  if (min === max) {
    return [{ x: min, a: data.length, b: 0 }];
  }

  const width = (max - min) / bins;

  const arr = Array.from({ length: bins }, (_, i) => ({
    x: min + i * width,
    a: 0,
    b: 0,
  }));

  return arr;
}

export function BootstrappingRawDataChart({ dataA, dataB }: Props) {
  if (!dataA?.length || !dataB?.length) return null;

  const A = hist(dataA);
  const B = hist(dataB);

  return (
    <div className="bg-gray-800 p-6 rounded mb-6">
      <h2 className="text-xl mb-2">Raw Data (A vs B)</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={A}>
          <CartesianGrid stroke="#374151" />

          <XAxis
            dataKey="x"
            stroke="#9ca3af"
            tickFormatter={(v) =>
              Number.isFinite(v) ? v.toFixed(1) : ''
            }
          />

          <YAxis stroke="#9ca3af" />

          <Tooltip />

          <Bar dataKey="a" fill="#60a5fa" />
          <Bar dataKey="b" fill="#34d399" />
        </BarChart>
      </ResponsiveContainer>

      <div className="text-sm text-gray-400 mt-2">
        Blue = A, Green = B
      </div>
    </div>
  );
}
