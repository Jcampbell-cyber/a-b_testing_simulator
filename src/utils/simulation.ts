export interface PeekPoint {
  day: number;
  percentChange: number;
  isSignificant: boolean;
  lowerCI: number;
  upperCI: number;
  outsideLowerCI: boolean;
  outsideUpperCI: boolean;
  everHitNegative: boolean;
  everHitPositive: boolean;
}

export interface TimelineData {
  peeks: PeekPoint[];
  finalDecision: 'positive' | 'negative' | 'none';
  hitNegativeButFinishedPositive: boolean;
}

export interface SimulationResults {
  totalRuns: number;
  positiveAtAnyPeek: number;
  negativeAtAnyPeek: number;
  positiveAtEnd: number;
  negativeAtEnd: number;
  negativeToPositive: number;
  allTimelines: TimelineData[];
}

function generateNormalSample(mean: number, stdev: number, size: number): number[] {
  const samples: number[] = [];
  for (let i = 0; i < size; i++) {
    let u1 = Math.random();
    let u2 = Math.random();

    while (u1 === 0) u1 = Math.random();

    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    samples.push(mean + z0 * stdev);
  }
  return samples;
}

function calculatePercentChange(control: number[], treatment: number[]): number {
  const controlMean = control.reduce((a, b) => a + b, 0) / control.length;
  const treatmentMean = treatment.reduce((a, b) => a + b, 0) / treatment.length;

  if (controlMean === 0) return 0;
  return ((treatmentMean - controlMean) / Math.abs(controlMean)) * 100;
}

function runTTest(control: number[], treatment: number[]): number {
  const n1 = control.length;
  const n2 = treatment.length;

  const mean1 = control.reduce((a, b) => a + b, 0) / n1;
  const mean2 = treatment.reduce((a, b) => a + b, 0) / n2;

  const variance1 = control.reduce((sum, x) => sum + Math.pow(x - mean1, 2), 0) / (n1 - 1);
  const variance2 = treatment.reduce((sum, x) => sum + Math.pow(x - mean2, 2), 0) / (n2 - 1);

  const pooledStd = Math.sqrt((variance1 / n1) + (variance2 / n2));

  if (pooledStd === 0) return 0;

  return (mean2 - mean1) / pooledStd;
}

function calculateConfidenceInterval(
  control: number[],
  treatment: number[],
  confidenceLevel: number
): { lowerCI: number; upperCI: number } {
  const n1 = control.length;
  const n2 = treatment.length;

  const mean1 = control.reduce((a, b) => a + b, 0) / n1;
  const mean2 = treatment.reduce((a, b) => a + b, 0) / n2;

  const variance1 = control.reduce((sum, x) => sum + Math.pow(x - mean1, 2), 0) / (n1 - 1);
  const variance2 = treatment.reduce((sum, x) => sum + Math.pow(x - mean2, 2), 0) / (n2 - 1);

  const se = Math.sqrt((variance1 / n1) + (variance2 / n2));
  const zScore = confidenceLevel === 0.99 ? 2.576 : 1.96;

  const marginOfError = zScore * se;
  const diff = mean2 - mean1;

  const lowerBound = diff - marginOfError;
  const upperBound = diff + marginOfError;

  const percentLower = mean1 !== 0 ? (lowerBound / mean1) * 100 : 0;
  const percentUpper = mean1 !== 0 ? (upperBound / mean1) * 100 : 0;

  return { lowerCI: percentLower, upperCI: percentUpper };
}

export function runSimulation(
  trueUpliftPercent: number,
  baselineMean: number,
  stdev: number,
  sampleSize: number,
  numSimulations: number,
  targetLowerCI: number,
  targetUpperCI: number,
  peekingFrequency: number,
  testDuration: number
): SimulationResults {
  let positiveAtAnyPeek = 0;
  let negativeAtAnyPeek = 0;
  let positiveAtEnd = 0;
  let negativeAtEnd = 0;
  let negativeToPositive = 0;
  const allTimelines: TimelineData[] = [];

  const hasRealEffect = Math.abs(trueUpliftPercent) > 0.01;
  const trueMean = baselineMean * (trueUpliftPercent / 100);

  for (let sim = 0; sim < numSimulations; sim++) {
    const controlGroup = generateNormalSample(baselineMean, stdev, sampleSize);
    const treatmentGroup = generateNormalSample(baselineMean + trueMean, stdev, sampleSize);

    const samplesPerDay = Math.floor(sampleSize / testDuration);
    let everHitNegative = false;
    let everHitPositive = false;
    let hitPositiveAtAnyPeek = false;
    let hitNegativeAtAnyPeek = false;
    const timelinePoints: PeekPoint[] = [];

    for (let day = 1; day <= testDuration; day++) {
      const currentSampleSize = Math.min(day * samplesPerDay, sampleSize);

      if (currentSampleSize < 10) continue;

      const controlSample = controlGroup.slice(0, currentSampleSize);
      const treatmentSample = treatmentGroup.slice(0, currentSampleSize);

      const percentChange = calculatePercentChange(controlSample, treatmentSample);
      const { lowerCI, upperCI } = calculateConfidenceInterval(controlSample, treatmentSample, 0.95);
      const tStat = runTTest(controlSample, treatmentSample);

      const criticalValue = 1.96;
      const isSignificant = Math.abs(tStat) > criticalValue;

      const outsideLowerCI = upperCI < 0;
      const outsideUpperCI = lowerCI > 0;

      if (outsideLowerCI) {
        everHitNegative = true;
        hitNegativeAtAnyPeek = true;
      }

      if (outsideUpperCI) {
        everHitPositive = true;
        hitPositiveAtAnyPeek = true;
      }

      timelinePoints.push({
        day,
        percentChange,
        isSignificant,
        lowerCI,
        upperCI,
        outsideLowerCI,
        outsideUpperCI,
        everHitNegative,
        everHitPositive,
      });
    }

    let finalDecision: 'positive' | 'negative' | 'none' = 'none';
    if (timelinePoints.length > 0) {
      const lastPoint = timelinePoints[timelinePoints.length - 1];
      if (lastPoint.outsideUpperCI) {
        finalDecision = 'positive';
        positiveAtEnd++;
      } else if (lastPoint.outsideLowerCI) {
        finalDecision = 'negative';
        negativeAtEnd++;
      }
    }

    const hitNegativeButFinishedPositive = everHitNegative && finalDecision === 'positive';
    if (hitNegativeButFinishedPositive) {
      negativeToPositive++;
    }

    if (hitPositiveAtAnyPeek) positiveAtAnyPeek++;
    if (hitNegativeAtAnyPeek) negativeAtAnyPeek++;

    allTimelines.push({
      peeks: timelinePoints,
      finalDecision,
      hitNegativeButFinishedPositive,
    });
  }

  return {
    totalRuns: numSimulations,
    positiveAtAnyPeek,
    negativeAtAnyPeek,
    positiveAtEnd,
    negativeAtEnd,
    negativeToPositive,
    allTimelines,
  };
}
