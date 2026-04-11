export function runBootstrapAB(
  sampleSize: number,
  resamples: number,
  effectSize = 0
) {
  // -------------------------
  // 1. Generate raw data
  // -------------------------
  const rawA = Array.from({ length: sampleSize }, () =>
    Math.random() * 2 + 1 + effectSize
  );

  const rawB = Array.from({ length: sampleSize }, () =>
    Math.random() * 2 + 1
  );

  const meanA =
    rawA.reduce((a, b) => a + b, 0) / rawA.length;

  const meanB =
    rawB.reduce((a, b) => a + b, 0) / rawB.length;

  const pointEstimate = meanA - meanB;

  // -------------------------
  // 2. Bootstrap Δ distribution
  // -------------------------
  const bootstrapStats: number[] = [];

  for (let i = 0; i < resamples; i++) {
    const sampleA = Array.from(
      { length: sampleSize },
      () => rawA[Math.floor(Math.random() * rawA.length)]
    );

    const sampleB = Array.from(
      { length: sampleSize },
      () => rawB[Math.floor(Math.random() * rawB.length)]
    );

    const bootMeanA =
      sampleA.reduce((a, b) => a + b, 0) / sampleA.length;

    const bootMeanB =
      sampleB.reduce((a, b) => a + b, 0) / sampleB.length;

    bootstrapStats.push(bootMeanA - bootMeanB);
  }

  // -------------------------
  // 3. CI from percentiles
  // -------------------------
  const sorted = [...bootstrapStats].sort((a, b) => a - b);

  const ci: [number, number] = [
    sorted[Math.floor(0.025 * sorted.length)],
    sorted[Math.floor(0.975 * sorted.length)],
  ];

  return {
    rawA,
    rawB,
    meanA,
    meanB,
    pointEstimate,
    bootstrapStats,
    ci,
  };
}
