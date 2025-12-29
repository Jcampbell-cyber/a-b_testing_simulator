import { useState } from 'react';
import { type TimelineData } from '../utils/peekingSimulation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

interface PeekingTimelineChartProps {
  timelines: TimelineData[];
  confidenceLevel: number;
  testDuration: number;
}

export function PeekingTimelineChart({ timelines, confidenceLevel, testDuration }: PeekingTimelineChartProps) {
  const [hoveredRun] = useState<number | null>(null);

  if (timelines.length === 0) return null;

  const alpha = (100 - confidenceLevel) / 100;

  const getLineColor = (timeline: TimelineData): string => {
    const lastPeek = timeline.peeks[timeline.peeks.length - 1];
    if (lastPeek.isSignificant) {
      return lastPeek.percentChange > 0 ? '#22c55e' : '#ef4444';
    }
    return '#9ca3af';
  };

  const maxDay = Math.max(...timelines.flatMap((t) => t.peeks.map((p) => p.day)));

  const chartData: any[] = [];

  for (let day = 0; day <= maxDay; day++) {
    const dataPoint: any = { day };

    timelines.forEach((timeline, idx) => {
      const previousPeek = [...timeline.peeks].reverse().find((p) => p.day <= day);
      const nextPeek = timeline.peeks.find((p) => p.day >= day);

      if (previousPeek && nextPeek && previousPeek.day !== nextPeek.day) {
        const t = (day - previousPeek.day) / (nextPeek.day - previousPeek.day);
        dataPoint[`run${idx}`] =
          previousPeek.percentChange + t * (nextPeek.percentChange - previousPeek.percentChange);
      } else if (previousPeek) {
        dataPoint[`run${idx}`] = previousPeek.percentChange;
      } else if (nextPeek) {
        dataPoint[`run${idx}`] = 0;
      } else {
        dataPoint[`run${idx}`] = 0;
      }
    });

    chartData.push(dataPoint);
  }

  const renderDot = (idx: number) => (props: any) => {
    const { cx, cy, payload, value } = props;
    if (value === undefined) return null;

    const peekAtThisDay = timelines[idx].peeks.find((p) => p.day === payload.day);
    const isSignificant = peekAtThisDay?.isSignificant || false;

    if (!isSignificant) return null;

    const color = peekAtThisDay!.percentChange > 0 ? '#22c55e' : '#ef4444';

    return (
      <circle
        cx={cx}
        cy={cy}
        r={2}
        fill={color}
        stroke={color}
      />
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Test Timelines</h2>
      <p className="text-sm text-gray-300 mb-4">
        Showing all {timelines.length} simulated test runs. Lines turn red/green when p-value &lt; {alpha.toFixed(2)} (statistically significant), gray when not significant.
      </p>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="day"
            stroke="#9ca3af"
            label={{ value: 'Day', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
          />
          <YAxis
            stroke="#9ca3af"
            domain={['auto', 'auto']}
            label={{ value: '% Change', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
          />

          {timelines.map((timeline, idx) => {
            const color = getLineColor(timeline);
            return (
              <Line
                key={`run${idx}`}
                type="monotone"
                dataKey={`run${idx}`}
                stroke={color}
                strokeWidth={1.5}
                dot={renderDot(idx)}
                isAnimationActive={false}
                connectNulls={true}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center gap-4 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-gray-400"></div>
          <span className="text-gray-400">Not significant (p &ge; {alpha.toFixed(2)})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-red-500" style={{ height: '1.5px' }}></div>
          <span className="text-gray-400">Significant negative</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-green-500" style={{ height: '1.5px' }}></div>
          <span className="text-gray-400">Significant positive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-400">Significant point</span>
        </div>
      </div>
    </div>
  );
}
