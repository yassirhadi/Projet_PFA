const CVScore = ({ score = 0, size = 100, showLabel = true }) => {
  const clampedScore = Math.max(0, Math.min(100, score));
  const radius = 40;
  const cx = size / 2;
  const cy = size / 2;
  const stroke   = 8;
  const circumference = 2 * Math.PI * radius;
  const offset  = circumference - (clampedScore / 100) * circumference;

  const color =
    clampedScore >= 75 ? '#4ade80' :  // green
    clampedScore >= 50 ? '#facc15' :  // yellow
                          '#f87171';   // red

  const label =
    clampedScore >= 75 ? 'Excellent' :
    clampedScore >= 50 ? 'Correct'   : 'À améliorer';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none" stroke="#1e293b" strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        {/* Score text */}
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
          fill="#f1f5f9" fontSize={size * 0.22} fontWeight="bold"
        >
          {clampedScore}
        </text>
      </svg>
      {showLabel && (
        <span className="text-xs font-medium" style={{ color }}>
          {label}
        </span>
      )}
    </div>
  );
};

export default CVScore;