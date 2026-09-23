import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Props = {
  comparisonType: 'pairwise' | 'control';
  baselineMean: number;
  stdev: number;
  sampleSize: number;
  alpha: number;
  trueUplift: number;
};

type ErrorRateData = {
  numGroups: number;
  numComparisons: number;
  None_Type1: number;
  None_Type2: number;
  Bonferroni_Type1: number;
  Bonferroni_Type2: number;
  BonferroniAnova_Type1: number;
  BonferroniAnova_Type2: number;
};

// Simplified simulation for error rate estimation
function estimateErrorRates(
  numGroups: number,
  comparisonType: 'pairwise' | 'control',
  baselineMean: number,
  stdev: number,
  sampleSize: number,
  alpha: number,
  trueUplift: number
): { type1None: number; type2None: number; type1Bonf: number; type2Bonf: number; type1BonfAnova: number; type2BonfAnova: number } {
  // Type 1 error (false positive rate)
  // For "None": probability of at least one false positive increases with comparisons
  const numComparisons = comparisonType === 'pairwise'
    ? (numGroups * (numGroups - 1)) / 2
    : numGroups - 1;

  // Type 1 error for no correction: 1 - (1 - α)^m
  const type1None = (1 - Math.pow(1 - alpha, numComparisons)) * 100;

  // Type 1 error for Bonferroni: approximately α (controlled)
  const bonferroniAlpha = alpha / numComparisons;
  const type1Bonf = (1 - Math.pow(1 - bonferroniAlpha, numComparisons)) * 100;

  // Type 1 error for Bonferroni + ANOVA: lower because ANOVA filters out many cases
  // Approximately α * power of ANOVA
  const type1BonfAnova = type1Bonf * 0.3; // rough approximation

  // Type 2 error (false negative rate) - depends on power
  // Power calculation for detecting effect
  const effectSize = (trueUplift / 100) * baselineMean;
  const se = stdev * Math.sqrt(2 / sampleSize);
  const ncp = effectSize / se; // non-centrality parameter

  // Approximate power
  const powerNone = Math.min(0.95, Math.max(0.05, 1 - 0.5 * Math.exp(-ncp / 2)));
  const powerBonf = Math.min(0.95, Math.max(0.05, 1 - 0.5 * Math.exp(-ncp / 2 * Math.sqrt(bonferroniAlpha / alpha))));
  const powerBonfAnova = Math.min(0.95, Math.max(0.05, powerBonf * 0.85)); // slightly lower due to ANOVA filter

  const type2None = (1 - powerNone) * 100;
  const type2Bonf = (1 - powerBonf) * 100;
  const type2BonfAnova = (1 - powerBonfAnova) * 100;

  return {
    type1None,
    type2None,
    type1Bonf,
    type2Bonf,
    type1BonfAnova,
    type2BonfAnova
  };
}

export function FWERErrorRateChart({ comparisonType, baselineMean, stdev, sampleSize, alpha, trueUplift }: Props) {
  const data: ErrorRateData[] = [];

  // Generate data for different numbers of groups (2 to 6 for up to 5 comparisons in control)
  for (let numGroups = 2; numGroups <= 6; numGroups++) {
    const numComparisons = comparisonType === 'pairwise'
      ? (numGroups * (numGroups - 1)) / 2
      : numGroups - 1;

    const rates = estimateErrorRates(numGroups, comparisonType, baselineMean, stdev, sampleSize, alpha, trueUplift);

    data.push({
      numGroups,
      numComparisons,
      None_Type1: rates.type1None,
      None_Type2: rates.type2None,
      Bonferroni_Type1: rates.type1Bonf,
      Bonferroni_Type2: rates.type2Bonf,
      BonferroniAnova_Type1: rates.type1BonfAnova,
      BonferroniAnova_Type2: rates.type2BonfAnova,
    });
  }

  return (
    <div className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Error Rates by Number of Comparisons</h3>
      <p className="text-sm text-gray-400 mb-4">
        This chart shows how Type I (false positive) and Type II (false negative) error rates change as the number of comparisons increases for different correction methods.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-md font-semibold text-red-300 mb-3 text-center">Type I Error Rate (False Positives)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="numComparisons"
                stroke="#9CA3AF"
                label={{ value: 'Number of Comparisons', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
              />
              <YAxis
                stroke="#9CA3AF"
                label={{ value: 'Type I Error %', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#F3F4F6' }}
                formatter={(value) => `${Number(value).toFixed(2)}%`}
                labelFormatter={(label) => {
                  const point = data.find(d => d.numComparisons === label);
                  return point ? `${label} comparisons (${point.numGroups} flights incl. control)` : label;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="None_Type1"
                stroke="#EF4444"
                strokeWidth={2}
                name="No Correction"
                dot={{ fill: '#EF4444' }}
              />
              <Line
                type="monotone"
                dataKey="Bonferroni_Type1"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Bonferroni"
                dot={{ fill: '#F59E0B' }}
              />
              <Line
                type="monotone"
                dataKey="BonferroniAnova_Type1"
                stroke="#10B981"
                strokeWidth={2}
                name="Bonferroni + ANOVA"
                dot={{ fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Without correction, Type I error increases dramatically with more comparisons. ANOVA prior provides additional protection.
          </p>
        </div>

        <div>
          <h4 className="text-md font-semibold text-blue-300 mb-3 text-center">Type II Error Rate (False Negatives)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="numComparisons"
                stroke="#9CA3AF"
                label={{ value: 'Number of Comparisons', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
              />
              <YAxis
                stroke="#9CA3AF"
                label={{ value: 'Type II Error %', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#F3F4F6' }}
                formatter={(value) => `${Number(value).toFixed(2)}%`}
                labelFormatter={(label) => {
                  const point = data.find(d => d.numComparisons === label);
                  return point ? `${label} comparisons (${point.numGroups} flights incl. control)` : label;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="None_Type2"
                stroke="#EF4444"
                strokeWidth={2}
                name="No Correction"
                dot={{ fill: '#EF4444' }}
              />
              <Line
                type="monotone"
                dataKey="Bonferroni_Type2"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Bonferroni"
                dot={{ fill: '#F59E0B' }}
              />
              <Line
                type="monotone"
                dataKey="BonferroniAnova_Type2"
                stroke="#10B981"
                strokeWidth={2}
                name="Bonferroni + ANOVA"
                dot={{ fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Bonferroni increases Type II error (reduces power) as comparisons grow. ANOVA prior has a small additional cost.
          </p>
        </div>
      </div>

      <div className="mt-4 bg-gray-750 rounded p-4">
        <h5 className="font-semibold text-gray-300 mb-2 text-sm">Key Insights:</h5>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• <strong className="text-red-300">Type I Error (Left):</strong> Risk of false positive. No correction escalates rapidly with comparisons.</li>
          <li>• <strong className="text-blue-300">Type II Error (Right):</strong> Risk of missing true effects. Increases with stricter corrections.</li>
          <li>• <strong className="text-green-300">ANOVA Prior:</strong> Reduces Type I error with minimal impact on Type II error.</li>
          <li>• <strong className="text-yellow-300">Trade-off:</strong> As you add more comparisons, you must choose between controlling false positives vs maintaining power.</li>
        </ul>
      </div>
    </div>
  );
}
