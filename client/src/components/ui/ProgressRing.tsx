import React, { useEffect, useState } from 'react';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: 'cyan' | 'purple';
  label?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 120,
  strokeWidth = 10,
  color = 'cyan',
  label
}) => {
  const [offset, setOffset] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    const progressOffset = circumference - (percentage / 100) * circumference;
    setOffset(progressOffset);
  }, [percentage, circumference]);

  const strokeColor = color === 'cyan' ? '#00D9FF' : '#8B5CF6';
  const shadowColor = color === 'cyan' ? 'rgba(0, 217, 255, 0.4)' : 'rgba(139, 92, 246, 0.4)';

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background circle */}
          <circle
            className="text-white text-opacity-5"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            className="transition-all duration-1000 ease-out"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{
              filter: `drop-shadow(0 0 8px ${shadowColor})`
            }}
          />
        </svg>
        {/* Metric text in center */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="font-mono text-2xl font-bold text-white tracking-tight">
            {percentage}%
          </span>
        </div>
      </div>
      {label && (
        <span className="mt-3 text-xs font-semibold uppercase tracking-wider text-secText font-heading">
          {label}
        </span>
      )}
    </div>
  );
};
export default ProgressRing;

