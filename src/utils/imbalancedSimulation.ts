function generateSample(mean: number, stdev: number, size: number): number[] {
  const sample: number[] = [];
  for (let i = 0; i < size; i++) {
    let u1 = Math.random();
    let u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    sample.push(mean + stdev * z0);
  }
  return sample;
}

function runTTest(control: number[], treatment: number[]): number {
  const n1 = control.length;
  const n2 = treatment.length;

  const mean1 = control.reduce((a, b) => a + b, 0) / n1;
  const mean2 = treatment.reduce((a, b) => a + b, 0) / n2;

  const variance1 = control.reduce((sum, x) => sum + Math.pow(x - mean1, 2), 0) / (n1 - 1);
  const variance2 = treatment.reduce((sum, x) => sum + Math.pow(x - mean2, 2), 0) / (n2 - 1);

  const pooledVariance = ((n1 - 1) * variance1 + (n2 - 1) * variance2) / (n1 + n2 - 2);
  const standardError = Math.sqrt(pooledVariance * (1 / n1 + 1 / n2));

  return (mean2 - mean1) / standardError;
}

export interface ImbalancedResults {
  split: string;
  controlPercent: number;
  controlSize: number;
  treatmentSize: number;
  aaFalsePositiveRate: number;
  abFalseNegativeRate: number;
}

export function runImbalancedSimulation(
  baselineMean: number,
  stdev: number,
  mde: number,
  totalSampleSize: number,
  numSimulations: number = 100
): ImbalancedResults[] {
  const results: ImbalancedResults[] = [];
  const splits = [10, 20, 30, 40, 50, 60, 70, 80, 90];

  for (const controlPercent of splits) {
    const treatmentPercent = 100 - controlPercent;
    const controlSize = Math.floor((controlPercent / 100) * totalSampleSize);
    const treatmentSize = totalSampleSize - controlSize;

    let aaFalsePositives = 0;
    let abFalseNegatives = 0;

    for (let sim = 0; sim < numSimulations; sim++) {
      const controlSample = generateSample(baselineMean, stdev, controlSize);
      const treatmentSampleAA = generateSample(baselineMean, stdev, treatmentSize);
      const treatmentSampleAB = generateSample(baselineMean * (1 + mde / 100), stdev, treatmentSize);

      const tStatAA = runTTest(controlSample, treatmentSampleAA);
      const tStatAB = runTTest(controlSample, treatmentSampleAB);
      const criticalValue = 1.96;

      const isSignificantAA = Math.abs(tStatAA) > criticalValue;
      if (isSignificantAA) {
        aaFalsePositives++;
      }

      const isSignificantAB = Math.abs(tStatAB) > criticalValue;
      if (!isSignificantAB) {
        abFalseNegatives++;
      }
    }

    results.push({
      split: `${controlPercent}/${treatmentPercent}`,
      controlPercent,
      controlSize,
      treatmentSize,
      aaFalsePositiveRate: (aaFalsePositives / numSimulations) * 100,
      abFalseNegativeRate: (abFalseNegatives / numSimulations) * 100,
    });
  }

  return results;
}
