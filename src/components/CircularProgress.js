// components/CircularProgress.js
import React from 'react'
import { cn } from '@/lib/utils'

export default function CircularProgress ({
  value,
  renderLabel,
  className,
  progressClassName,
  labelClassName,
  showLabel,
  shape = 'round',
  size = 100,
  strokeWidth,
  circleStrokeWidth = 6,
  progressStrokeWidth = 10
}) {
  const radius = size / 2 - 10
  const circumference = Math.ceil(2 * Math.PI * radius)
  const offset = Math.ceil(circumference * ((100 - value) / 100))
  const viewBox = `0 0 ${size} ${size}`

  return (
    <div className="relative">
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        className="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          strokeWidth={strokeWidth ?? circleStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={0}
          className={cn('stroke-primary/25', className)}
        />

        {/* Main Progress Circle */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          strokeWidth={strokeWidth ?? progressStrokeWidth}
          strokeLinecap={shape}
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset }}
          className={cn(
            'stroke-primary transition-[stroke-dashoffset] duration-300 ease-linear',
            progressClassName,
            value >= 95 && value < 100 ? 'opacity-80' : ''
          )}
        />

        {/* Top Loading Glow Animation (Overlay) */}
        {value >= 95 && value < 100 && (
          <circle
            r={radius}
            cx={size / 2}
            cy={size / 2}
            fill="transparent"
            strokeWidth={strokeWidth ?? progressStrokeWidth}
            strokeLinecap={shape}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="stroke-primary animate-dashGlow blur-[2px] opacity-70"
          />
        )}
      </svg>

      {showLabel && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center text-sm',
            labelClassName
          )}
        >
          {renderLabel ? renderLabel(value) : value}
        </div>
      )}
    </div>
  )
}
