export function runBootstrapMean(sampleSize: number, resamples: number) {
  // 1. generate raw data (simple normal example)
  const raw = Array.from({ length: sampleSize }, () =>
    Math.random() * 2 + 1 // simple distribution around ~2
  );

  const bootstrapStats: number[] = [];

  for (let i = 0; i < resamples; i++) {
    const sample = Array.from({ length: sampleSize }, () =>
      raw[Math.floor(Math.random() * raw.length)]
    );

    const mean =
      sample.reduce((a, b) => a + b, 0) / sample.length;

    bootstrapStats.push(mean);
  }

  const pointEstimate =
    raw.reduce((a, b) => a + b, 0) / raw.length;

  const sorted = [...bootstrapStats].sort((a, b) => a - b);

  const ci: [number, number] = [
    sorted[Math.floor(0.025 * sorted.length)],
    sorted[Math.floor(0.975 * sorted.length)],
  ];

  return {
    raw,
    bootstrapStats,
    pointEstimate,
    ci,
  };
}
