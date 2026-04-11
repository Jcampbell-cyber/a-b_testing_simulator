type Props = {
  distribution: 'normal' | 'skewed' | 'bimodal';
  sampleSize: number;
  numResamples: number;
  metric: 'mean' | 'median';
  isRunning: boolean;
  onDistributionChange: (v: Props['distribution']) => void;
  onSampleSizeChange: (v: number) => void;
  onNumResamplesChange: (v: number) => void;
  onMetricChange: (v: Props['metric']) => void;
  onRun: () => void;
};

export function BootstrapControls({
  distribution,
  sampleSize,
  numResamples,
  metric,
  isRunning,
  onDistributionChange,
  onSampleSizeChange,
  onNumResamplesChange,
  onMetricChange,
  onRun,
}: Props) {
  return (
    <div className="bg-gray-800 p-4 rounded text-white space-y-4">

      <div>
        <label>Distribution</label>
        <select
          value={distribution}
          onChange={(e) => onDistributionChange(e.target.value as any)}
          className="ml-2 text-black"
        >
          <option value="normal">Normal</option>
          <option value="skewed">Skewed</option>
          <option value="bimodal">Bimodal</option>
        </select>
      </div>

      <div>
        <label>Sample size</label>
        <input
          type="number"
          value={sampleSize}
          onChange={(e) => onSampleSizeChange(Number(e.target.value))}
          className="ml-2 text-black w-20"
        />
      </div>

      <div>
        <label>Resamples</label>
        <input
          type="number"
          value={numResamples}
          onChange={(e) => onNumResamplesChange(Number(e.target.value))}
          className="ml-2 text-black w-24"
        />
      </div>

      <div>
        <label>Metric</label>
        <select
          value={metric}
          onChange={(e) => onMetricChange(e.target.value as any)}
          className="ml-2 text-black"
        >
          <option value="mean">Mean</option>
          <option value="median">Median</option>
        </select>
      </div>

      <button
        onClick={onRun}
        disabled={isRunning}
        className="bg-blue-500 px-4 py-2 rounded"
      >
        {isRunning ? 'Running...' : 'Run'}
      </button>
    </div>
  );
}
