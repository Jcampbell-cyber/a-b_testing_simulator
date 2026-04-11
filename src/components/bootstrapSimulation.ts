export type MetricType = 'mean' | 'ratio';

export type User = {
  sessions: number;
  revenue: number;
};

export type BootstrapResult = {
  rawData: number[];
  bootstrapStats: number[];
  mean: number;
  stdev: number;
  ci: [number, number];
};

// ------------------------
// Helpers
// ------------------------

function mean(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stdev(arr: number[]) {
  const m = mean(arr);
  return Math.sqrt(mean(arr.map(x => (x - m) ** 2)));
}

function percentile(arr: number[], p: number) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.floor(p * (sorted.length - 1));
  return sorted[idx];
}

// ------------------------
// Synthetic data generator
// ------------------------

function generateUsers(n: number): User[] {
  return Array.from({ length: n }, () => {
    // lots of inactive users
    const inactive = Math.random() < 0.3;

    if (inactive) {
      return { sessions: 0, revenue: 0 };
    }

    const sessions =
      Math.random() < 0.7 ? 1 : Math.floor(Math.random() * 10 + 1);

    const revenue = Math.random() < 0.08 ? Math.random() * 100 : 0;

    return { sessions, revenue };
  });
}

// ------------------------
// Metric computation
// ------------------------

function computeMean(users: User[]) {
  const values = users.map(u => u.revenue);
  return mean(values);
}

function computeRatio(users: User[]) {
  const totalRevenue = users.reduce((s, u) => s + u.revenue, 0);
  const totalSessions = users.reduce((s, u) => s + u.sessions, 0);

  return totalSessions === 0 ? 0 : totalRevenue / totalSessions;
}

// ------------------------
// Bootstrap core
// ------------------------

function bootstrap(
  users: User[],
  metricType: MetricType
): number {
  const resample = Array.from(
    { length: users.length },
    () => users[Math.floor(Math.random() * users.length)]
  );

  return metricType === 'mean'
    ? computeMean(resample)
    : computeRatio(resample);
}

// ------------------------
// Main function
// ------------------------

export function runBootstrapSimulation(
  sampleSize: number,
  numResamples: number,
  metricType: MetricType
): BootstrapResult {
  const users = generateUsers(sampleSize);

  const rawData =
    metricType === 'mean'
      ? users.map(u => u.revenue)
      : users.map(u => (u.sessions > 0 ? u.revenue / u.sessions : 0));

  const pointEstimate =
    metricType === 'mean'
      ? computeMean(users)
      : computeRatio(users);

  const bootstrapStats = Array.from(
    { length: numResamples },
    () => bootstrap(users, metricType)
  );

  return {
    rawData,
    bootstrapStats,
    mean: pointEstimate,
    stdev: stdev(bootstrapStats),
    ci: [
      percentile(bootstrapStats, 0.025),
      percentile(bootstrapStats, 0.975),
    ],
  };
}
