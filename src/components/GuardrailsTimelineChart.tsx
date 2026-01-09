import { useState } from 'react';
import { type GuardrailTimelineData } from '../utils/guardrailsSimulation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface GuardrailsTimelineChartProps {
  timelines: GuardrailTimelineData[];
  guardrailType: 'manual' | 'statistical';
  manualGuardrail: number;
}

export function GuardrailsTimelineChart({
  timelines,
  guardrailType,
  manualGuardrail,
}: GuardrailsTimelineChartProps) {
  const [hoveredRun, setHoveredRun] = useState<number | null>(null);

  const getRunCategory = (timeline: GuardrailTimelineData): 'crossedButPositive' | 'finishedPositive' | 'normal' => {
    const lastPeek = timeline.peeks[timeline.peeks.length - 1];
    const finishedPositive = lastPeek.lowerCI > 0;

    if (timeline.crossedGuardrail && finishedPositive) {
      return 'crossedButPositive';
    }
    if (finishedPositive) {
      return 'finishedPositive';
    }
    return 'normal';
  };

  const getLineColor = (category: 'crossedButPositive' | 'finishedPositive' | 'normal'): string => {
    switch (category) {
      case 'crossedButPositive':
        return '#f59e0b';
      case 'finishedPositive':
        return '#10b981';
      default:
        return '#9ca3af';
    }
  };

  const crossedButFinishedPositive = timelines.filter((t) => getRunCategory(t) === 'crossedButPositive').length;

  const maxDay = Math.max(...timelines.flatMap((t) => t.peeks.map((p) => p.day)));

  const computeStatisticalThreshold = (day: number): number => {
    const getInterpolatedHalfWidth = (timeline: GuardrailTimelineData): number | null => {
      const exactPeek = timeline.peeks.find((p) => p.day === day);
      if (exactPeek) {
        return (exactPeek.upperCI99 - exactPeek.lowerCI99) / 2;
      }

      const previousPeek = [...timeline.peeks].reverse().find((p) => p.day < day);
      const nextPeek = timeline.peeks.find((p) => p.day > day);

      if (previousPeek && nextPeek) {
        const prevHW = (previousPeek.upperCI99 - previousPeek.lowerCI99) / 2;
        const nextHW = (nextPeek.upperCI99 - nextPeek.lowerCI99) / 2;
        const t = (day - previousPeek.day) / (nextPeek.day - previousPeek.day);
        return prevHW + t * (nextHW - prevHW);
      }

      if (nextPeek) {
        return (nextPeek.upperCI99 - nextPeek.lowerCI99) / 2;
      }

      if (previousPeek) {
        return (previousPeek.upperCI99 - previousPeek.lowerCI99) / 2;
      }

      return null;
    };

    const halfWidths = timelines.map(getInterpolatedHalfWidth).filter((hw): hw is number => hw !== null);

    if (halfWidths.length === 0) return -5;

    const avgHalfWidth = halfWidths.reduce((sum, hw) => sum + hw, 0) / halfWidths.length;
    return -avgHalfWidth;
  };

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

    if (guardrailType === 'manual') {
      dataPoint.guardrail = manualGuardrail;
    } else {
      dataPoint.guardrail = computeStatisticalThreshold(day);
    }

    chartData.push(dataPoint);
  }

  // Render red dots only on actual peaks that crossed guardrail
  const renderDot = (idx: number) => (props: any) => {
    const { cx, cy, payload, value } = props;
    if (value === undefined) return null;

    // Use the crossedGuardrail flag from simulation (already computed correctly)
    const peekAtThisDay = timelines[idx].peeks.find((p) => p.day === payload.day);
    const crossed = peekAtThisDay?.crossedGuardrail || false;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={crossed ? 4 : 0}
        fill={crossed ? '#ef4444' : 'transparent'}
        stroke={crossed ? '#ef4444' : 'none'}
        onMouseEnter={() => setHoveredRun(idx)}
        onMouseLeave={() => setHoveredRun(null)}
      />
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6 relative">
      <h2 className="text-xl font-semibold text-white mb-4">Timeline Chart</h2>
      <p className="text-sm text-gray-400 mb-4">
        Tracking percent change over time. Points below guardrail are highlighted.
      </p>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="day"
            type="number"
            scale="linear"
            domain={[0, testDuration]}   // make sure `testDuration` is passed as prop
            ticks={Array.from({ length: testDuration + 1 }, (_, i) => i)}
            stroke="#9ca3af"
            label={{ value: 'Day', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
          />
          <YAxis
            stroke="#9ca3af"
            domain={['auto', 'auto']}
            label={{ value: '% Change', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
          />

          {/* Lines for each run */}
          {timelines.map((timeline, idx) => {
            const category = getRunCategory(timeline);
            const color = getLineColor(category);
            return (
              <Line
                key={`run${idx}`}
                type="monotone"
                dataKey={`run${idx}`}
                stroke={color}
                strokeWidth={category === 'normal' ? 1 : 2}
                dot={renderDot(idx)}
                isAnimationActive={false}
                connectNulls={true}
              />
            );
          })}

          {/* Main guardrail line */}
          <Line
            type="monotone"
            dataKey="guardrail"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />

          {/* Tooltip */}
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length || hoveredRun === null) return null;
              const run = payload.find((p) => p.dataKey === `run${hoveredRun}`);
              if (!run) return null;
              const guardrail = run.payload.guardrail;
              return (
                <div className="bg-gray-900 p-2 rounded-md border border-gray-700 text-white text-sm">
                  <div>Day: {label}</div>
                  <div>% Change: {run.value.toFixed(2)}%</div>
                  <div>Guardrail: {guardrail.toFixed(2)}%</div>
                </div>
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-gray-400"></div>
            <span className="text-gray-400">Normal runs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-emerald-500" style={{ height: '2px' }}></div>
            <span className="text-gray-400">Finished positive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-amber-500" style={{ height: '2px' }}></div>
            <span className="text-gray-400">Crossed guardrail but finished positive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-400">Guardrail crossing point</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-500" style={{ height: '3px' }}></div>
            <span className="text-gray-400">Guardrail threshold</span>
          </div>
        </div>
        {crossedButFinishedPositive > 0 && (
          <div className="text-sm text-amber-400 bg-amber-900/20 rounded-md px-3 py-2 border border-amber-700/30">
            {crossedButFinishedPositive} run{crossedButFinishedPositive !== 1 ? 's' : ''} crossed guardrail but finished positive
          </div>
        )}
      </div>
    </div>
  );
}
