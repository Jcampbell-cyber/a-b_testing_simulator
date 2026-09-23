export interface GuardrailPeekPoint {
  day: number;
  percentChange: number;
  pValue: number;
  lowerCI: number;
  upperCI: number;
  lowerCI99: number;
  upperCI99: number;
  crossedGuardrail: boolean;
  guardrailValue: number;
}

export interface GuardrailTimelineData {
  peeks: GuardrailPeekPoint[];
  crossedGuardrail: boolean;
  crossedGuardrailDay: number | null;
}

export interface GuardrailsSimulationResults {
  totalRuns: number;
  crossedGuardrailCount: number;
  allTimelines: GuardrailTimelineData[];
}

// Generate normal random samples
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
  const se = Math.sqrt(variance1 / n1 + variance2 / n2);
  const zScore = getZScore(confidenceLevel);
  const marginOfError = zScore * se;
  const diff = mean2 - mean1;
  const lowerBound = diff - marginOfError;
  const upperBound = diff + marginOfError;
  const percentLower = mean1 !== 0 ? (lowerBound / mean1) * 100 : 0;
  const percentUpper = mean1 !== 0 ? (upperBound / mean1) * 100 : 0;
  return { lowerCI: percentLower, upperCI: percentUpper };
}

function getZScore(confidenceLevel: number): number {
  const alpha = 1 - confidenceLevel / 100;
  const p = 1 - alpha / 2;

  const a1 = -3.969683028665376e1;
  const a2 = 2.209460984245205e2;
  const a3 = -2.759285104469687e2;
  const a4 = 1.383577518672690e2;
  const a5 = -3.066479806614716e1;
  const a6 = 2.506628277459239e0;
  const b1 = -5.447609879822406e1;
  const b2 = 1.615858368580409e2;
  const b3 = -1.556989798598866e2;
  const b4 = 6.680131188771972e1;
  const b5 = -1.328068155288572e1;
  const c1 = -7.784894002430293e-3;
  const c2 = -3.223964580411365e-1;
  const c3 = -2.400758277161838e0;
  const c4 = -2.549732539343734e0;
  const c5 = 4.374664141464968e0;
  const c6 = 2.938163982698783e0;
  const d1 = 7.784695709041462e-3;
  const d2 = 3.224671290700398e-1;
  const d3 = 2.445134137142996e0;
  const d4 = 3.754408661907416e0;
  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q: number, r: number;
  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
           ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  } else if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
           (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
            ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
}

function calculateTwoSidedCI(
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
  const se = Math.sqrt(variance1 / n1 + variance2 / n2);

  const zScore = getZScore(confidenceLevel);

  const diff = mean2 - mean1;
  const lowerBound = diff - zScore * se;
  const upperBound = diff + zScore * se;
  const percentLower = mean1 !== 0 ? (lowerBound / mean1) * 100 : 0;
  const percentUpper = mean1 !== 0 ? (upperBound / mean1) * 100 : 0;
  return { lowerCI: percentLower, upperCI: percentUpper };
}

// Main simulation
export function runGuardrailsSimulation(
  trueUpliftPercent: number,
  baselineMean: number,
  stdev: number,
  sampleSize: number,
  numSimulations: number,
  guardrailType: 'manual' | 'statistical',
  manualGuardrail: number,
  statisticalConfidence: number,
  peekingFrequency: number,
  testDuration: number
): GuardrailsSimulationResults {
  let crossedGuardrailCount = 0;
  const allTimelines: GuardrailTimelineData[] = [];

  for (let sim = 0; sim < numSimulations; sim++) {
    const controlGroup = generateNormalSample(baselineMean, stdev, sampleSize);
    const treatmentMean = baselineMean * (1 + trueUpliftPercent / 100);
    const treatmentGroup = generateNormalSample(treatmentMean, stdev, sampleSize);
    const samplesPerDay = Math.floor(sampleSize / testDuration);

    let crossedGuardrail = false;
    let crossedGuardrailDay: number | null = null;
    const timelinePoints: GuardrailPeekPoint[] = [];

    // Peeking schedule
    const peekDays: number[] = [0];
    if (peekingFrequency >= testDuration) {
      for (let day = 1; day <= testDuration; day++) peekDays.push(day);
    } else {
      const interval = Math.floor(testDuration / peekingFrequency);
      for (let i = 1; i <= peekingFrequency; i++) {
        const day = i === peekingFrequency ? testDuration : i * interval;
        peekDays.push(day);
      }
    }


    for (const day of peekDays) {
      const currentSampleSize = day === 0 ? 0 : Math.min(day * samplesPerDay, sampleSize);
      const controlSample = controlGroup.slice(0, currentSampleSize);
      const treatmentSample = treatmentGroup.slice(0, currentSampleSize);

      const percentChange = day === 0 ? 0 : calculatePercentChange(controlSample, treatmentSample);
      const { lowerCI, upperCI } = day === 0
        ? { lowerCI: 0, upperCI: 0 }
        : calculateConfidenceInterval(controlSample, treatmentSample, 95);

      let guardrailValue: number;
      let crossedThisPeek = false;

      const ci99 = day === 0
        ? { lowerCI: 0, upperCI: 0 }
        : calculateTwoSidedCI(controlSample, treatmentSample, statisticalConfidence);

      if (guardrailType === 'manual') {
        guardrailValue = manualGuardrail;
        crossedThisPeek = day > 0 && percentChange < guardrailValue;
      } else {
        // Guardrail threshold is 0 for statistical guardrails
        // Guardrail is crossed when the UPPER bound of 99% CI is below 0
        // (meaning we're confident the effect is negative)
        guardrailValue = 0;
        crossedThisPeek = day > 0 && ci99.upperCI < 0;
      }


      if (crossedThisPeek && !crossedGuardrail) {
        crossedGuardrail = true;
        crossedGuardrailDay = day;
      }

      timelinePoints.push({
        day,
        percentChange,
        pValue: 1,
        lowerCI,
        upperCI,
        lowerCI99: ci99.lowerCI,
        upperCI99: ci99.upperCI,
        crossedGuardrail: crossedThisPeek,
        guardrailValue,
      });
    }

    if (crossedGuardrail) crossedGuardrailCount++;

    allTimelines.push({ peeks: timelinePoints, crossedGuardrail, crossedGuardrailDay });
  }

  return { totalRuns: numSimulations, crossedGuardrailCount, allTimelines };
}
