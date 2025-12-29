import { mean as d3Mean } from 'd3-array';

export type MethodMetrics = {
  falsePositives: number;
  falseNegatives: number;
  power: number;
  totalPositives: number;
  totalNegatives: number;
  truePositives: number;
  trueNegatives: number;
};

export type FWERSimulationResults = {
  metrics: Record<string, MethodMetrics>;
};

/**
 * Helper: draw N samples from N(mean, sd)
 */
function randomNormal(mean: number, sd: number, n: number) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    out.push(mean + sd * z);
  }
  return out;
}

/**
 * Welch's t-test p-value (two-sided)
 */
function tTestP(mean1: number, mean2: number, s1: number, s2: number, n1: number, n2: number): number {
  const diff = mean1 - mean2;
  const se = Math.sqrt(s1 ** 2 / n1 + s2 ** 2 / n2);
  const t = diff / se;
  const df =
    (s1 ** 2 / n1 + s2 ** 2 / n2) ** 2 /
    ((s1 ** 4) / (n1 ** 2 * (n1 - 1)) + (s2 ** 4) / (n2 ** 2 * (n2 - 1)));
  // two-sided p using Student t CDF approximation
  const cdf = 0.5 * (1 + Math.sign(t) * Math.sqrt(1 - Math.exp((-2 * (df + 1) * Math.log(1 + (t ** 2) / df)) / Math.PI)));
  return 2 * (1 - cdf);
}

/**
 * One-way ANOVA F-test p-value
 */
function anovaFTestP(groupMeans: number[], groupSDs: number[], n: number): number {
  const k = groupMeans.length;
  const grandMean = d3Mean(groupMeans)!;

  // Between-group sum of squares
  const ssBetween = groupMeans.reduce((sum, mean) => sum + n * Math.pow(mean - grandMean, 2), 0);
  const dfBetween = k - 1;

  // Within-group sum of squares
  const ssWithin = groupSDs.reduce((sum, sd) => sum + (n - 1) * Math.pow(sd, 2), 0);
  const dfWithin = k * (n - 1);

  // F-statistic
  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / dfWithin;
  const f = msBetween / msWithin;

  // Use chi-square approximation for F-distribution
  // F(df1, df2) ~ chi-square(df1) / df1 when scaled
  // For large df2, we can approximate the p-value
  const chiSq = f * dfBetween;

  // Chi-square CDF approximation using Wilson-Hilferty transformation
  const z = Math.pow(chiSq / dfBetween, 1/3) - (1 - 2 / (9 * dfBetween));
  const normalZ = z / Math.sqrt(2 / (9 * dfBetween));

  // Standard normal CDF approximation
  const pValue = 1 - 0.5 * (1 + Math.erf(normalZ / Math.sqrt(2)));

  return Math.max(0, Math.min(1, pValue));
}

/**
 * Error function approximation
 */
Math.erf = Math.erf || function(x: number): number {
  // Constants for approximation
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
};

/**
 * Apply multiple testing corrections
 */
function adjustPValues(pVals: number[], method: string, alpha: number, numGroups: number): number[] {
  const m = pVals.length;

  if (method === 'Bonferroni') {
    return pVals.map((p) => Math.min(p * m, 1));
  }

  if (method === 'Holm') {
    // step-down procedure
    const sorted = pVals.map((p, i) => ({ p, i })).sort((a, b) => a.p - b.p);
    const adjusted: number[] = Array(m).fill(0);
    for (let k = 0; k < m; k++) {
      const adj = Math.min((m - k) * sorted[k].p, 1);
      adjusted[sorted[k].i] = adj;
    }
    return adjusted;
  }

  if (method === 'Tukey') {
    // Tukey HSD approximation: more conservative than unadjusted, less than Bonferroni
    // Approximate correction factor based on studentized range distribution
    const qFactor = Math.sqrt(2) * Math.log(numGroups);
    return pVals.map((p) => Math.min(p * qFactor, 1));
  }

  if (method === 'Dunnett') {
    // Dunnett's test approximation: accounts for correlation with control
    // More powerful than Bonferroni for control comparisons
    const dFactor = Math.sqrt(numGroups - 1) * 0.85; // approximate correction
    return pVals.map((p) => Math.min(p * dFactor, 1));
  }

  // 'None': unadjusted
  return pVals;
}

/**
 * Main simulation
 */
export function runFWERSimulation(
  numFlights: number,
  comparisonType: 'pairwise' | 'control',
  baselineMean: number,
  stdev: number,
  sampleSize: number,
  alpha: number,
  trueUplift: number,
  numSimulations: number
): FWERSimulationResults {
  const baseMethods = ['None', 'Bonferroni', 'Holm', comparisonType === 'pairwise' ? 'Tukey' : 'Dunnett'];
  const methods = [
    ...baseMethods,
    ...baseMethods.map(m => `${m} + ANOVA`)
  ];

  const metrics: Record<string, MethodMetrics> = {};
  methods.forEach((m) => (metrics[m] = {
    falsePositives: 0,
    falseNegatives: 0,
    power: 0,
    totalPositives: 0,
    totalNegatives: 0,
    truePositives: 0,
    trueNegatives: 0,
  }));

  const controlIndex = 0;

  for (let sim = 0; sim < numSimulations; sim++) {
    // Only the first treatment (index 1) gets the uplift, all others stay at baseline
    const trueMeans = Array.from({ length: numFlights }, (_, i) =>
      i === 1 ? baselineMean * (1 + trueUplift / 100) : baselineMean
    );

    // Generate groups
    const samples = trueMeans.map((mu) => randomNormal(mu, stdev, sampleSize));
    const groupMeans = samples.map((s) => d3Mean(s)!);
    const groupSDs = samples.map((s) => Math.sqrt(d3Mean(s.map((x) => (x - d3Mean(s)!) ** 2))!));

    // Build comparison matrix
    const pairs: [number, number][] =
      comparisonType === 'pairwise'
        ? Array.from({ length: numFlights }, (_, i) =>
            Array.from({ length: numFlights }, (_, j) => (i < j ? [i, j] : null))
          )
            .flat()
            .filter((p): p is [number, number] => !!p)
        : Array.from({ length: numFlights - 1 }, (_, i) => [controlIndex, i + 1]);

    // Determine which comparisons have a true difference
    // Only comparisons involving flight 1 (the one with uplift) have a true effect
    const hasTrueEffect = pairs.map(([i, j]) =>
      trueUplift !== 0 && (i === 1 || j === 1)
    );

    // Compute raw p-values
    const pVals = pairs.map(([i, j]) =>
      tTestP(groupMeans[i], groupMeans[j], groupSDs[i], groupSDs[j], sampleSize, sampleSize)
    );

    // ANOVA omnibus test
    const anovaP = anovaFTestP(groupMeans, groupSDs, sampleSize);
    const anovaSig = anovaP < alpha;

    // For each correction method
    for (const m of methods) {
      const useAnovaPrior = m.includes('+ ANOVA');
      const baseMethod = useAnovaPrior ? m.replace(' + ANOVA', '') : m;

      // If using ANOVA prior and ANOVA is not significant, skip all pairwise tests
      let sigs: boolean[];
      if (useAnovaPrior && !anovaSig) {
        // ANOVA not significant, so we don't reject any null hypotheses
        sigs = pVals.map(() => false);
      } else {
        // Proceed with pairwise tests
        const adjP = adjustPValues(pVals, baseMethod, alpha, numFlights);
        sigs = adjP.map((p) => p < alpha);
      }

      // Count outcomes
      const falsePos = sigs.filter((s, k) => s && !hasTrueEffect[k]).length;
      const truePos = sigs.filter((s, k) => s && hasTrueEffect[k]).length;
      const falseNeg = sigs.filter((s, k) => !s && hasTrueEffect[k]).length;
      const trueNeg = sigs.filter((s, k) => !s && !hasTrueEffect[k]).length;

      // Accumulate metrics
      metrics[m].falsePositives += falsePos > 0 ? 1 : 0; // FWER: at least one FP
      metrics[m].falseNegatives += falseNeg;
      metrics[m].truePositives += truePos;
      metrics[m].trueNegatives += trueNeg;
      metrics[m].totalPositives += sigs.filter(s => s).length;
      metrics[m].totalNegatives += sigs.filter(s => !s).length;
      metrics[m].power += truePos > 0 ? 1 : 0; // Any true positive detected
    }
  }

  // Calculate percentages and averages
  for (const m of methods) {
    // FWER is the percentage of simulations with at least one false positive
    metrics[m].falsePositives = (metrics[m].falsePositives / numSimulations) * 100;

    // Power is the percentage of simulations where we detected at least one true effect
    metrics[m].power = (metrics[m].power / numSimulations) * 100;

    // False negatives: average count per simulation
    metrics[m].falseNegatives = metrics[m].falseNegatives / numSimulations;

    // True positives: average count per simulation
    metrics[m].truePositives = metrics[m].truePositives / numSimulations;

    // True negatives: average count per simulation
    metrics[m].trueNegatives = metrics[m].trueNegatives / numSimulations;

    // Total positives/negatives: average count per simulation
    metrics[m].totalPositives = metrics[m].totalPositives / numSimulations;
    metrics[m].totalNegatives = metrics[m].totalNegatives / numSimulations;
  }

  return { metrics };
}