import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { NormalisationResults } from '../utils/normalisationSimulation';

interface Props {
  results: NormalisationResults;
  viewMode: 'raw' | 'normalised';
}

const REGION_COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
];

function createHistogramBins(data: { value: number; region: string }[], numBins: number = 30) {
  if (data.length === 0) return [];

  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binWidth = (max - min) / numBins;

  const bins: { binStart: number; binEnd: number; binMid: number; counts: Record<string, number>; total: number }[] = [];

  for (let i = 0; i < numBins; i++) {
    const binStart = min + i * binWidth;
    const binEnd = min + (i + 1) * binWidth;
    bins.push({
      binStart,
      binEnd,
      binMid: (binStart + binEnd) / 2,
      counts: {},
      total: 0
    });
  }

  for (const d of data) {
    const binIndex = Math.min(Math.floor((d.value - min) / binWidth), numBins - 1);
    if (binIndex >= 0 && binIndex < numBins) {
      if (!bins[binIndex].counts[d.region]) {
        bins[binIndex].counts[d.region] = 0;
      }
      bins[binIndex].counts[d.region]++;
      bins[binIndex].total++;
    }
  }

  return bins;
}

export function NormalisationHistogram({ results, viewMode }: Props) {
  const { groups } = results;

  const allData: { value: number; region: string }[] = [];
  const regionNames: string[] = [];

  groups.forEach((group) => {
    regionNames.push(group.name);
    const values = viewMode === 'raw'
      ? [...group.controlRaw, ...group.treatmentRaw]
      : [...group.controlNorm, ...group.treatmentNorm];

    values.forEach(value => {
      allData.push({ value, region: group.name });
    });
  });

  const bins = createHistogramBins(allData, 40);

  const chartData = bins.map(bin => {
    const entry: Record<string, number | string> = {
      binMid: bin.binMid,
      binLabel: viewMode === 'raw' ? bin.binMid.toFixed(0) : bin.binMid.toFixed(2)
    };
    regionNames.forEach(name => {
      entry[name] = bin.counts[name] || 0;
    });
    return entry;
  });

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          {viewMode === 'raw' ? 'Raw Data Distribution by Region' : 'Normalised Data Distribution'}
        </h3>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap={0} barGap={0}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="binMid"
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
              axisLine={{ stroke: '#4B5563' }}
              tickFormatter={(value) => viewMode === 'raw' ? value.toFixed(0) : value.toFixed(1)}
              interval={Math.floor(chartData.length / 8)}
            />
            <YAxis
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              axisLine={{ stroke: '#4B5563' }}
              label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: '#9CA3AF', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#F3F4F6' }}
              labelFormatter={(value) => `Value: ${viewMode === 'raw' ? Number(value).toFixed(1) : Number(value).toFixed(3)}`}
            />
            <Legend />
            {regionNames.map((name, index) => (
              <Bar
                key={name}
                dataKey={name}
                stackId="a"
                fill={REGION_COLORS[index % REGION_COLORS.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        {viewMode === 'raw'
          ? 'Raw values show distinct, non-overlapping distributions for each region due to different price levels'
          : 'After normalisation, all regions converge to the same scale (mean 0, std 1), dramatically reducing variance'}
      </p>
    </div>
  );
}
