/**
 * Energy/Stamina bar component
 */

'use client'

export interface EnergyBarProps {
  current: number
  max: number
  regenerating?: boolean
  depleted?: boolean
}

/**
 * EnergyBar utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of EnergyBar.
 */
export function EnergyBar({
  current,
  max,
  regenerating = false,
  depleted = false,
}: EnergyBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100))

  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-gray-300">Energy</span>
        <div className="flex items-center gap-1">
          {regenerating && <span className="text-xs text-blue-400">Regenerating...</span>}
          {depleted && <span className="text-xs text-red-400">Depleted!</span>}
        </div>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-gray-700">
        <div
          className={`h-full transition-all duration-200 ${
            depleted ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
        {regenerating && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        )}
      </div>
    </div>
  )
}
