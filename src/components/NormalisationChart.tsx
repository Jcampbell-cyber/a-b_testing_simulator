import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { NormalisationResults } from '../utils/normalisationSimulation';

interface Props {
  results: NormalisationResults;
  viewMode: 'raw' | 'normalised';
}

export function NormalisationChart({ results, viewMode }: Props) {
  const { groups } = results;

  const data = groups.map(group => ({
    name: group.name,
    control: viewMode === 'raw' ? group.rawControlMean : group.normControlMean,
    treatment: viewMode === 'raw' ? group.rawTreatmentMean : group.normTreatmentMean,
    lift: viewMode === 'raw' ? group.rawLift : group.normLift
  }));

  const allValues = data.flatMap(d => [d.control, d.treatment]);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const padding = (maxVal - minVal) * 0.1;

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          {viewMode === 'raw' ? 'Raw Values by Segment' : 'Normalised Values by Segment'}
        </h3>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              axisLine={{ stroke: '#4B5563' }}
            />
            <YAxis
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              axisLine={{ stroke: '#4B5563' }}
              domain={viewMode === 'normalised' ? ['auto', 'auto'] : [Math.floor(minVal - padding), Math.ceil(maxVal + padding)]}
              tickFormatter={(value) => viewMode === 'raw' ? value.toFixed(0) : value.toFixed(2)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#F3F4F6' }}
              formatter={(value: number) => [
                viewMode === 'raw' ? value.toFixed(2) : value.toFixed(4),
                ''
              ]}
            />
            <Legend />
            {viewMode === 'normalised' && (
              <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="3 3" />
            )}
            <Bar dataKey="control" name="Control" fill="#6B7280" radius={[4, 4, 0, 0]} />
            <Bar dataKey="treatment" name="Treatment" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        {viewMode === 'raw'
          ? 'Raw values show vastly different scales across segments, making direct comparison difficult'
          : 'Normalised values are centered around 0 with comparable scale across all segments'}
      </p>
    </div>
  );
}
