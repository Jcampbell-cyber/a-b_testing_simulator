export function calculateMDE(
  sampleSize: number,
  stdev: number,
  baselineMean: number,
  power: number = 0.8,
  alpha: number = 0.05
): number {
  const zAlpha = 1.96;
  const zBeta = 0.84;

  const pooledStd = Math.sqrt((2 * Math.pow(stdev, 2)) / sampleSize);

  const absoluteMDE = (zAlpha + zBeta) * pooledStd;

  const percentMDE = (absoluteMDE / baselineMean) * 100;

  return percentMDE;
}
