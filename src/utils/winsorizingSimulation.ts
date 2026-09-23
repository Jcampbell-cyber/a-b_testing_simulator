export interface WinsorizingResults {
  original: {
    data: number[];
    mean: number;
    std: number;
    ci: [number, number];
    outlierCount: number;
  };
  winsorized: {
    data: number[];
    mean: number;
    std: number;
    ci: [number, number];
    cappedCount: number;
  };
  comparison: {
    meanDiff: number;
    stdReduction: number;
    ciWidthOriginal: number;
    ciWidthWinsorized: number;
    ciReduction: number;
  };
}

export interface ABTestResults {
  original: {
    controlMean: number;
    treatmentMean: number;
    lift: number;
    pValue: number;
    significant: boolean;
    ciLower: number;
    ciUpper: number;
  };
  winsorized: {
    controlMean: number;
    treatmentMean: number;
    lift: number;
    pValue: number;
    significant: boolean;
    ciLower: number;
    ciUpper: number;
  };
}


function generateSkewedData(n: number, mean: number, std: number): number[] {
  const data: number[] = [];
  for (let i = 0; i < n; i++) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const value = mean + z * std;
    const skewedValue = Math.random() < 0.1 ? value + Math.abs(z) * std * 2 : value;
    data.push(Math.max(0, skewedValue));
  }
  return data;
}

function calculateMean(data: number[]): number {
  return data.reduce((sum, val) => sum + val, 0) / data.length;
}

function calculateStd(data: number[], mean: number): number {
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (data.length - 1);
  return Math.sqrt(variance);
}

function calculateCI(data: number[], confidence: number = 0.95): [number, number] {
  const mean = calculateMean(data);
  const std = calculateStd(data, mean);
  const n = data.length;
  const z = confidence === 0.95 ? 1.96 : confidence === 0.99 ? 2.576 : 1.96;
  const marginOfError = z * (std / Math.sqrt(n));

  return [mean - marginOfError, mean + marginOfError];
}

function winsorizeData(data: number[], upperPercentile: number): { data: number[], cappedCount: number } {
  const sorted = [...data].sort((a, b) => a - b);
  const upperIdx = Math.ceil(sorted.length * upperPercentile / 100) - 1;

  const upperThreshold = sorted[upperIdx];

  let cappedCount = 0;
  const winsorized = data.map(val => {
    if (val > upperThreshold) {
      cappedCount++;
      return upperThreshold;
    }
    return val;
  });

  return { data: winsorized, cappedCount };
}

function countOutliers(data: number[], upperPercentile: number): number {
  const sorted = [...data].sort((a, b) => a - b);
  const upperIdx = Math.ceil(sorted.length * upperPercentile / 100) - 1;

  const upperThreshold = sorted[upperIdx];

  return data.filter(val => val > upperThreshold).length;
}

export function runWinsorizingSimulation(
  sampleSize: number,
  baselineMean: number,
  baselineStd: number,
  upperPercentile: number
): WinsorizingResults {
  const originalData = generateSkewedData(sampleSize, baselineMean, baselineStd);

  const originalMean = calculateMean(originalData);
  const originalStd = calculateStd(originalData, originalMean);
  const originalCI = calculateCI(originalData);
  const outlierCount = countOutliers(originalData, upperPercentile);

  const { data: winsorizedData, cappedCount } = winsorizeData(originalData, upperPercentile);
  const winsorizedMean = calculateMean(winsorizedData);
  const winsorizedStd = calculateStd(winsorizedData, winsorizedMean);
  const winsorizedCI = calculateCI(winsorizedData);

  const ciWidthOriginal = originalCI[1] - originalCI[0];
  const ciWidthWinsorized = winsorizedCI[1] - winsorizedCI[0];

  return {
    original: {
      data: originalData,
      mean: originalMean,
      std: originalStd,
      ci: originalCI,
      outlierCount
    },
    winsorized: {
      data: winsorizedData,
      mean: winsorizedMean,
      std: winsorizedStd,
      ci: winsorizedCI,
      cappedCount
    },
    comparison: {
      meanDiff: Math.abs(originalMean - winsorizedMean),
      stdReduction: ((originalStd - winsorizedStd) / originalStd) * 100,
      ciWidthOriginal,
      ciWidthWinsorized,
      ciReduction: ((ciWidthOriginal - ciWidthWinsorized) / ciWidthOriginal) * 100
    }
  };
}

function calculateTTest(control: number[], treatment: number[]): { pValue: number, ciLower: number, ciUpper: number } {
  const meanControl = calculateMean(control);
  const meanTreatment = calculateMean(treatment);
  const stdControl = calculateStd(control, meanControl);
  const stdTreatment = calculateStd(treatment, meanTreatment);

  const n1 = control.length;
  const n2 = treatment.length;

  const pooledStd = Math.sqrt(
    ((n1 - 1) * Math.pow(stdControl, 2) + (n2 - 1) * Math.pow(stdTreatment, 2)) /
    (n1 + n2 - 2)
  );

  const tStat = (meanTreatment - meanControl) / (pooledStd * Math.sqrt(1/n1 + 1/n2));
  const df = n1 + n2 - 2;

  const pValue = 2 * (1 - approximateTCDF(Math.abs(tStat), df));

  const marginOfError = 1.96 * pooledStd * Math.sqrt(1/n1 + 1/n2);
  const diff = meanTreatment - meanControl;

  return {
    pValue,
    ciLower: diff - marginOfError,
    ciUpper: diff + marginOfError
  };
}

function approximateTCDF(t: number, df: number): number {
  const x = df / (df + t * t);

  if (df > 30) {
    return approximateNormalCDF(t);
  }

  const p = 1 - 0.5 * Math.pow(x, df / 2);
  return Math.max(0, Math.min(1, p));
}

function approximateNormalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

export function runABTestSimulation(
  sampleSize: number,
  controlMean: number,
  treatmentUplift: number,
  baselineStd: number,
  upperPercentile: number,
  alpha: number = 0.05
): ABTestResults {
  const treatmentMean = controlMean * (1 + treatmentUplift / 100);

  const controlData = generateSkewedData(sampleSize, controlMean, baselineStd);
  const treatmentData = generateSkewedData(sampleSize, treatmentMean, baselineStd);

  const originalTest = calculateTTest(controlData, treatmentData);
  const originalControlMean = calculateMean(controlData);
  const originalTreatmentMean = calculateMean(treatmentData);
  const originalLift = ((originalTreatmentMean - originalControlMean) / originalControlMean) * 100;

  const { data: controlWinsorized } = winsorizeData(controlData, upperPercentile);
  const { data: treatmentWinsorized } = winsorizeData(treatmentData, upperPercentile);

  const winsorizedTest = calculateTTest(controlWinsorized, treatmentWinsorized);
  const winsorizedControlMean = calculateMean(controlWinsorized);
  const winsorizedTreatmentMean = calculateMean(treatmentWinsorized);
  const winsorizedLift = ((winsorizedTreatmentMean - winsorizedControlMean) / winsorizedControlMean) * 100;

  return {
    original: {
      controlMean: originalControlMean,
      treatmentMean: originalTreatmentMean,
      lift: originalLift,
      pValue: originalTest.pValue,
      significant: originalTest.pValue < alpha,
      ciLower: originalTest.ciLower,
      ciUpper: originalTest.ciUpper
    },
    winsorized: {
      controlMean: winsorizedControlMean,
      treatmentMean: winsorizedTreatmentMean,
      lift: winsorizedLift,
      pValue: winsorizedTest.pValue,
      significant: winsorizedTest.pValue < alpha,
      ciLower: winsorizedTest.ciLower,
      ciUpper: winsorizedTest.ciUpper
    }
  };
}
