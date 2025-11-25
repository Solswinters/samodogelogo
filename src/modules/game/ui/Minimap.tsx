import React, { useRef, useEffect } from 'react'

export interface MinimapProps {
  width: number
  height: number
  worldWidth: number
  worldHeight: number
  playerX: number
  playerY: number
  obstacles: Array<{ x: number; y: number; width: number; height: number }>
}

/**
 * Minimap utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of Minimap.
 */
export const Minimap: React.FC<MinimapProps> = ({
  width,
  height,
  worldWidth,
  worldHeight,
  playerX,
  playerY,
  obstacles,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Scale factors
    const scaleX = width / worldWidth
    const scaleY = height / worldHeight

    // Draw background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, width, height)

    // Draw obstacles
    ctx.fillStyle = '#ff4444'
    obstacles.forEach((obstacle) => {
      ctx.fillRect(
        obstacle.x * scaleX,
        obstacle.y * scaleY,
        obstacle.width * scaleX,
        obstacle.height * scaleY
      )
    })

    // Draw player
    ctx.fillStyle = '#00ff00'
    ctx.beginPath()
    ctx.arc(playerX * scaleX, playerY * scaleY, 3, 0, Math.PI * 2)
    ctx.fill()
  }, [width, height, worldWidth, worldHeight, playerX, playerY, obstacles])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute bottom-4 right-4 rounded-md border-2 border-white/20"
    />
  )
}
