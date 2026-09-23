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

type Props =
  | { data: number[]; dataA?: never; dataB?: never }
  | { data?: never; dataA: number[]; dataB: number[] };

const BINS = 15;

function extent(values: number[]) {
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return { min, max };
}

function histogram(values: number[], min: number, width: number) {
  const counts = new Array<number>(BINS).fill(0);
  for (const v of values) {
    const idx = width > 0 ? Math.min(Math.floor((v - min) / width), BINS - 1) : 0;
    counts[idx] += 1;
  }
  return counts;
}

export function BootstrapRawDistributionChart(props: Props) {
  const series = props.data ? [props.data] : [props.dataA, props.dataB];
  const all = series.flat();
  if (!all.length) return null;

  const { min, max } = extent(all);
  const width = (max - min) / BINS;
  const counts = series.map(s => histogram(s, min, width));

  const hist = Array.from({ length: BINS }, (_, i) => ({
    x: (min + i * width).toFixed(1),
    a: counts[0][i],
    b: counts[1]?.[i],
  }));

  const isAB = series.length === 2;

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl mb-6">
      <h2 className="text-xl mb-3">{isAB ? 'Raw Data Distribution: A vs B' : 'Raw Data Distribution'}</h2>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={hist}>
          <CartesianGrid stroke="#374151" />
          <XAxis dataKey="x" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />
          {isAB && <Legend />}
          <Bar dataKey="a" name={isAB ? 'A' : 'Count'} fill={isAB ? '#60A5FA' : '#34d399'} />
          {isAB && <Bar dataKey="b" name="B" fill="#34d399" />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
