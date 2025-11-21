/**
 * Level Generator - Procedural level generation
 */

export interface LevelSegment {
  obstacles: Array<{ x: number; y: number; type: string }>
  coins: Array<{ x: number; y: number; value: number }>
  powerups: Array<{ x: number; y: number; type: string }>
  difficulty: number
}

export class LevelGenerator {
  private difficulty: number = 1
  private segmentLength: number = 800

  generateSegment(): LevelSegment {
    const obstacles = this.generateObstacles()
    const coins = this.generateCoins()
    const powerups = this.generatePowerups()

    return { obstacles, coins, powerups, difficulty: this.difficulty }
  }

  private generateObstacles(): Array<{ x: number; y: number; type: string }> {
    const count = Math.floor(3 + this.difficulty * 2)
    const obstacles = []
    for (let i = 0; i < count; i++) {
      obstacles.push({
        x: Math.random() * this.segmentLength,
        y: 300 + Math.random() * 200,
        type: Math.random() > 0.5 ? 'spike' : 'block',
      })
    }
    return obstacles
  }

  private generateCoins(): Array<{ x: number; y: number; value: number }> {
    const count = Math.floor(5 + Math.random() * 10)
    const coins = []
    for (let i = 0; i < count; i++) {
      coins.push({
        x: Math.random() * this.segmentLength,
        y: 200 + Math.random() * 300,
        value: Math.random() > 0.9 ? 5 : 1,
      })
    }
    return coins
  }

  private generatePowerups(): Array<{ x: number; y: number; type: string }> {
    if (Math.random() > 0.7) {
      return [
        {
          x: Math.random() * this.segmentLength,
          y: 250 + Math.random() * 200,
          type: Math.random() > 0.5 ? 'shield' : 'magnet',
        },
      ]
    }
    return []
  }

  setDifficulty(difficulty: number): void {
    this.difficulty = Math.max(1, Math.min(difficulty, 10))
  }

  getDifficulty(): number {
    return this.difficulty
  }

  setSegmentLength(length: number): void {
    this.segmentLength = length
  }
}

export default LevelGenerator
