import { BootstrapResults } from '../utils/bootstrapSimulation';

export function BootstrapComparison({ results }: { results: BootstrapResults }) {
  const { analyticCI, bootstrapCI, pointEstimate } = results;

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h2 className="text-white font-semibold mb-4">
        Confidence Interval Comparison
      </h2>

      <div className="text-gray-300 space-y-3">
        <div>
          <strong>Point estimate:</strong> {pointEstimate.toFixed(3)}
        </div>

        <div>
          <strong>Analytical CI:</strong>{' '}
          {analyticCI[0].toFixed(3)} → {analyticCI[1].toFixed(3)}
        </div>

        <div>
          <strong>Bootstrap CI:</strong>{' '}
          {bootstrapCI[0].toFixed(3)} → {bootstrapCI[1].toFixed(3)}
        </div>

        <div className="text-sm text-gray-400 mt-3">
          Bootstrap adapts to the shape of your data. Differences appear when assumptions (like normality) break.
        </div>
      </div>
    </div>
  );
}
