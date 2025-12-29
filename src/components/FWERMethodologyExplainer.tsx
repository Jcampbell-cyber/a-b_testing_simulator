import React from 'react';

type Props = {
  alpha: number;
  numFlights: number;
  comparisonType: 'pairwise' | 'control';
};

export function FWERMethodologyExplainer({ alpha, numFlights, comparisonType }: Props) {
  const numComparisons = comparisonType === 'pairwise'
    ? (numFlights * (numFlights - 1)) / 2
    : numFlights - 1;

  const bonferroniAlpha = alpha / numComparisons;

  const methodDescriptions: Record<string, { description: string; formula: string; calculation: string; color: string }> = {
    'None': {
      description: 'No correction applied. Each test uses the raw significance level (α). This approach has the highest statistical power but also the highest chance of false positives when testing multiple hypotheses simultaneously.',
      formula: 'For each comparison: reject H₀ if p < α',
      calculation: `Uses the original α = ${alpha} for each comparison. With m = ${numComparisons} comparisons, the family-wise error rate can be as high as 1 - (1 - α)^m = ${(1 - Math.pow(1 - alpha, numComparisons)).toFixed(3)}, which greatly exceeds α when m is large.`,
      color: 'border-gray-600 bg-gray-750',
    },
    'Bonferroni': {
      description: 'A simple and conservative method that divides the significance level by the number of comparisons. It strongly controls the family-wise error rate but may increase false negatives (Type II errors).',
      formula: 'αₐdⱼ = α / m; reject H₀ if p < αₐdⱼ',
      calculation: `Adjusted α = α / m = ${alpha} / ${numComparisons} = ${bonferroniAlpha.toFixed(6)}. Each comparison uses this stricter threshold. By the Bonferroni inequality, P(at least one false positive) ≤ Σᵢ P(false positive on test i) ≤ m × (α/m) = α. This guarantees FWER ≤ α.`,
      color: 'border-blue-600 bg-blue-950',
    },
    'Holm': {
      description: 'A sequential step-down procedure that is uniformly more powerful than Bonferroni while providing the same FWER control. Tests are ordered by p-value, and α is adjusted sequentially.',
      formula: 'Order p-values: p₍₁₎ ≤ p₍₂₎ ≤ ... ≤ p₍ₘ₎\nReject H₍ᵢ₎ if p₍ᵢ₎ ≤ α/(m-i+1)',
      calculation: `Step-down method: Start with smallest p-value p₍₁₎. Test if p₍₁₎ ≤ α/${numComparisons}. If yes, test if p₍₂₎ ≤ α/${numComparisons - 1}, and so on. Stop at the first p-value that fails to reject. All subsequent hypotheses are not rejected. This method is "uniformly more powerful" than Bonferroni - it will reject at least as many hypotheses while maintaining FWER ≤ α.`,
      color: 'border-purple-600 bg-purple-950',
    },
    'Tukey': {
      description: 'Tukey HSD (Honestly Significant Difference) uses the studentized range distribution specifically designed for all pairwise comparisons. Optimal when you want to compare every group against every other group.',
      formula: 'q = (X̄ᵢ - X̄ⱼ) / SE; reject if |q| > qₐ,ₖ,ᵥ\nwhere SE = √(MSE/n) and qₐ,ₖ,ᵥ is the critical value',
      calculation: `Uses the studentized range statistic q with k = ${numFlights} groups and degrees of freedom ν = k(n-1). The critical value qₐ,ₖ,ᵥ is obtained from the Tukey distribution. This method explicitly accounts for the correlation structure among the ${numComparisons} pairwise comparisons (they all share groups), making it more powerful than Bonferroni which treats them as independent.`,
      color: 'border-green-600 bg-green-950',
    },
    'Dunnett': {
      description: 'A specialized test designed for comparing multiple treatment groups against a single control group. More powerful than Bonferroni for this specific comparison structure because it accounts for correlation.',
      formula: 'd = (X̄ᵢ - X̄control) / SE; reject if |d| > dₐ,ₖ₋₁,ᵥ\nwhere dₐ,ₖ₋₁,ᵥ is the critical value from Dunnett\'s distribution',
      calculation: `Uses multivariate t-distribution with k-1 = ${numFlights - 1} treatment groups compared to control, with degrees of freedom ν = k(n-1). The critical value is obtained from Dunnett's distribution which explicitly models the correlation between comparisons (all share the control group mean and variance estimate). This correlation structure allows substantially more power than treating the ${numFlights - 1} comparisons as independent via Bonferroni.`,
      color: 'border-amber-600 bg-amber-950',
    },
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Multiple Testing Correction Methods</h2>
      <p className="text-gray-400 mb-6">
        When testing {numComparisons} comparisons ({comparisonType === 'pairwise' ? 'all pairwise' : 'vs control'}),
        different correction methods balance false positive control against statistical power.
      </p>

      <div className="space-y-6">
        {Object.entries(methodDescriptions).map(([method, info]) => (
          <div key={method} className={`border-l-4 ${info.color} rounded-r-lg`}>
            <div className="p-5">
              <h3 className="font-bold text-white text-xl mb-2">{method}</h3>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-1">Description</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{info.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-1">Formula</h4>
                  <pre className="text-sm text-gray-200 leading-relaxed font-mono bg-gray-900 bg-opacity-50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                    {info.formula}
                  </pre>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-1">How It's Calculated</h4>
                  <p className="text-sm text-gray-400 leading-relaxed bg-gray-900 bg-opacity-50 p-3 rounded">
                    {info.calculation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-5 mt-6">
        <h4 className="font-semibold text-blue-300 mb-3 text-lg">Key Concepts</h4>
        <ul className="text-sm text-blue-200 space-y-2 leading-relaxed">
          <li>• <strong>Family-Wise Error Rate (FWER):</strong> Probability of making at least one false positive across all comparisons</li>
          <li>• <strong>Without correction:</strong> FWER = 1 - (1 - α)^m ≈ {((1 - Math.pow(1 - alpha, numComparisons)) * 100).toFixed(1)}% for your {numComparisons} comparisons</li>
          <li>• <strong>Power tradeoff:</strong> Correction methods reduce false positives but increase false negatives</li>
          <li>• <strong>Holm dominates Bonferroni:</strong> Same FWER control but uniformly more powerful (never worse, often better)</li>
          <li>• <strong>Specialized methods:</strong> Tukey (pairwise) and Dunnett (vs control) exploit correlation structure for better power than general methods</li>
        </ul>
      </div>
    </div>
  );
}
