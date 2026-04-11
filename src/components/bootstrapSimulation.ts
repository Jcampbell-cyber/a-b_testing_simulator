export type MetricType = 'mean';

type User = {
  value: number;
};

type Group = User[];

function mean(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stdev(arr: number[]) {
  const m = mean(arr);
  return Math.sqrt(mean(arr.map(x => (x - m) ** 2)));
}

function percentile(arr: number[], p: number) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.floor(p * (sorted.length - 1));
  return sorted[idx];
}

// synthetic normal-ish data
function generateGroup(n: number, shift = 0): Group {
  return Array.from({ length: n }, () => ({
    value: Math.random() * 10 + shift + Math.random() * 2,
  }));
}

// bootstrap ONE difference
function bootstrapDiff(A: Group, B: Group): number {
  const resample = (g: Group) =>
    Array.from({ length: g.length }, () =>
      g[Math.floor(Math.random() * g.length)]
    );

  const Aboot = resample(A).map(x => x.value);
  const Bboot = resample(B).map(x => x.value);

  return mean(Aboot) - mean(Bboot);
}

export function runBootstrapAB(
  sampleSize: number,
  numResamples: number,
  uplift = 0.5
) {
  const A = generateGroup(sampleSize, 0);
  const B = generateGroup(sampleSize, uplift);

  const rawA = A.map(x => x.value);
  const rawB = B.map(x => x.value);

  const pointEstimate = mean(rawA) - mean(rawB);

  const bootstrapStats = Array.from(
    { length: numResamples },
    () => bootstrapDiff(A, B)
  );

  return {
    rawA,
    rawB,
    meanA: mean(rawA),
    meanB: mean(rawB),
    stdevA: stdev(rawA),
    stdevB: stdev(rawB),
    pointEstimate,
    bootstrapStats,
    ci: [
      percentile(bootstrapStats, 0.025),
      percentile(bootstrapStats, 0.975),
    ],
  };
}
