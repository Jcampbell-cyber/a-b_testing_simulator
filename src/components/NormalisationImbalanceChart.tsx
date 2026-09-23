import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip } from 'recharts';
import { GroupConfig } from '../utils/normalisationSimulation';

interface Props {
  groupConfigs: GroupConfig[];
}

export function NormalisationImbalanceChart({ groupConfigs }: Props) {
  const data = useMemo(() => {
    if (groupConfigs.length < 2) return [];

    const group1Mean = groupConfigs[0].baselineMean;
    const group2Mean = groupConfigs[1].baselineMean;

    const points = [];

    for (let imbalance = -20; imbalance <= 20; imbalance += 2) {
      const controlGroup1Pct = 50;
      const controlGroup2Pct = 50;
      const treatmentGroup1Pct = 50 + imbalance;
      const treatmentGroup2Pct = 50 - imbalance;

      const controlMean = (controlGroup1Pct / 100) * group1Mean + (controlGroup2Pct / 100) * group2Mean;
      const treatmentMean = (treatmentGroup1Pct / 100) * group1Mean + (treatmentGroup2Pct / 100) * group2Mean;

      const liftPercent = ((treatmentMean - controlMean) / controlMean) * 100;
      const liftAbsolute = treatmentMean - controlMean;

      points.push({
        imbalance,
        liftPercent,
        liftAbsolute,
        treatmentGroup1Pct,
        treatmentGroup2Pct,
        treatmentMean,
        controlMean
      });
    }

    return points;
  }, [groupConfigs]);

  if (groupConfigs.length < 2) return null;

  const group1Name = groupConfigs[0].name;
  const group2Name = groupConfigs[1].name;
  const group1Mean = groupConfigs[0].baselineMean;
  const group2Mean = groupConfigs[1].baselineMean;
  const higherValueRegion = group1Mean > group2Mean ? group1Name : group2Name;

  const maxLift = Math.max(...data.map(d => Math.abs(d.liftPercent)));
  const yDomain = [-Math.ceil(maxLift * 1.2), Math.ceil(maxLift * 1.2)];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
      <h3 className="text-lg font-semibold text-white mb-2">Regional Imbalance Impact</h3>
      <p className="text-xs text-gray-400 mb-4">
        Shows the spurious lift created when treatment has more users from one region vs control (with no true treatment effect)
      </p>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="imbalance"
              stroke="#9CA3AF"
              fontSize={11}
              tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}%`}
              label={{
                value: `Treatment allocation shift toward ${group1Name}`,
                position: 'insideBottom',
                offset: -5,
                fill: '#9CA3AF',
                fontSize: 10
              }}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={11}
              domain={yDomain}
              tickFormatter={(v) => `${v > 0 ? '+' : ''}${v.toFixed(0)}%`}
              label={{
                value: 'Spurious Lift',
                angle: -90,
                position: 'insideLeft',
                fill: '#9CA3AF',
                fontSize: 10
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(raw, name) => {
                const value = Number(raw);
                if (name === 'liftPercent') {
                  return [`${value >= 0 ? '+' : ''}${value.toFixed(2)}%`, 'Spurious Lift'];
                }
                return [value, name];
              }}
              labelFormatter={(label) => {
                const point = data.find(d => d.imbalance === label);
                if (!point) return '';
                return `Treatment: ${point.treatmentGroup1Pct}% ${group1Name}, ${point.treatmentGroup2Pct}% ${group2Name}`;
              }}
            />
            <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="5 5" />
            <ReferenceLine x={0} stroke="#6B7280" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="liftPercent"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#EF4444' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-red-900/20 rounded-lg p-3 border border-red-900/50">
          <div className="font-medium text-red-400 mb-1">Example: +10% shift</div>
          <p className="text-gray-400">
            If treatment randomly gets 10% more users from {higherValueRegion}, it appears to win by ~{Math.abs(data.find(d => d.imbalance === (group1Mean > group2Mean ? 10 : -10))?.liftPercent || 0).toFixed(1)}% even with zero true effect.
          </p>
        </div>
        <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-900/50">
          <div className="font-medium text-amber-400 mb-1">Why this matters</div>
          <p className="text-gray-400">
            With baseline means of ${group1Mean} vs ${group2Mean}, small allocation imbalances create large spurious effects that can mask or mimic real treatment impact.
          </p>
        </div>
      </div>
    </div>
  );
}
