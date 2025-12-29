import React from 'react';
import type { FWERSimulationResults } from '../utils/fwerSimulation';

export function FWERBarChart({ results }: { results: FWERSimulationResults }) {
  const methods = Object.keys(results.metrics);

  const chartHeight = 400;
  const chartWidth = 1000;
  const chartPadding = { top: 60, right: 60, bottom: 80, left: 150 };

  const maxValue = Math.max(
    ...methods.map(m => Math.max(
      results.metrics[m].falsePositives,
      results.metrics[m].falseNegatives,
      results.metrics[m].power
    ))
  );

  const yMax = Math.ceil(maxValue / 10) * 10 + 10;

  const barWidth = (chartWidth - chartPadding.left - chartPadding.right) / methods.length - 40;
  const barSpacing = (chartWidth - chartPadding.left - chartPadding.right) / methods.length;

  const yScale = (value: number) => {
    return chartHeight - chartPadding.bottom - ((value / yMax) * (chartHeight - chartPadding.top - chartPadding.bottom));
  };

  const getBarX = (index: number, offset: number) => {
    return chartPadding.left + (index * barSpacing) + offset;
  };

  const barGroupWidth = barWidth / 3;

  return (
    <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6 mt-6">
      <h2 className="text-xl font-semibold text-white mb-4">Error Rates Comparison</h2>

      <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].filter(v => v <= yMax).map(value => {
          const y = yScale(value);
          return (
            <g key={value}>
              <line
                x1={chartPadding.left}
                y1={y}
                x2={chartWidth - chartPadding.right}
                y2={y}
                stroke="#374151"
                strokeWidth={1}
              />
              <text
                x={chartPadding.left - 10}
                y={y}
                textAnchor="end"
                alignmentBaseline="middle"
                className="text-base fill-gray-300"
              >
                {value}%
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {methods.map((method, index) => {
          const baseX = getBarX(index, 10);
          const fpHeight = (chartHeight - chartPadding.bottom) - yScale(results.metrics[method].falsePositives);
          const fnHeight = (chartHeight - chartPadding.bottom) - yScale(results.metrics[method].falseNegatives);
          const powerHeight = (chartHeight - chartPadding.bottom) - yScale(results.metrics[method].power);

          return (
            <g key={method}>
              {/* False Positives */}
              <rect
                x={baseX}
                y={yScale(results.metrics[method].falsePositives)}
                width={barGroupWidth}
                height={fpHeight}
                fill="#ef4444"
              />
              <text
                x={baseX + barGroupWidth / 2}
                y={yScale(results.metrics[method].falsePositives) - 5}
                textAnchor="middle"
                className="text-sm fill-red-400 font-semibold"
              >
                {results.metrics[method].falsePositives.toFixed(1)}
              </text>

              {/* False Negatives */}
              <rect
                x={baseX + barGroupWidth + 2}
                y={yScale(results.metrics[method].falseNegatives)}
                width={barGroupWidth}
                height={fnHeight}
                fill="#3b82f6"
              />
              <text
                x={baseX + barGroupWidth + 2 + barGroupWidth / 2}
                y={yScale(results.metrics[method].falseNegatives) - 5}
                textAnchor="middle"
                className="text-sm fill-blue-400 font-semibold"
              >
                {results.metrics[method].falseNegatives.toFixed(1)}
              </text>

              {/* Power */}
              <rect
                x={baseX + (barGroupWidth + 2) * 2}
                y={yScale(results.metrics[method].power)}
                width={barGroupWidth}
                height={powerHeight}
                fill="#22c55e"
              />
              <text
                x={baseX + (barGroupWidth + 2) * 2 + barGroupWidth / 2}
                y={yScale(results.metrics[method].power) - 5}
                textAnchor="middle"
                className="text-sm fill-green-400 font-semibold"
              >
                {results.metrics[method].power.toFixed(1)}
              </text>

              {/* Method label */}
              <text
                x={baseX + barWidth / 2}
                y={chartHeight - chartPadding.bottom + 20}
                textAnchor="middle"
                className="text-base fill-white font-semibold"
              >
                {method}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line
          x1={chartPadding.left}
          y1={chartPadding.top}
          x2={chartPadding.left}
          y2={chartHeight - chartPadding.bottom}
          stroke="#6b7280"
          strokeWidth={2}
        />
        <line
          x1={chartPadding.left}
          y1={chartHeight - chartPadding.bottom}
          x2={chartWidth - chartPadding.right}
          y2={chartHeight - chartPadding.bottom}
          stroke="#6b7280"
          strokeWidth={2}
        />

        {/* Axis labels */}
        <text
          x={chartWidth / 2}
          y={chartHeight - 20}
          textAnchor="middle"
          className="text-base fill-gray-300 font-semibold"
        >
          Multiple Testing Correction Method
        </text>

        <text
          x={chartPadding.left / 2}
          y={chartHeight / 2}
          textAnchor="middle"
          transform={`rotate(-90, ${chartPadding.left / 2}, ${chartHeight / 2})`}
          className="text-base fill-gray-300 font-semibold"
        >
          Rate (%)
        </text>

        {/* Legend */}
        <g transform={`translate(${chartWidth - chartPadding.right - 180}, ${chartPadding.top - 30})`}>
          <rect x="0" y="0" width="20" height="15" fill="#ef4444" />
          <text x="25" y="12" className="text-base fill-white">False Positives</text>

          <rect x="0" y="25" width="20" height="15" fill="#3b82f6" />
          <text x="25" y="37" className="text-base fill-white">False Negatives</text>

          <rect x="0" y="50" width="20" height="15" fill="#22c55e" />
          <text x="25" y="62" className="text-base fill-white">Power</text>
        </g>
      </svg>
    </div>
  );
}
