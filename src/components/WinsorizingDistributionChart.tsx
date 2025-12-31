import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

interface WinsorizingDistributionChartProps {
  originalData: number[];
  winsorizedData: number[];
  upperPercentile: number;
}

export function WinsorizingDistributionChart({
  originalData,
  winsorizedData,
  upperPercentile
}: WinsorizingDistributionChartProps) {
  const chartData = useMemo(() => {
    const sorted = [...originalData].sort((a, b) => a - b);
    const upperThreshold = sorted[Math.ceil(sorted.length * upperPercentile / 100) - 1];

    return originalData.map((val, idx) => {
      const isOutlier = val > upperThreshold;
      return {
        index: idx,
        original: val,
        winsorized: winsorizedData[idx],
        isOutlier,
        upperThreshold
      };
    });
  }, [originalData, winsorizedData, upperPercentile]);

  const upperThreshold = useMemo(() => {
    const sorted = [...originalData].sort((a, b) => a - b);
    return sorted[Math.ceil(sorted.length * upperPercentile / 100) - 1];
  }, [originalData, upperPercentile]);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Distribution with Cutoff Line</h3>
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
              y={upperThreshold}
              stroke="#ef4444"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `${upperPercentile}th: ${upperThreshold.toFixed(0)}`,
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
            <span className="text-gray-300">Normal Values</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-300">Outliers (Capped)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-red-500" style={{ borderTop: '2px dashed' }}></div>
            <span className="text-gray-300">Cutoff Line</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Histogram Comparison</h3>
        <div className="grid grid-cols-2 gap-4">
          <HistogramChart
            data={originalData}
            title="Original Distribution"
            color="#3b82f6"
            domain={[Math.min(...originalData), Math.max(...originalData)]}
          />
          <HistogramChart
            data={winsorizedData}
            originalData={originalData}
            title="Winsorized Distribution"
            color="#3b82f6"
            domain={[Math.min(...originalData), Math.max(...originalData)]}
            thresholdValue={upperThreshold}
            showWinsorized={true}
          />
        </div>
      </div>
    </div>
  );
}

interface HistogramChartProps {
  data: number[];
  originalData?: number[];
  title: string;
  color: string;
  domain: [number, number];
  thresholdValue?: number;
  showWinsorized?: boolean;
}

function HistogramChart({ data, originalData, title, color, domain, thresholdValue, showWinsorized }: HistogramChartProps) {
  const dotData = useMemo(() => {
    const [min, max] = domain;
    const binCount = 40;
    const binWidth = (max - min) / binCount;

    const bins: { [key: number]: { normal: number; capped: number } } = {};

    data.forEach((val, idx) => {
      const binIndex = Math.min(Math.max(Math.floor((val - min) / binWidth), 0), binCount - 1);
      if (!bins[binIndex]) {
        bins[binIndex] = { normal: 0, capped: 0 };
      }

      if (showWinsorized && originalData && thresholdValue !== undefined) {
        const wasWinsorized = originalData[idx] > thresholdValue;
        if (wasWinsorized) {
          bins[binIndex].capped++;
        } else {
          bins[binIndex].normal++;
        }
      } else {
        bins[binIndex].normal++;
      }
    });

    const dots: { x: number; y: number; isCapped: boolean }[] = [];

    Object.entries(bins).forEach(([binIndexStr, counts]) => {
      const binIndex = parseInt(binIndexStr);
      const xPos = min + (binIndex + 0.5) * binWidth;

      for (let i = 0; i < counts.normal; i++) {
        dots.push({ x: xPos, y: i + 1, isCapped: false });
      }
      for (let i = 0; i < counts.capped; i++) {
        dots.push({ x: xPos, y: counts.normal + i + 1, isCapped: true });
      }
    });

    return dots;
  }, [data, originalData, domain, thresholdValue, showWinsorized]);

  const maxY = Math.max(...dotData.map(d => d.y), 1);

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-300 mb-2 text-center">{title}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            type="number"
            dataKey="x"
            domain={domain}
            tickFormatter={(val) => val.toFixed(0)}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            stroke="#4b5563"
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0, maxY + 2]}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            stroke="#4b5563"
          />
          <Scatter data={dotData} fill={color}>
            {dotData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isCapped ? '#ef4444' : color}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      {showWinsorized && (
        <div className="mt-2 flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-gray-400">Unchanged</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-gray-400">Winsorized</span>
          </div>
        </div>
      )}
    </div>
  );
}
