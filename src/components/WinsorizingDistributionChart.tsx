import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

interface WinsorizingDistributionChartProps {
  originalData: number[];
  winsorizedData: number[];
  lowerPercentile: number;
  upperPercentile: number;
}

export function WinsorizingDistributionChart({
  originalData,
  winsorizedData,
  lowerPercentile,
  upperPercentile
}: WinsorizingDistributionChartProps) {
  const chartData = useMemo(() => {
    const sorted = [...originalData].sort((a, b) => a - b);
    const lowerThreshold = sorted[Math.floor(sorted.length * lowerPercentile / 100)];
    const upperThreshold = sorted[Math.ceil(sorted.length * upperPercentile / 100) - 1];

    return originalData.map((val, idx) => {
      const isOutlier = val < lowerThreshold || val > upperThreshold;
      return {
        index: idx,
        original: val,
        winsorized: winsorizedData[idx],
        isOutlier,
        lowerThreshold,
        upperThreshold
      };
    });
  }, [originalData, winsorizedData, lowerPercentile, upperPercentile]);

  const thresholds = useMemo(() => {
    const sorted = [...originalData].sort((a, b) => a - b);
    return {
      lower: sorted[Math.floor(sorted.length * lowerPercentile / 100)],
      upper: sorted[Math.ceil(sorted.length * upperPercentile / 100) - 1]
    };
  }, [originalData, lowerPercentile, upperPercentile]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution with Cutoff Lines</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              dataKey="index"
              name="Observation"
              label={{ value: 'Observation Index', position: 'insideBottom', offset: -10 }}
            />
            <YAxis
              type="number"
              dataKey="original"
              name="Value"
              label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                      <p className="text-sm font-medium">Observation {data.index + 1}</p>
                      <p className="text-sm text-gray-600">Original: {data.original.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Winsorized: {data.winsorized.toFixed(2)}</p>
                      {data.isOutlier && (
                        <p className="text-sm text-red-600 font-medium mt-1">Outlier</p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <ReferenceLine
              y={thresholds.lower}
              stroke="#ef4444"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `Lower: ${thresholds.lower.toFixed(0)}`,
                position: 'right',
                fill: '#ef4444'
              }}
            />
            <ReferenceLine
              y={thresholds.upper}
              stroke="#ef4444"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `Upper: ${thresholds.upper.toFixed(0)}`,
                position: 'right',
                fill: '#ef4444'
              }}
            />
            <Scatter name="Original Values" data={chartData} fill="#3b82f6">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isOutlier ? '#ef4444' : '#3b82f6'}
                  fillOpacity={entry.isOutlier ? 0.8 : 0.6}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-700">Normal Values</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-700">Outliers (Winsorized)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-red-500" style={{ borderTop: '2px dashed' }}></div>
            <span className="text-gray-700">Cutoff Lines</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Histogram Comparison</h3>
        <div className="grid grid-cols-2 gap-4">
          <HistogramChart data={originalData} title="Original Distribution" color="#3b82f6" />
          <HistogramChart data={winsorizedData} title="Winsorized Distribution" color="#10b981" />
        </div>
      </div>
    </div>
  );
}

function HistogramChart({ data, title, color }: { data: number[], title: string, color: string }) {
  const histogramData = useMemo(() => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binCount = 30;
    const binWidth = (max - min) / binCount;

    const bins = Array.from({ length: binCount }, (_, i) => ({
      start: min + i * binWidth,
      end: min + (i + 1) * binWidth,
      count: 0,
      midpoint: min + (i + 0.5) * binWidth
    }));

    data.forEach(val => {
      const binIndex = Math.min(Math.floor((val - min) / binWidth), binCount - 1);
      bins[binIndex].count++;
    });

    return bins;
  }, [data]);

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">{title}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            type="number"
            dataKey="midpoint"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(val) => val.toFixed(0)}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            type="number"
            dataKey="count"
            tick={{ fontSize: 11 }}
          />
          <Scatter data={histogramData} fill={color}>
            {histogramData.map((entry, index) => (
              <Cell key={`cell-${index}`} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
