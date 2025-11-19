/**
 * Power-up inventory slot component
 */

'use client'

export interface PowerUp {
  id: string
  icon: string
  name: string
  duration?: number
  charges?: number
}

export interface PowerUpSlotProps {
  powerUp?: PowerUp
  active?: boolean
  cooldown?: number
  onClick?: () => void
}

export function PowerUpSlot({ powerUp, active = false, cooldown = 0, onClick }: PowerUpSlotProps) {
  const cooldownPercentage = Math.max(0, Math.min(100, cooldown * 100))

  return (
    <button
      onClick={onClick}
      disabled={!powerUp || cooldown > 0}
      className={`relative h-16 w-16 rounded-lg border-2 transition-all ${
        active
          ? 'border-yellow-500 bg-yellow-500/20 shadow-lg shadow-yellow-500/50'
          : powerUp
            ? 'border-purple-500 bg-purple-500/10 hover:bg-purple-500/20'
            : 'border-gray-700 bg-gray-800'
      } ${powerUp && cooldown === 0 ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {powerUp ? (
        <>
          <div className="flex h-full items-center justify-center text-3xl">{powerUp.icon}</div>
          {powerUp.charges && (
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
              {powerUp.charges}
            </div>
          )}
          {cooldown > 0 && (
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              <div
                className="absolute bottom-0 left-0 right-0 bg-gray-900/70"
                style={{ height: `${cooldownPercentage}%` }}
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex h-full items-center justify-center text-gray-600">?</div>
      )}
    </button>
  )
}
