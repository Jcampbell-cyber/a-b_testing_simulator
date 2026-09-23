export interface PeekPoint {
  day: number;
  percentChange: number;
  pValue: number;
  isSignificant: boolean;
  lowerCI: number;
  upperCI: number;
}

export interface TimelineData {
  peeks: PeekPoint[];
  finalDecision: 'positive' | 'negative' | 'none';
  hitSignificantAtAnyPeek: boolean;
}

export interface PeekingSimulationResults {
  totalRuns: number;
  significantAtAnyPeek: number;
  significantAtAnyPeekPositive: number;
  significantAtAnyPeekNegative: number;
  significantAtEnd: number;
  significantAtEndPositive: number;
  significantAtEndNegative: number;
  allTimelines: TimelineData[];
}

function generateNormalSample(mean: number, stdev: number, size: number): number[] {
  const samples: number[] = [];
  for (let i = 0; i < size; i++) {
    let u1 = Math.random();
    const u2 = Math.random();

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

function runTTest(control: number[], treatment: number[]): { tStat: number; pValue: number } {
  const n1 = control.length;
  const n2 = treatment.length;

  const mean1 = control.reduce((a, b) => a + b, 0) / n1;
  const mean2 = treatment.reduce((a, b) => a + b, 0) / n2;

  const variance1 = control.reduce((sum, x) => sum + Math.pow(x - mean1, 2), 0) / (n1 - 1);
  const variance2 = treatment.reduce((sum, x) => sum + Math.pow(x - mean2, 2), 0) / (n2 - 1);

  const pooledStd = Math.sqrt((variance1 / n1) + (variance2 / n2));

  if (pooledStd === 0) return { tStat: 0, pValue: 1 };

  const tStat = (mean2 - mean1) / pooledStd;
  const df = n1 + n2 - 2;

  const pValue = 2 * (1 - tCDF(Math.abs(tStat), df));

  return { tStat, pValue };
}

function tCDF(t: number, df: number): number {
  const x = df / (df + t * t);
  return 1 - 0.5 * betaIncomplete(df / 2, 0.5, x);
}

function betaIncomplete(a: number, b: number, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;

  const bt = Math.exp(
    a * Math.log(x) + b * Math.log(1 - x) - logBeta(a, b)
  );

  if (x < (a + 1) / (a + b + 2)) {
    return bt * betaContinuedFraction(a, b, x) / a;
  } else {
    return 1 - bt * betaContinuedFraction(b, a, 1 - x) / b;
  }
}

function logBeta(a: number, b: number): number {
  return logGamma(a) + logGamma(b) - logGamma(a + b);
}

function logGamma(x: number): number {
  const coefficients = [
    76.18009172947146, -86.50532032941678, 24.01409824083091,
    -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5
  ];

  let y = x;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;

  for (let i = 0; i < 6; i++) {
    ser += coefficients[i] / ++y;
  }

  return -tmp + Math.log(2.5066282746310007 * ser / x);
}

function betaContinuedFraction(a: number, b: number, x: number): number {
  const maxIterations = 100;
  const epsilon = 3e-7;

  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - qab * x / qap;

  if (Math.abs(d) < epsilon) d = epsilon;
  d = 1 / d;
  let h = d;

  for (let m = 1; m <= maxIterations; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < epsilon) d = epsilon;
    c = 1 + aa / c;
    if (Math.abs(c) < epsilon) c = epsilon;
    d = 1 / d;
    h *= d * c;

    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < epsilon) d = epsilon;
    c = 1 + aa / c;
    if (Math.abs(c) < epsilon) c = epsilon;
    d = 1 / d;
    const del = d * c;
    h *= del;

    if (Math.abs(del - 1) < epsilon) break;
  }

  return h;
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

  const alpha = (100 - confidenceLevel) / 100;
  const zScore = getZScore(1 - alpha / 2);

  const marginOfError = zScore * se;
  const diff = mean2 - mean1;

  const lowerBound = diff - marginOfError;
  const upperBound = diff + marginOfError;

  const percentLower = mean1 !== 0 ? (lowerBound / mean1) * 100 : 0;
  const percentUpper = mean1 !== 0 ? (upperBound / mean1) * 100 : 0;

  return { lowerCI: percentLower, upperCI: percentUpper };
}

function getZScore(probability: number): number {
  if (probability >= 0.999) return 3.291;
  if (probability >= 0.995) return 2.807;
  if (probability >= 0.99) return 2.576;
  if (probability >= 0.975) return 1.96;
  if (probability >= 0.95) return 1.645;
  return 1.96;
}

export function runPeekingSimulation(
  trueUpliftPercent: number,
  baselineMean: number,
  stdev: number,
  sampleSize: number,
  numSimulations: number,
  confidenceLevel: number,
  peekingFrequency: number,
  testDuration: number
): PeekingSimulationResults {
  let significantAtAnyPeek = 0;
  let significantAtAnyPeekPositive = 0;
  let significantAtAnyPeekNegative = 0;
  let significantAtEnd = 0;
  let significantAtEndPositive = 0;
  let significantAtEndNegative = 0;
  const allTimelines: TimelineData[] = [];

  const trueMean = baselineMean * (trueUpliftPercent / 100);
  const alpha = (100 - confidenceLevel) / 100;

  for (let sim = 0; sim < numSimulations; sim++) {
    const controlGroup = generateNormalSample(baselineMean, stdev, sampleSize);
    const treatmentGroup = generateNormalSample(baselineMean + trueMean, stdev, sampleSize);

    const samplesPerDay = Math.floor(sampleSize / testDuration);
    let hitSignificantAtAnyPeek = false;
    let firstSignificantDirection: 'positive' | 'negative' | null = null;
    const timelinePoints: PeekPoint[] = [];

    const peekDays: number[] = [0];
    if (peekingFrequency >= testDuration) {
      for (let day = 1; day <= testDuration; day++) {
        peekDays.push(day);
      }
    } else {
      const interval = Math.floor(testDuration / peekingFrequency);
      for (let i = 1; i <= peekingFrequency; i++) {
        const day = i === peekingFrequency ? testDuration : i * interval;
        peekDays.push(day);
      }
    }

    for (const day of peekDays) {
      if (day === 0) {
        timelinePoints.push({
          day: 0,
          percentChange: 0,
          pValue: 1,
          isSignificant: false,
          lowerCI: 0,
          upperCI: 0,
        });
        continue;
      }
      const currentSampleSize = Math.min(day * samplesPerDay, sampleSize);

      if (currentSampleSize < 10) continue;

      const controlSample = controlGroup.slice(0, currentSampleSize);
      const treatmentSample = treatmentGroup.slice(0, currentSampleSize);

      const percentChange = calculatePercentChange(controlSample, treatmentSample);
      const { pValue } = runTTest(controlSample, treatmentSample);
      const { lowerCI, upperCI } = calculateConfidenceInterval(controlSample, treatmentSample, confidenceLevel);

      const isSignificant = pValue < alpha;

      if (isSignificant) {
        hitSignificantAtAnyPeek = true;
        if (firstSignificantDirection === null) {
          firstSignificantDirection = percentChange > 0 ? 'positive' : 'negative';
        }
      }

      timelinePoints.push({
        day,
        percentChange,
        pValue,
        isSignificant,
        lowerCI,
        upperCI,
      });
    }

    const lastPoint = timelinePoints[timelinePoints.length - 1];
    let finalDecision: 'positive' | 'negative' | 'none' = 'none';

    if (lastPoint?.isSignificant) {
      significantAtEnd++;
      finalDecision = lastPoint.percentChange > 0 ? 'positive' : 'negative';
      if (finalDecision === 'positive') {
        significantAtEndPositive++;
      } else {
        significantAtEndNegative++;
      }
    }

    if (hitSignificantAtAnyPeek) {
      significantAtAnyPeek++;
      if (firstSignificantDirection === 'positive') {
        significantAtAnyPeekPositive++;
      } else if (firstSignificantDirection === 'negative') {
        significantAtAnyPeekNegative++;
      }
    }

    allTimelines.push({
      peeks: timelinePoints,
      finalDecision,
      hitSignificantAtAnyPeek,
    });
  }

  return {
    totalRuns: numSimulations,
    significantAtAnyPeek,
    significantAtAnyPeekPositive,
    significantAtAnyPeekNegative,
    significantAtEnd,
    significantAtEndPositive,
    significantAtEndNegative,
    allTimelines,
  };
}
