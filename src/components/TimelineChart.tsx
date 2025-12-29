import { type TimelineData } from '../utils/simulation';

interface TimelineChartProps {
  timelines: TimelineData[];
  testDuration: number;
}

export function TimelineChart({ timelines, testDuration }: TimelineChartProps) {
  if (timelines.length === 0) return null;

  const allPeeks = timelines.flatMap(t => t.peeks);
  const allValues = allPeeks.flatMap(p => [p.percentChange, p.lowerCI, p.upperCI]);
  const yMin = Math.min(...allValues);
  const yMax = Math.max(...allValues);
  const yRange = yMax - yMin;

  const chartHeight = 600;
  const chartWidth = 1200;
  const chartPadding = { top: 40, right: 120, bottom: 80, left: 100 };

  const yScale = (value: number) =>
    chartPadding.top + ((yMax - value) / yRange) * (chartHeight - chartPadding.top - chartPadding.bottom);

  const niceStep = (range: number) => {
    const roughStep = range / 5;
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const normalized = roughStep / magnitude;
    if (normalized < 1.5) return magnitude;
    if (normalized < 3) return 2 * magnitude;
    if (normalized < 7) return 5 * magnitude;
    return 10 * magnitude;
  };

  const step = niceStep(yRange);
  const gridMin = Math.floor(yMin / step) * step;
  const gridMax = Math.ceil(yMax / step) * step;
  const gridLines: number[] = [];
  for (let val = gridMin; val <= gridMax; val += step) gridLines.push(val);

  const peekDays = timelines[0]?.peeks.map(p => p.day) || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Timelines</h2>
      <p className="text-xl text-gray-600 mb-4">
        Showing all {timelines.length} simulated test runs. Gray lines = trend, red/green dots = outside CI, black dashed lines = CI.
      </p>

      <div className="w-full overflow-x-auto">
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
          {/* Horizontal grid lines */}
          {gridLines.map(value => {
            const y = yScale(value);
            return (
              <g key={value}>
                <line
                  x1={chartPadding.left}
                  y1={y}
                  x2={chartWidth - chartPadding.right}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                  strokeDasharray="2,4"
                />
                <text
                  x={chartPadding.left - 10}
                  y={y}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  className="text-xl fill-gray-600"
                >
                  {value.toFixed(1)}%
                </text>
              </g>
            );
          })}

          {/* Vertical peek lines */}
          {peekDays.map(day => {
            const x = chartPadding.left + (day / testDuration) * (chartWidth - chartPadding.left - chartPadding.right);
            return (
              <line
                key={`peek-${day}`}
                x1={x}
                y1={chartPadding.top}
                x2={x}
                y2={chartHeight - chartPadding.bottom}
                stroke="#e5e7eb"
                strokeWidth={1}
                strokeDasharray="4,4"
                opacity={0.5}
              />
            );
          })}

          {/* Timeline lines and colored dots */}
          {timelines.map((timeline, tIndex) => (
            <g key={`timeline-${tIndex}`} opacity={0.6}>
              {/* gray line connecting peeks */}
              {timeline.peeks.map((peek, i) => {
                if (i === 0) return null;
                const prevPeek = timeline.peeks[i - 1];
                const x1 = chartPadding.left + (prevPeek.day / testDuration) * (chartWidth - chartPadding.left - chartPadding.right);
                const y1 = yScale(prevPeek.percentChange);
                const x2 = chartPadding.left + (peek.day / testDuration) * (chartWidth - chartPadding.left - chartPadding.right);
                const y2 = yScale(peek.percentChange);
                return <line key={`line-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d1d5db" strokeWidth={2.5} />;
              })}

              {/* dots colored based on CI */}
              {timeline.peeks.map((peek, i) => {
                const x = chartPadding.left + (peek.day / testDuration) * (chartWidth - chartPadding.left - chartPadding.right);
                const y = yScale(peek.percentChange);
                let color = '#d1d5db'; // gray
                if (peek.percentChange > peek.upperCI) color = '#22c55e'; // green
                else if (peek.percentChange < peek.lowerCI) color = '#ef4444'; // red
                return <circle key={`point-${i}`} cx={x} cy={y} r={5} fill={color} />;
              })}
            </g>
          ))}

          {/* Confidence interval lines */}
          {timelines[0]?.peeks.map((peek, i) => {
            if (i === 0) return null;
            const prevPeek = timelines[0].peeks[i - 1];
            const x1 = chartPadding.left + (prevPeek.day / testDuration) * (chartWidth - chartPadding.left - chartPadding.right);
            const x2 = chartPadding.left + (peek.day / testDuration) * (chartWidth - chartPadding.left - chartPadding.right);
            const y1Lower = yScale(prevPeek.lowerCI);
            const y1Upper = yScale(prevPeek.upperCI);
            const y2Lower = yScale(peek.lowerCI);
            const y2Upper = yScale(peek.upperCI);
            return (
              <g key={`ci-${i}`}>
                <line x1={x1} y1={y1Lower} x2={x2} y2={y2Lower} stroke="#000" strokeWidth={3} strokeDasharray="8,4" />
                <line x1={x1} y1={y1Upper} x2={x2} y2={y2Upper} stroke="#000" strokeWidth={3} strokeDasharray="8,4" />
              </g>
            );
          })}

          {/* Axes */}
          <line x1={chartPadding.left} y1={chartPadding.top} x2={chartPadding.left} y2={chartHeight - chartPadding.bottom} stroke="#4b5563" strokeWidth={2} />
          <line x1={chartPadding.left} y1={chartHeight - chartPadding.bottom} x2={chartWidth - chartPadding.right} y2={chartHeight - chartPadding.bottom} stroke="#4b5563" strokeWidth={2} />

          {/* X-axis ticks */}
          {[0, 25, 50, 75, 100].map(percent => {
            const day = Math.round((testDuration * percent) / 100);
            const x = chartPadding.left + (day / testDuration) * (chartWidth - chartPadding.left - chartPadding.right);
            return (
              <g key={percent}>
                <line x1={x} y1={chartHeight - chartPadding.bottom} x2={x} y2={chartHeight - chartPadding.bottom + 6} stroke="#4b5563" strokeWidth={2} />
                <text x={x} y={chartHeight - chartPadding.bottom + 25} textAnchor="middle" className="text-xl fill-gray-600">
                  Day {day}
                </text>
              </g>
            );
          })}

          {/* Axis labels */}
          <text x={chartWidth / 2} y={chartHeight - 50} textAnchor="middle" className="text-xl fill-gray-700 font-semibold">
            Test Duration (Days)
          </text>
          <text x={chartPadding.left / 2} y={chartHeight / 2} textAnchor="middle" transform={`rotate(-90, ${chartPadding.left / 2}, ${chartHeight / 2})`} className="text-xl fill-gray-700 font-semibold">
            Percent Change (%)
          </text>

          {/* CI labels */}
          {timelines[0] && (
            <>
              <text
                x={chartWidth - chartPadding.right + 10}
                y={yScale(timelines[0].peeks[timelines[0].peeks.length - 1].lowerCI)}
                className="text-xl fill-gray-900 font-semibold"
                alignmentBaseline="middle"
              >
                Lower CI
              </text>
              <text
                x={chartWidth - chartPadding.right + 10}
                y={yScale(timelines[0].peeks[timelines[0].peeks.length - 1].upperCI)}
                className="text-xl fill-gray-900 font-semibold"
                alignmentBaseline="middle"
              >
                Upper CI
              </text>
            </>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xl">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <span>Inside confidence intervals</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Outside lower CI (negative)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Outside upper CI (positive)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 border-t-2 border-black border-dashed"></div>
          <span>Confidence Interval</span>
        </div>
      </div>
    </div>
  );
}
