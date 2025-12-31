export interface GroupData {
  name: string;
  controlRaw: number[];
  treatmentRaw: number[];
  controlNorm: number[];
  treatmentNorm: number[];
  baselineMean: number;
  baselineStd: number;
  rawControlMean: number;
  rawTreatmentMean: number;
  rawLift: number;
  rawLiftPercent: number;
  normControlMean: number;
  normTreatmentMean: number;
  normLift: number;
}

export interface NormalisationResults {
  groups: GroupData[];
  aggregatedRaw: {
    controlMean: number;
    treatmentMean: number;
    lift: number;
    liftPercent: number;
    pValue: number;
    significant: boolean;
    pooledStd: number;
    ci95: [number, number];
  };
  aggregatedNorm: {
    controlMean: number;
    treatmentMean: number;
    lift: number;
    liftPercent: number;
    pValue: number;
    significant: boolean;
    pooledStd: number;
    ci95: [number, number];
    ci95Percent: [number, number];
  };
  trueEffectPercent: number;
  allControlRaw: number[];
  allTreatmentRaw: number[];
  allControlNorm: number[];
  allTreatmentNorm: number[];
}

function generateNormal(mean: number, std: number, n: number): number[] {
  const values: number[] = [];
  for (let i = 0; i < n; i++) {
    let u1 = Math.random();
    let u2 = Math.random();
    while (u1 === 0) u1 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    values.push(mean + z * std);
  }
  return values;
}

function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function std(arr: number[]): number {
  const m = mean(arr);
  const variance = arr.reduce((sum, x) => sum + (x - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

function welchTTest(group1: number[], group2: number[]): number {
  const n1 = group1.length;
  const n2 = group2.length;
  const m1 = mean(group1);
  const m2 = mean(group2);
  const v1 = group1.reduce((sum, x) => sum + (x - m1) ** 2, 0) / (n1 - 1);
  const v2 = group2.reduce((sum, x) => sum + (x - m2) ** 2, 0) / (n2 - 1);

  const se = Math.sqrt(v1 / n1 + v2 / n2);
  if (se === 0) return 1;

  const t = (m1 - m2) / se;
  const df = Math.pow(v1 / n1 + v2 / n2, 2) /
    (Math.pow(v1 / n1, 2) / (n1 - 1) + Math.pow(v2 / n2, 2) / (n2 - 1));

  const x = df / (df + t * t);
  let p = incompleteBeta(x, df / 2, 0.5);
  return Math.min(1, p);
}

function incompleteBeta(x: number, a: number, b: number): number {
  if (x === 0) return 0;
  if (x === 1) return 1;

  const bt = Math.exp(
    logGamma(a + b) - logGamma(a) - logGamma(b) +
    a * Math.log(x) + b * Math.log(1 - x)
  );

  if (x < (a + 1) / (a + b + 2)) {
    return bt * betaCF(x, a, b) / a;
  }
  return 1 - bt * betaCF(1 - x, b, a) / b;
}

function betaCF(x: number, a: number, b: number): number {
  const maxIter = 100;
  const eps = 1e-10;

  let c = 1;
  let d = 1 / (1 - (a + b) * x / (a + 1));
  let h = d;

  for (let m = 1; m <= maxIter; m++) {
    const m2 = 2 * m;

    let aa = m * (b - m) * x / ((a + m2 - 1) * (a + m2));
    d = 1 / (1 + aa * d);
    c = 1 + aa / c;
    h *= d * c;

    aa = -(a + m) * (a + b + m) * x / ((a + m2) * (a + m2 + 1));
    d = 1 / (1 + aa * d);
    c = 1 + aa / c;
    const del = d * c;
    h *= del;

    if (Math.abs(del - 1) < eps) break;
  }

  return h;
}

function logGamma(x: number): number {
  const c = [
    76.18009172947146, -86.50532032941677, 24.01409824083091,
    -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5
  ];

  let y = x;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;

  for (let j = 0; j < 6; j++) {
    ser += c[j] / ++y;
  }

  return -tmp + Math.log(2.5066282746310005 * ser / x);
}

function standardize(values: number[], pooledMean: number, pooledStd: number): number[] {
  return values.map(v => (v - pooledMean) / pooledStd);
}

export interface GroupConfig {
  name: string;
  baselineMean: number;
  baselineStd: number;
}

export function runNormalisationSimulation(
  groupConfigs: GroupConfig[],
  sampleSizePerGroup: number,
  trueEffectPercent: number
): NormalisationResults {
  const groups: GroupData[] = [];

  let allControlRaw: number[] = [];
  let allTreatmentRaw: number[] = [];
  let allControlNorm: number[] = [];
  let allTreatmentNorm: number[] = [];

  for (const config of groupConfigs) {
    const controlRaw = generateNormal(config.baselineMean, config.baselineStd, sampleSizePerGroup);
    const treatmentEffect = config.baselineMean * (trueEffectPercent / 100);
    const treatmentRaw = generateNormal(config.baselineMean + treatmentEffect, config.baselineStd, sampleSizePerGroup);

    const pooledData = [...controlRaw, ...treatmentRaw];
    const pooledMean = mean(pooledData);
    const pooledStd = std(pooledData);

    const controlNorm = standardize(controlRaw, pooledMean, pooledStd);
    const treatmentNorm = standardize(treatmentRaw, pooledMean, pooledStd);

    const rawControlMean = mean(controlRaw);
    const rawTreatmentMean = mean(treatmentRaw);
    const rawLift = rawTreatmentMean - rawControlMean;
    const rawLiftPercent = (rawLift / rawControlMean) * 100;

    const normControlMean = mean(controlNorm);
    const normTreatmentMean = mean(treatmentNorm);
    const normLift = normTreatmentMean - normControlMean;

    groups.push({
      name: config.name,
      controlRaw,
      treatmentRaw,
      controlNorm,
      treatmentNorm,
      baselineMean: config.baselineMean,
      baselineStd: config.baselineStd,
      rawControlMean,
      rawTreatmentMean,
      rawLift,
      rawLiftPercent,
      normControlMean,
      normTreatmentMean,
      normLift
    });

    allControlRaw = allControlRaw.concat(controlRaw);
    allTreatmentRaw = allTreatmentRaw.concat(treatmentRaw);
    allControlNorm = allControlNorm.concat(controlNorm);
    allTreatmentNorm = allTreatmentNorm.concat(treatmentNorm);
  }

  const rawControlMean = mean(allControlRaw);
  const rawTreatmentMean = mean(allTreatmentRaw);
  const rawLift = rawTreatmentMean - rawControlMean;
  const rawLiftPercent = (rawLift / rawControlMean) * 100;
  const rawPValue = welchTTest(allTreatmentRaw, allControlRaw);
  const rawPooledStd = std([...allControlRaw, ...allTreatmentRaw]);
  const rawSE = rawPooledStd * Math.sqrt(1/allControlRaw.length + 1/allTreatmentRaw.length);
  const rawCI95: [number, number] = [rawLift - 1.96 * rawSE, rawLift + 1.96 * rawSE];

  const normControlMean = mean(allControlNorm);
  const normTreatmentMean = mean(allTreatmentNorm);
  const normLift = normTreatmentMean - normControlMean;
  const normPValue = welchTTest(allTreatmentNorm, allControlNorm);
  const normPooledStd = std([...allControlNorm, ...allTreatmentNorm]);
  const normSE = normPooledStd * Math.sqrt(1/allControlNorm.length + 1/allTreatmentNorm.length);
  const normCI95: [number, number] = [normLift - 1.96 * normSE, normLift + 1.96 * normSE];

  const normLiftPercent = rawLiftPercent;
  const percentSE = (rawSE / rawControlMean) * 100;
  const normCI95Percent: [number, number] = [
    rawLiftPercent - 1.96 * percentSE,
    rawLiftPercent + 1.96 * percentSE
  ];

  return {
    groups,
    aggregatedRaw: {
      controlMean: rawControlMean,
      treatmentMean: rawTreatmentMean,
      lift: rawLift,
      liftPercent: rawLiftPercent,
      pValue: rawPValue,
      significant: rawPValue < 0.05,
      pooledStd: rawPooledStd,
      ci95: rawCI95
    },
    aggregatedNorm: {
      controlMean: normControlMean,
      treatmentMean: normTreatmentMean,
      lift: normLift,
      liftPercent: normLiftPercent,
      pValue: normPValue,
      significant: normPValue < 0.05,
      pooledStd: normPooledStd,
      ci95: normCI95,
      ci95Percent: normCI95Percent
    },
    trueEffectPercent,
    allControlRaw,
    allTreatmentRaw,
    allControlNorm,
    allTreatmentNorm
  };
}
