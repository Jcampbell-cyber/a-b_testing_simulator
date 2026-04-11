type Props = {
  sample: number[];
  bootstrapStats: number[];
};

export function BootstrapChart({ sample, bootstrapStats }: Props) {
  return (
    <div className="bg-gray-800 p-4 rounded">
      <h2 className="text-white font-semibold mb-2">
        Bootstrap Distribution
      </h2>

      <p className="text-gray-400 text-sm mb-2">
        Each point = statistic from a resample
      </p>

      {/* replace with real chart later */}
      <div className="text-gray-300 text-xs">
        Sample size: {sample.length} <br />
        Bootstrap draws: {bootstrapStats.length}
      </div>
    </div>
  );
}
