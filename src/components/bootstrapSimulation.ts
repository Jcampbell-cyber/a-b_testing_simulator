export type BootstrapResults = {
  sample: number[];
  bootstrapStats: number[];
  analyticCI: [number, number];
  bootstrapCI: [number, number];
  pointEstimate: number;
};

type Params = {
  distribution: 'normal' | 'skewed' | 'bimodal';
  sampleSize: number;
  numResamples: number;
  metric: 'mean' | 'median';
};

// --- helpers ---

function randn() {
  return Math.sqrt(-2 * Math.log(Math.random())) *
         Math.cos(2 * Math.PI * Math.random());
}

function generateSample(dist: Params['distribution'], n: number): number[] {
  if (dist === 'normal') {
    return Array.from({ length: n }, () => randn() * 1 + 0);
  }

  if (dist === 'skewed') {
    return Array.from({ length: n }, () => Math.exp(randn()));
  }

  // bimodal
  return Array.from({ length: n }, () =>
    Math.random() < 0.5 ? randn() - 2 : randn() + 2
  );
}

function computeStat(data: number[], metric: Params['metric']) {
  if (metric === 'mean') {
    return data.reduce((a, b) => a + b, 0) / data.length;
  }

  const sorted = [...data].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function bootstrapSample(data: number[]) {
  return Array.from({ length: data.length }, () =>
    data[Math.floor(Math.random() * data.length)]
  );
}

function percentile(arr: number[], p: number) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.floor(p * sorted.length);
  return sorted[idx];
}

// --- main ---

export function runBootstrapSimulation(params: Params): BootstrapResults {
  const { distribution, sampleSize, numResamples, metric } = params;

  const sample = generateSample(distribution, sampleSize);
  const pointEstimate = computeStat(sample, metric);

  const bootstrapStats: number[] = [];

  for (let i = 0; i < numResamples; i++) {
    const resample = bootstrapSample(sample);
    bootstrapStats.push(computeStat(resample, metric));
  }

  // bootstrap CI
  const lower = percentile(bootstrapStats, 0.025);
  const upper = percentile(bootstrapStats, 0.975);

  // analytic CI (mean only really valid)
  let analyticCI: [number, number] = [NaN, NaN];

  if (metric === 'mean') {
    const mean = pointEstimate;
    const variance =
      sample.reduce((sum, x) => sum + (x - mean) ** 2, 0) /
      (sample.length - 1);

    const se = Math.sqrt(variance / sample.length);
    const margin = 1.96 * se;

    analyticCI = [mean - margin, mean + margin];
  }

  return {
    sample,
    bootstrapStats,
    analyticCI,
    bootstrapCI: [lower, upper],
    pointEstimate,
  };
}
