export function ProgressBar({ value, showLabel = true, size = 'md', color = 'green' }) {
  const colorClasses = {
    green: 'bg-bricol-green',
    blue: 'bg-bricol-blue',
    orange: 'bg-bricol-orange',
    red: 'bg-bricol-red'
  };

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className="w-full">
      <div className={`progress-bar ${sizeClasses[size]}`}>
        <div
          className={`progress-fill ${colorClasses[color]}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-600 mt-1 inline-block">{value}%</span>
      )}
    </div>
  );
}
