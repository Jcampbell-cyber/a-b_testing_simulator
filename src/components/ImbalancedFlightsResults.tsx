import { type ImbalancedResults } from '../utils/imbalancedSimulation';

interface ImbalancedFlightsResultsProps {
  results: ImbalancedResults[] | null;
}

export function ImbalancedFlightsResults({ results }: ImbalancedFlightsResultsProps) {
  if (!results) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Results</h2>
        <p className="text-gray-500 text-center py-8">
          Run a simulation to see results
        </p>
      </div>
    );
  }

  const maxRate = Math.max(
    ...results.map(r => r.aaFalsePositiveRate),
    ...results.map(r => r.abFalseNegativeRate)
  );

  const yMax = Math.ceil(maxRate / 10) * 10 + 5;

  const chartHeight = 500;
  const chartPadding = { top: 60, right: 180, bottom: 60, left: 60 };
  const chartWidth = 1000;

  const yScale = (value: number) => {
    return chartPadding.top + ((yMax - value) / yMax) * (chartHeight - chartPadding.top - chartPadding.bottom);
  };

  const xScale = (controlPercent: number) => {
    return chartPadding.left + ((controlPercent - 10) / 80) * (chartWidth - chartPadding.left - chartPadding.right);
  };

  const yGridLines = [];
  for (let i = 0; i <= yMax; i += 5) {
    yGridLines.push(i);
  }

  const calculateExtraSampleSize = (controlPercent: number) => {
    const p = controlPercent / 100;
    const balancedSampleSize = 1;
    const imbalancedSampleSize = 1 / (4 * p * (1 - p));
    return ((imbalancedSampleSize - balancedSampleSize) / balancedSampleSize) * 100;
  };

  const sampleSizeIncreases = results.map(r => ({
    controlPercent: r.controlPercent,
    increase: calculateExtraSampleSize(r.controlPercent)
  }));

  const maxIncrease = Math.max(...sampleSizeIncreases.map(s => s.increase));
  const yMaxSample = Math.ceil(maxIncrease / 50) * 50 + 50;

  const ySampleScale = (value: number) => {
    return chartPadding.top + ((yMaxSample - value) / yMaxSample) * (chartHeight - chartPadding.top - chartPadding.bottom);
  };

  const ySampleGridLines = [];
  for (let i = 0; i <= yMaxSample; i += 50) {
    ySampleGridLines.push(i);
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Error Rates by Control/Challenger Split
      </h2>
      <p className="text-xl text-gray-600 mb-6">
        A/A tests show false positive rates (incorrectly detecting a difference when none exists).
        A/B tests with uplift equal to MDE show false negative rates (failing to detect the real difference).
      </p>

      <div className="w-full overflow-x-auto">
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
          {yGridLines.map(value => {
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

          {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(percent => {
            const x = xScale(percent);
            return (
              <g key={percent}>
                <line
                  x1={x}
                  y1={chartHeight - chartPadding.bottom}
                  x2={x}
                  y2={chartHeight - chartPadding.bottom + 6}
                  stroke="#4b5563"
                  strokeWidth={2}
                />
                <text
                  x={x}
                  y={chartHeight - chartPadding.bottom + 20}
                  textAnchor="middle"
                  className="text-base fill-gray-300"
                >
                  {percent}/{100 - percent}
                </text>
              </g>
            );
          })}

          <line
            x1={chartPadding.left}
            y1={chartHeight - chartPadding.bottom}
            x2={chartWidth - chartPadding.right}
            y2={chartHeight - chartPadding.bottom}
            stroke="#4b5563"
            strokeWidth={2}
          />
          <line
            x1={chartPadding.left}
            y1={chartPadding.top}
            x2={chartPadding.left}
            y2={chartHeight - chartPadding.bottom}
            stroke="#4b5563"
            strokeWidth={2}
          />

          {results.map((result, index) => {
            if (index === 0) return null;
            const prevResult = results[index - 1];

            const x1 = xScale(prevResult.controlPercent);
            const y1AA = yScale(prevResult.aaFalsePositiveRate);
            const y1AB = yScale(prevResult.abFalseNegativeRate);

            const x2 = xScale(result.controlPercent);
            const y2AA = yScale(result.aaFalsePositiveRate);
            const y2AB = yScale(result.abFalseNegativeRate);

            return (
              <g key={result.split}>
                <line
                  x1={x1}
                  y1={y1AA}
                  x2={x2}
                  y2={y2AA}
                  stroke="#ef4444"
                  strokeWidth={3}
                />
                <line
                  x1={x1}
                  y1={y1AB}
                  x2={x2}
                  y2={y2AB}
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </g>
            );
          })}

          {results.map((result) => {
            const x = xScale(result.controlPercent);
            const yAA = yScale(result.aaFalsePositiveRate);
            const yAB = yScale(result.abFalseNegativeRate);

            return (
              <g key={`point-${result.split}`}>
                <circle cx={x} cy={yAA} r={4} fill="#ef4444" />
                <circle cx={x} cy={yAB} r={4} fill="#3b82f6" />
                <text
                  x={x}
                  y={yAA - 10}
                  textAnchor="middle"
                  className="text-base fill-red-500 font-semibold"
                >
                  {result.aaFalsePositiveRate.toFixed(1)}%
                </text>
                <text
                  x={x}
                  y={yAB + 15}
                  textAnchor="middle"
                  className="text-base fill-blue-500 font-semibold"
                >
                  {result.abFalseNegativeRate.toFixed(1)}%
                </text>
              </g>
            );
          })}

          <text
            x={chartWidth / 2}
            y={chartHeight - 10}
            textAnchor="middle"
            className="text-base fill-gray-300 font-semibold"
          >
            Control/Challenger Split %
          </text>

          <text
            x={chartPadding.left / 2}
            y={chartHeight / 2}
            textAnchor="middle"
            transform={`rotate(-90, ${chartPadding.left / 2}, ${chartHeight / 2})`}
            className="text-base fill-gray-300 font-semibold"
          >
            Error Rate (%)
          </text>

          <g transform={`translate(${chartWidth - chartPadding.right + 10}, ${chartPadding.top})`}>
            <rect x="0" y="0" width="15" height="3" fill="#ef4444" />
            <text x="20" y="2" alignmentBaseline="middle" className="text-base fill-white">
              A/A False Positive
            </text>
            <rect x="0" y="20" width="15" height="3" fill="#3b82f6" />
            <text x="20" y="22" alignmentBaseline="middle" className="text-base fill-white">
              A/B False Negative
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Key Insights</h3>
        <ul className="text-xl text-blue-800 space-y-1">
          <li>A/A false positives show how often we incorrectly detect a difference when none exists</li>
          <li>A/B false negatives show how often we fail to detect the true effect (equal to MDE)</li>
          <li>Balanced splits (50/50) typically maintain optimal error rates</li>
          <li>Extreme imbalances increase false negative rates</li>
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Required Extra Sample Size vs 50/50 Split
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          Shows the percentage increase in total sample size required to maintain the same MDE for each imbalanced split compared to a balanced 50/50 split.
        </p>

        <div className="w-full overflow-x-auto">
          <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
            {ySampleGridLines.map(value => {
              const y = ySampleScale(value);
              return (
                <g key={value}>
                  <line
                    x1={chartPadding.left}
                    y1={y}
                    x2={chartWidth - chartPadding.right}
                    y2={y}
                    stroke="#e5e7eb"
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

            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(percent => {
              const x = xScale(percent);
              return (
                <g key={percent}>
                  <line
                    x1={x}
                    y1={chartHeight - chartPadding.bottom}
                    x2={x}
                    y2={chartHeight - chartPadding.bottom + 6}
                    stroke="#4b5563"
                    strokeWidth={2}
                  />
                  <text
                    x={x}
                    y={chartHeight - chartPadding.bottom + 20}
                    textAnchor="middle"
                    className="text-base fill-gray-300"
                  >
                    {percent}/{100 - percent}
                  </text>
                </g>
              );
            })}

            <line
              x1={chartPadding.left}
              y1={chartHeight - chartPadding.bottom}
              x2={chartWidth - chartPadding.right}
              y2={chartHeight - chartPadding.bottom}
              stroke="#4b5563"
              strokeWidth={2}
            />
            <line
              x1={chartPadding.left}
              y1={chartPadding.top}
              x2={chartPadding.left}
              y2={chartHeight - chartPadding.bottom}
              stroke="#4b5563"
              strokeWidth={2}
            />

            {sampleSizeIncreases.map((data, index) => {
              if (index === 0) return null;
              const prevData = sampleSizeIncreases[index - 1];

              const x1 = xScale(prevData.controlPercent);
              const y1 = ySampleScale(prevData.increase);

              const x2 = xScale(data.controlPercent);
              const y2 = ySampleScale(data.increase);

              return (
                <g key={data.controlPercent}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#8b5cf6"
                    strokeWidth={3}
                  />
                </g>
              );
            })}

            {sampleSizeIncreases.map((data) => {
              const x = xScale(data.controlPercent);
              const y = ySampleScale(data.increase);

              return (
                <g key={`sample-point-${data.controlPercent}`}>
                  <circle cx={x} cy={y} r={4} fill="#8b5cf6" />
                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    className="text-base fill-purple-500 font-semibold"
                  >
                    {data.increase.toFixed(0)}%
                  </text>
                </g>
              );
            })}

            <text
              x={chartWidth / 2}
              y={chartHeight - 10}
              textAnchor="middle"
              className="text-base fill-gray-300 font-semibold"
            >
              Control/Challenger Split %
            </text>

            <text
              x={chartPadding.left / 2}
              y={chartHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90, ${chartPadding.left / 2}, ${chartHeight / 2})`}
              className="text-base fill-gray-300 font-semibold"
            >
              Extra Sample Size Required (%)
            </text>
          </svg>
        </div>

        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2">Sample Size Impact</h3>
          <ul className="text-xl text-purple-800 space-y-1">
            <li>A balanced 50/50 split is the most efficient.</li>
            <li>Imbalanced splits require substantially more total samples to achieve the same MDE.</li>
            <li>The effect is symmetric: 10/90 and 90/10 splits require the same extra sample size.</li>
            <li>Extreme imbalances like 10/90 can require over double the sample size.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
