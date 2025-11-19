/**
 * Canvas rendering system
 */

import type { Player } from '../player/Player'
import type { Obstacle } from '../obstacles/types'
import type { PowerUp } from '../powerups/types'

export class Renderer {
  private ctx: CanvasRenderingContext2D
  private width: number
  private height: number

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx
    this.width = width
    this.height = height
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  renderBackground(): void {
    // Gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height)
    gradient.addColorStop(0, '#1a1a2e')
    gradient.addColorStop(1, '#0f0f1e')
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  renderGround(y: number): void {
    this.ctx.fillStyle = '#2a2a3e'
    this.ctx.fillRect(0, y, this.width, this.height - y)

    // Ground line
    this.ctx.strokeStyle = '#4a4a6e'
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.moveTo(0, y)
    this.ctx.lineTo(this.width, y)
    this.ctx.stroke()
  }

  renderPlayer(player: Player): void {
    const state = player.getState()

    this.ctx.save()
    this.ctx.fillStyle = state.isInvincible ? '#fbbf24' : '#4f46e5'
    this.ctx.shadowBlur = state.isInvincible ? 20 : 0
    this.ctx.shadowColor = '#fbbf24'

    this.ctx.fillRect(state.position.x, state.position.y, state.size, state.size)

    // Player eyes
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(state.position.x + 8, state.position.y + 10, 6, 6)
    this.ctx.fillRect(state.position.x + 26, state.position.y + 10, 6, 6)

    this.ctx.restore()
  }

  renderObstacle(obstacle: Obstacle): void {
    this.ctx.save()

    const colors: Record<Obstacle['type'], string> = {
      static: '#ef4444',
      moving: '#f59e0b',
      rotating: '#8b5cf6',
      spikes: '#dc2626',
      laser: '#3b82f6',
      breakable: '#10b981',
    }

    this.ctx.fillStyle = colors[obstacle.type]

    if (obstacle.type === 'rotating') {
      this.ctx.translate(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2)
      this.ctx.rotate(obstacle.angle)
      this.ctx.fillRect(-obstacle.width / 2, -obstacle.height / 2, obstacle.width, obstacle.height)
    } else if (obstacle.type === 'laser') {
      if (obstacle.active) {
        this.ctx.globalAlpha = 0.7
        this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
      }
    } else {
      this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
    }

    this.ctx.restore()
  }

  renderPowerUp(powerUp: PowerUp): void {
    if (powerUp.collected) {
      return
    }

    const colors: Record<PowerUp['type'], string> = {
      'double-jump': '#3b82f6',
      invincibility: '#fbbf24',
      'speed-boost': '#10b981',
      'slow-motion': '#8b5cf6',
      'score-multiplier': '#f59e0b',
    }

    this.ctx.save()
    this.ctx.fillStyle = colors[powerUp.type]
    this.ctx.shadowBlur = 10
    this.ctx.shadowColor = colors[powerUp.type]

    this.ctx.beginPath()
    this.ctx.arc(
      powerUp.x + powerUp.width / 2,
      powerUp.y + powerUp.height / 2,
      powerUp.width / 2,
      0,
      Math.PI * 2
    )
    this.ctx.fill()

    this.ctx.restore()
  }

  renderText(
    text: string,
    x: number,
    y: number,
    options: { size?: number; color?: string; align?: CanvasTextAlign } = {}
  ): void {
    const { size = 20, color = '#ffffff', align = 'left' } = options

    this.ctx.save()
    this.ctx.font = `${size}px Arial, sans-serif`
    this.ctx.fillStyle = color
    this.ctx.textAlign = align
    this.ctx.fillText(text, x, y)
    this.ctx.restore()
  }
}
