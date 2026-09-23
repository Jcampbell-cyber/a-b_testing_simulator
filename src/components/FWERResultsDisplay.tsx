import type { FWERSimulationResults } from '../utils/fwerSimulation';

type Props = {
  results: FWERSimulationResults;
  testType: 'aa' | 'ab';
  numFlights: number;
  comparisonType: 'pairwise' | 'control';
};

export function FWERResultsDisplay({ results, testType, numFlights, comparisonType }: Props) {
  const allMethods = Object.keys(results.metrics);
  const methods = allMethods.filter(m => !m.includes('+ ANOVA'));
  const anovaMethods = allMethods.filter(m => m.includes('+ ANOVA'));

  const numComparisons = comparisonType === 'pairwise'
    ? (numFlights * (numFlights - 1)) / 2
    : numFlights - 1;

  // For display: how many comparisons we expect to have true effects
  const expectedTrueEffects = testType === 'aa' ? 0 : (comparisonType === 'pairwise' ? numFlights - 1 : 1);
  const expectedNullComparisons = numComparisons - expectedTrueEffects;

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Simulation Results</h2>

        <div className="bg-gray-750 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-gray-300 mb-2">Test Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Test Type</p>
              <p className="text-white font-semibold">{testType === 'aa' ? 'A/A' : 'A/B'}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Comparisons</p>
              <p className="text-white font-semibold">{numComparisons}</p>
            </div>
            <div>
              <p className="text-gray-400">True Effects</p>
              <p className="text-green-400 font-semibold">{expectedTrueEffects}</p>
            </div>
            <div>
              <p className="text-gray-400">Null Comparisons</p>
              <p className="text-gray-400 font-semibold">{expectedNullComparisons}</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-600">
                <th className="p-3 text-left font-semibold text-gray-300">Metric</th>
                {methods.map((method) => (
                  <th key={method} className="p-3 text-center font-semibold text-white">{method}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700 hover:bg-gray-750">
                <td className="p-3 font-semibold text-red-400">FWER (%)</td>
                {methods.map((method) => {
                  const m = results.metrics[method];
                  return (
                    <td key={method} className="p-3 text-center text-red-400 font-semibold">
                      {m.falsePositives.toFixed(1)}%
                    </td>
                  );
                })}
              </tr>
              <tr className="border-b border-gray-700 hover:bg-gray-750">
                <td className="p-3 font-semibold text-green-400">Power (%)</td>
                {methods.map((method) => {
                  const m = results.metrics[method];
                  return (
                    <td key={method} className="p-3 text-center text-green-400 font-semibold">
                      {m.power.toFixed(1)}%
                    </td>
                  );
                })}
              </tr>
              <tr className="border-b border-gray-700 hover:bg-gray-750">
                <td className="p-3 font-semibold text-blue-400">True Positives (%)</td>
                {methods.map((method) => {
                  const m = results.metrics[method];
                  const totalComparisons = m.truePositives + (m.totalPositives - m.truePositives) + m.trueNegatives + m.falseNegatives;
                  const tpPercent = (m.truePositives / totalComparisons) * 100;
                  return (
                    <td key={method} className="p-3 text-center text-blue-400">
                      {tpPercent.toFixed(1)}%
                    </td>
                  );
                })}
              </tr>
              <tr className="border-b border-gray-700 hover:bg-gray-750">
                <td className="p-3 font-semibold text-red-300">False Positives (%)</td>
                {methods.map((method) => {
                  const m = results.metrics[method];
                  const totalComparisons = m.truePositives + (m.totalPositives - m.truePositives) + m.trueNegatives + m.falseNegatives;
                  const fpPercent = ((m.totalPositives - m.truePositives) / totalComparisons) * 100;
                  return (
                    <td key={method} className="p-3 text-center text-red-300">
                      {fpPercent.toFixed(1)}%
                    </td>
                  );
                })}
              </tr>
              <tr className="border-b border-gray-700 hover:bg-gray-750">
                <td className="p-3 font-semibold text-blue-300">True Negatives (%)</td>
                {methods.map((method) => {
                  const m = results.metrics[method];
                  const totalComparisons = m.truePositives + (m.totalPositives - m.truePositives) + m.trueNegatives + m.falseNegatives;
                  const tnPercent = (m.trueNegatives / totalComparisons) * 100;
                  return (
                    <td key={method} className="p-3 text-center text-blue-300">
                      {tnPercent.toFixed(1)}%
                    </td>
                  );
                })}
              </tr>
              <tr className="border-b border-gray-700 hover:bg-gray-750">
                <td className="p-3 font-semibold text-orange-400">False Negatives (%)</td>
                {methods.map((method) => {
                  const m = results.metrics[method];
                  const totalComparisons = m.truePositives + (m.totalPositives - m.truePositives) + m.trueNegatives + m.falseNegatives;
                  const fnPercent = (m.falseNegatives / totalComparisons) * 100;
                  return (
                    <td key={method} className="p-3 text-center text-orange-400">
                      {fnPercent.toFixed(1)}%
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {anovaMethods.length > 0 && (
          <>
            <h4 className="font-semibold text-green-300 mt-6 mb-3 text-lg">With ANOVA Prior Filter</h4>
            <p className="text-sm text-gray-400 mb-4">
              These methods first run an omnibus ANOVA test. Pairwise comparisons are only conducted if ANOVA is significant, reducing unnecessary testing.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-600">
                    <th className="p-3 text-left font-semibold text-gray-300">Metric</th>
                    {anovaMethods.map((method) => (
                      <th key={method} className="p-3 text-center font-semibold text-white">{method}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-3 font-semibold text-red-400">FWER (%)</td>
                    {anovaMethods.map((method) => {
                      const m = results.metrics[method];
                      return (
                        <td key={method} className="p-3 text-center text-red-400 font-semibold">
                          {m.falsePositives.toFixed(1)}%
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-3 font-semibold text-green-400">Power (%)</td>
                    {anovaMethods.map((method) => {
                      const m = results.metrics[method];
                      return (
                        <td key={method} className="p-3 text-center text-green-400 font-semibold">
                          {m.power.toFixed(1)}%
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-3 font-semibold text-blue-400">True Positives (%)</td>
                    {anovaMethods.map((method) => {
                      const m = results.metrics[method];
                      const totalComparisons = m.truePositives + (m.totalPositives - m.truePositives) + m.trueNegatives + m.falseNegatives;
                      const tpPercent = (m.truePositives / totalComparisons) * 100;
                      return (
                        <td key={method} className="p-3 text-center text-blue-400">
                          {tpPercent.toFixed(1)}%
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-3 font-semibold text-red-300">False Positives (%)</td>
                    {anovaMethods.map((method) => {
                      const m = results.metrics[method];
                      const totalComparisons = m.truePositives + (m.totalPositives - m.truePositives) + m.trueNegatives + m.falseNegatives;
                      const fpPercent = ((m.totalPositives - m.truePositives) / totalComparisons) * 100;
                      return (
                        <td key={method} className="p-3 text-center text-red-300">
                          {fpPercent.toFixed(1)}%
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-3 font-semibold text-blue-300">True Negatives (%)</td>
                    {anovaMethods.map((method) => {
                      const m = results.metrics[method];
                      const totalComparisons = m.truePositives + (m.totalPositives - m.truePositives) + m.trueNegatives + m.falseNegatives;
                      const tnPercent = (m.trueNegatives / totalComparisons) * 100;
                      return (
                        <td key={method} className="p-3 text-center text-blue-300">
                          {tnPercent.toFixed(1)}%
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-3 font-semibold text-orange-400">False Negatives (%)</td>
                    {anovaMethods.map((method) => {
                      const m = results.metrics[method];
                      const totalComparisons = m.truePositives + (m.totalPositives - m.truePositives) + m.trueNegatives + m.falseNegatives;
                      const fnPercent = (m.falseNegatives / totalComparisons) * 100;
                      return (
                        <td key={method} className="p-3 text-center text-orange-400">
                          {fnPercent.toFixed(1)}%
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="mt-4 space-y-3">
          <div className="bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded p-3">
            <p className="font-semibold text-yellow-300 mb-2 text-sm">Why FWER and FP % are different:</p>
            <p className="text-xs text-gray-300">
              <strong className="text-red-400">FWER</strong> (e.g., 5%) measures what % of <em>experiments</em> contain at least one false positive.
              <strong className="text-red-300"> FP</strong> (e.g., 1.3%) measures what % of <em>all comparisons</em> are false positives on average.
              Even if only 1.3% of comparisons are FP, when you make many comparisons per experiment, 5% of experiments will have at least one FP.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-400">
            <div className="bg-gray-750 rounded p-3">
              <p className="font-semibold text-gray-300 mb-1">Experiment-Level Metrics:</p>
              <ul className="space-y-1">
                <li><strong className="text-red-400">FWER:</strong> % of experiments with ≥1 false positive</li>
                <li><strong className="text-green-400">Power:</strong> % of experiments detecting ≥1 true effect</li>
              </ul>
            </div>
            <div className="bg-gray-750 rounded p-3">
              <p className="font-semibold text-gray-300 mb-1">Comparison-Level Metrics (% of all comparisons):</p>
              <ul className="space-y-1">
                <li><strong className="text-blue-400">TP:</strong> True Positives (correct detections)</li>
                <li><strong className="text-red-300">FP:</strong> False Positives (incorrect detections)</li>
                <li><strong className="text-blue-300">TN:</strong> True Negatives (correct non-detections)</li>
                <li><strong className="text-orange-400">FN:</strong> False Negatives (missed effects)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-5">
        <h4 className="font-semibold text-blue-300 mb-3 text-lg">Interpretation</h4>
        <ul className="text-sm text-blue-200 space-y-2 leading-relaxed">
          <li>• <strong>FWER Control:</strong> Methods like Bonferroni keep false positive rate near α, but reduce power</li>
          <li>• <strong>No Correction:</strong> High power but FWER can greatly exceed α with multiple tests</li>
          {testType === 'ab' && (
            <li>• <strong>Power vs Precision:</strong> Notice how FN increases as methods become more conservative</li>
          )}
          {testType === 'aa' && (
            <li>• <strong>A/A Test:</strong> All "positives" are false positives - observe how corrections reduce them</li>
          )}
          <li>• <strong>Holm Method:</strong> Should show better or equal power compared to Bonferroni with same FWER control</li>
          <li>• <strong className="text-green-300">ANOVA Prior Filter:</strong> Acts as a gatekeeper by first testing if any groups differ. If ANOVA is not significant, pairwise tests are skipped entirely, dramatically reducing false positives while maintaining good power when true effects exist.</li>
        </ul>
      </div>
    </div>
  );
}
