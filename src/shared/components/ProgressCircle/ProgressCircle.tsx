/**
 * Circular progress indicator
 */

'use client'

export interface ProgressCircleProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  showValue?: boolean
  color?: string
}

export function ProgressCircle({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  showValue = true,
  color = '#a855f7',
}: ProgressCircleProps) {
  const percentage = Math.min(100, (value / max) * 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      {showValue && (
        <div className="absolute text-center">
          <div className="text-2xl font-bold text-white">{Math.round(percentage)}%</div>
        </div>
      )}
    </div>
  )
}
