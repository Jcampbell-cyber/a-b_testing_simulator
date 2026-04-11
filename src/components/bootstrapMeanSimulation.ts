export function runBootstrapMean(sampleSize: number, resamples: number) {
  // ----------------------------
  // Normal random generator
  // ----------------------------
  function normalRandom(mean = 100, std = 15) {
    let u = 0, v = 0;

    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();

    return (
      Math.sqrt(-2 * Math.log(u)) *
        Math.cos(2 * Math.PI * v) *
      std + mean
    );
  }

  // ----------------------------
  // 1. Raw data (normal dist)
  // ----------------------------
  const raw = Array.from({ length: sampleSize }, () =>
    normalRandom(100, 15)
  );

  const pointEstimate =
    raw.reduce((a, b) => a + b, 0) / raw.length;

  // ----------------------------
  // 2. Bootstrap resampling
  // ----------------------------
  const bootstrapStats: number[] = [];

  for (let i = 0; i < resamples; i++) {
    const sample = Array.from({ length: sampleSize }, () =>
      raw[Math.floor(Math.random() * raw.length)]
    );

    const mean =
      sample.reduce((a, b) => a + b, 0) / sample.length;

    bootstrapStats.push(mean);
  }

  // ----------------------------
  // 3. CI (percentiles)
  // ----------------------------
  const sorted = [...bootstrapStats].sort((a, b) => a - b);

  const ci: [number, number] = [
    sorted[Math.floor(0.025 * sorted.length)],
    sorted[Math.floor(0.975 * sorted.length)],
  ];

  // ----------------------------
  // 4. return everything
  // ----------------------------
  return {
    raw,
    pointEstimate,
    bootstrapStats,
    ci,
  };
}
