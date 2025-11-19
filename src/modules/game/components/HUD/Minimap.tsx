/**
 * Minimap component
 */

'use client'

export interface MinimapProps {
  playerPosition: { x: number; y: number }
  obstacles: Array<{ x: number; y: number; width: number; height: number }>
  worldSize: { width: number; height: number }
  size?: number
}

export function Minimap({ playerPosition, obstacles, worldSize, size = 150 }: MinimapProps) {
  const scale = size / worldSize.width

  return (
    <div
      className="rounded-lg border-2 border-gray-700 bg-gray-900/80 backdrop-blur"
      style={{ width: size, height: size }}
    >
      <div className="relative h-full w-full overflow-hidden">
        {/* Player indicator */}
        <div
          className="absolute h-2 w-2 rounded-full bg-green-500 shadow-lg"
          style={{
            left: `${playerPosition.x * scale}px`,
            top: `${playerPosition.y * scale}px`,
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Obstacles */}
        {obstacles.map((obstacle, i) => (
          <div
            key={i}
            className="absolute bg-red-500/50"
            style={{
              left: `${obstacle.x * scale}px`,
              top: `${obstacle.y * scale}px`,
              width: `${obstacle.width * scale}px`,
              height: `${obstacle.height * scale}px`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
