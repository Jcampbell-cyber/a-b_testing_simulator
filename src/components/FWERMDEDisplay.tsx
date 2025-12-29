import React from 'react';

type Props = {
  baselineMean: number;
  stdev: number;
  sampleSize: number;
  alpha: number;
  numComparisons: number;
  power?: number;
};

function getZScore(alpha: number): number {
  // Two-sided critical values
  if (alpha >= 0.10) return 1.645;
  if (alpha >= 0.05) return 1.96;
  if (alpha >= 0.01) return 2.576;
  if (alpha >= 0.001) return 3.291;
  return 3.891;
}

function calculateMDE(
  sampleSize: number,
  stdev: number,
  baselineMean: number,
  alpha: number,
  power: number = 0.8
): number {
  const zAlpha = getZScore(alpha);
  const zBeta = power === 0.8 ? 0.84 : power === 0.9 ? 1.28 : 0.84;

  const pooledStd = Math.sqrt((2 * Math.pow(stdev, 2)) / sampleSize);
  const absoluteMDE = (zAlpha + zBeta) * pooledStd;
  const percentMDE = (absoluteMDE / baselineMean) * 100;

  return percentMDE;
}

export function FWERMDEDisplay({ baselineMean, stdev, sampleSize, alpha, numComparisons, power = 0.8 }: Props) {
  const unadjustedMDE = calculateMDE(sampleSize, stdev, baselineMean, alpha, power);
  const bonferroniAlpha = alpha / numComparisons;
  const bonferroniMDE = calculateMDE(sampleSize, stdev, baselineMean, bonferroniAlpha, power);

  const unadjustedZ = getZScore(alpha);
  const bonferroniZ = getZScore(bonferroniAlpha);

  const effectIncrease = ((bonferroniMDE / unadjustedMDE - 1) * 100);
  const sampleMultiplier = Math.pow(bonferroniMDE / unadjustedMDE, 2);

  return (
    <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Minimum Detectable Effect (MDE)</h2>

      <p className="text-gray-400 mb-4">
        The smallest effect size that can be reliably detected at {(power * 100).toFixed(0)}% power with α = {alpha}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-4">
          <h3 className="font-semibold text-blue-300 mb-2">Unadjusted Test</h3>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-400">Significance Level: α = {alpha}</p>
              <p className="text-3xl font-bold text-blue-400 mt-1">{unadjustedMDE.toFixed(2)}%</p>
            </div>
            <div className="pt-2 border-t border-blue-700">
              <p className="text-xs text-gray-400">Formula: MDE = (Z_α/2 + Z_β) × σ × √(2/n) / μ</p>
              <p className="text-xs text-gray-500 mt-1">
                Z_α/2 = {unadjustedZ.toFixed(3)}, Z_β = {power === 0.8 ? '0.84' : '1.28'}, n = {sampleSize}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-900 bg-opacity-20 border border-red-700 rounded-lg p-4">
          <h3 className="font-semibold text-red-300 mb-2">Bonferroni Adjusted</h3>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-400">Adjusted Level: α* = {alpha} / {numComparisons} = {bonferroniAlpha.toFixed(6)}</p>
              <p className="text-3xl font-bold text-red-400 mt-1">{bonferroniMDE.toFixed(2)}%</p>
            </div>
            <div className="pt-2 border-t border-red-700">
              <p className="text-xs text-gray-400">Same formula with adjusted α*</p>
              <p className="text-xs text-gray-500 mt-1">
                Z_α*/2 = {bonferroniZ.toFixed(3)} (requires {effectIncrease.toFixed(1)}% larger effect)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-amber-900 bg-opacity-20 border border-amber-700 rounded-lg p-4">
        <h4 className="font-semibold text-amber-300 mb-2">Impact on Sample Size</h4>
        <p className="text-sm text-gray-300">
          To detect the same effect size ({unadjustedMDE.toFixed(2)}%) with Bonferroni correction, you would need:
        </p>
        <p className="text-2xl font-bold text-amber-400 mt-2">
          {sampleMultiplier.toFixed(2)}x more samples
        </p>
        <p className="text-xs text-gray-400 mt-2">
          ({sampleSize} × {sampleMultiplier.toFixed(2)} = {Math.ceil(sampleSize * sampleMultiplier)} samples per group)
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Sample size scales with (MDE ratio)² = ({(bonferroniMDE / unadjustedMDE).toFixed(3)})² = {sampleMultiplier.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
