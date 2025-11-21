/**
 * Level Generator - Procedural level generation system
 * FEATURE: Creates dynamic, randomized levels for increased replayability
 */

export interface LevelGeneratorConfig {
  seed?: number
  difficulty: number
  length: number
  obstacleFrequency: number
  powerUpFrequency: number
  coinFrequency: number
  platformFrequency: number
  enemyFrequency: number
  checkpointFrequency: number
  themeVariation: boolean
}

export interface LevelSegment {
  type: 'flat' | 'uphill' | 'downhill' | 'gap' | 'platform' | 'challenge'
  startX: number
  endX: number
  obstacles: ObstacleData[]
  powerUps: PowerUpData[]
  coins: CoinData[]
  platforms: PlatformData[]
  enemies: EnemyData[]
  theme?: string
}

export interface ObstacleData {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  properties?: any
}

export interface PowerUpData {
  id: string
  type: string
  x: number
  y: number
}

export interface CoinData {
  id: string
  x: number
  y: number
  value: number
}

export interface PlatformData {
  id: string
  x: number
  y: number
  width: number
  height: number
  movable?: boolean
  speed?: number
}

export interface EnemyData {
  id: string
  type: string
  x: number
  y: number
  behavior?: string
}

export interface LevelData {
  seed: number
  difficulty: number
  length: number
  segments: LevelSegment[]
  checkpoints: number[]
  startPosition: { x: number; y: number }
  endPosition: { x: number; y: number }
  theme: string
  metadata: {
    generatedAt: Date
    obstacleCount: number
    powerUpCount: number
    coinCount: number
    platformCount: number
    enemyCount: number
    estimatedTime: number
  }
}

export class LevelGenerator {
  private config: LevelGeneratorConfig
  private rng: () => number
  private currentX: number = 0
  private objectIdCounter: number = 0

  constructor(config: LevelGeneratorConfig) {
    this.config = config
    this.rng = this.createSeededRandom(config.seed || Date.now())
  }

  /**
   * Generate complete level
   */
  generate(): LevelData {
    this.currentX = 0
    this.objectIdCounter = 0

    const segments: LevelSegment[] = []
    const checkpoints: number[] = []

    const segmentLength = 500
    const numSegments = Math.ceil(this.config.length / segmentLength)

    // Generate segments
    for (let i = 0; i < numSegments; i++) {
      const segment = this.generateSegment(i, segmentLength)
      segments.push(segment)

      // Add checkpoint
      if (i > 0 && i % this.config.checkpointFrequency === 0) {
        checkpoints.push(segment.startX)
      }
    }

    // Count objects
    let obstacleCount = 0
    let powerUpCount = 0
    let coinCount = 0
    let platformCount = 0
    let enemyCount = 0

    for (const segment of segments) {
      obstacleCount += segment.obstacles.length
      powerUpCount += segment.powerUps.length
      coinCount += segment.coins.length
      platformCount += segment.platforms.length
      enemyCount += segment.enemies.length
    }

    return {
      seed: this.config.seed || Date.now(),
      difficulty: this.config.difficulty,
      length: this.config.length,
      segments,
      checkpoints,
      startPosition: { x: 0, y: 300 },
      endPosition: { x: this.config.length, y: 300 },
      theme: this.selectTheme(),
      metadata: {
        generatedAt: new Date(),
        obstacleCount,
        powerUpCount,
        coinCount,
        platformCount,
        enemyCount,
        estimatedTime: Math.ceil(this.config.length / 200), // Assume 200 units/second
      },
    }
  }

  /**
   * Generate single segment
   */
  private generateSegment(index: number, length: number): LevelSegment {
    const startX = this.currentX
    const endX = startX + length
    const type = this.selectSegmentType()

    const segment: LevelSegment = {
      type,
      startX,
      endX,
      obstacles: [],
      powerUps: [],
      coins: [],
      platforms: [],
      enemies: [],
    }

    // Add theme variation
    if (this.config.themeVariation) {
      segment.theme = this.selectTheme()
    }

    // Generate content based on type
    switch (type) {
      case 'flat':
        this.generateFlatSegment(segment)
        break
      case 'uphill':
        this.generateUphillSegment(segment)
        break
      case 'downhill':
        this.generateDownhillSegment(segment)
        break
      case 'gap':
        this.generateGapSegment(segment)
        break
      case 'platform':
        this.generatePlatformSegment(segment)
        break
      case 'challenge':
        this.generateChallengeSegment(segment)
        break
    }

    this.currentX = endX
    return segment
  }

  /**
   * Generate flat segment
   */
  private generateFlatSegment(segment: LevelSegment): void {
    const { startX, endX } = segment

    // Add obstacles
    const obstacleSpacing = 100 / this.config.obstacleFrequency
    for (let x = startX + obstacleSpacing; x < endX; x += obstacleSpacing) {
      if (this.rng() < this.config.obstacleFrequency) {
        segment.obstacles.push(this.createObstacle(x, 300))
      }
    }

    // Add coins in patterns
    const coinSpacing = 50 / this.config.coinFrequency
    for (let x = startX + coinSpacing; x < endX; x += coinSpacing) {
      if (this.rng() < this.config.coinFrequency) {
        segment.coins.push(this.createCoin(x, 250 - this.rng() * 100))
      }
    }

    // Add occasional power-ups
    if (this.rng() < this.config.powerUpFrequency) {
      const x = startX + this.rng() * (endX - startX)
      segment.powerUps.push(this.createPowerUp(x, 250))
    }

    // Add enemies
    const enemySpacing = 150 / this.config.enemyFrequency
    for (let x = startX + enemySpacing; x < endX; x += enemySpacing) {
      if (this.rng() < this.config.enemyFrequency) {
        segment.enemies.push(this.createEnemy(x, 300))
      }
    }
  }

  /**
   * Generate uphill segment
   */
  private generateUphillSegment(segment: LevelSegment): void {
    const { startX, endX } = segment
    const length = endX - startX

    // Add platforms going up
    const platformCount = Math.floor(length / 100)
    for (let i = 0; i < platformCount; i++) {
      const x = startX + (i * length) / platformCount
      const y = 300 - i * 50
      segment.platforms.push(this.createPlatform(x, y, 80, 20))
    }

    // Add coins following the slope
    for (let i = 0; i < platformCount * 3; i++) {
      const x = startX + (i * length) / (platformCount * 3)
      const y = 280 - (i / (platformCount * 3)) * length * 0.3
      segment.coins.push(this.createCoin(x, y))
    }
  }

  /**
   * Generate downhill segment
   */
  private generateDownhillSegment(segment: LevelSegment): void {
    const { startX, endX } = segment
    const length = endX - startX

    // Similar to uphill but reversed
    const platformCount = Math.floor(length / 100)
    for (let i = 0; i < platformCount; i++) {
      const x = startX + (i * length) / platformCount
      const y = 200 + i * 50
      segment.platforms.push(this.createPlatform(x, y, 80, 20))
    }

    // Add speed boosts going down
    if (this.rng() < 0.5) {
      segment.powerUps.push(this.createPowerUp(startX + length / 2, 250))
    }
  }

  /**
   * Generate gap segment
   */
  private generateGapSegment(segment: LevelSegment): void {
    const { startX, endX } = segment
    const gapWidth = 100 + this.rng() * 150

    // Add platforms before and after gap
    segment.platforms.push(this.createPlatform(startX, 300, 100, 20))
    segment.platforms.push(this.createPlatform(startX + gapWidth + 100, 300, 100, 20))

    // Add coins over the gap
    const coinCount = Math.floor(gapWidth / 30)
    for (let i = 0; i < coinCount; i++) {
      const x = startX + 100 + (i * gapWidth) / coinCount
      const y = 200 - Math.sin((i / coinCount) * Math.PI) * 50
      segment.coins.push(this.createCoin(x, y))
    }
  }

  /**
   * Generate platform segment
   */
  private generatePlatformSegment(segment: LevelSegment): void {
    const { startX, endX } = segment
    const length = endX - startX

    // Add multiple moving platforms
    const platformCount = 3 + Math.floor(this.rng() * 3)
    for (let i = 0; i < platformCount; i++) {
      const x = startX + ((i + 1) * length) / (platformCount + 1)
      const y = 200 + this.rng() * 100
      const platform = this.createPlatform(x, y, 100, 20)
      platform.movable = this.rng() < 0.5
      if (platform.movable) {
        platform.speed = 50 + this.rng() * 50
      }
      segment.platforms.push(platform)
    }

    // Add coins on platforms
    segment.platforms.forEach((platform) => {
      const coinCount = 3
      for (let i = 0; i < coinCount; i++) {
        segment.coins.push(
          this.createCoin(
            platform.x + ((i + 1) * platform.width) / (coinCount + 1),
            platform.y - 30
          )
        )
      }
    })
  }

  /**
   * Generate challenge segment
   */
  private generateChallengeSegment(segment: LevelSegment): void {
    // Combine multiple challenge types
    const { startX, endX } = segment

    // Dense obstacles
    const obstacleCount = 5 + Math.floor(this.rng() * 5)
    for (let i = 0; i < obstacleCount; i++) {
      const x = startX + ((i + 1) * (endX - startX)) / (obstacleCount + 1)
      segment.obstacles.push(this.createObstacle(x, 300))
    }

    // Fast enemies
    const enemyCount = 2 + Math.floor(this.rng() * 2)
    for (let i = 0; i < enemyCount; i++) {
      const x = startX + this.rng() * (endX - startX)
      segment.enemies.push(this.createEnemy(x, 300))
    }

    // High-value power-up as reward
    segment.powerUps.push(this.createPowerUp(startX + (endX - startX) / 2, 200))
  }

  /**
   * Create obstacle
   */
  private createObstacle(x: number, y: number): ObstacleData {
    const types = ['spike', 'block', 'saw', 'wall']
    const type = types[Math.floor(this.rng() * types.length)]

    return {
      id: `obstacle_${this.objectIdCounter++}`,
      type,
      x,
      y,
      width: 30 + this.rng() * 20,
      height: 30 + this.rng() * 20,
    }
  }

  /**
   * Create power-up
   */
  private createPowerUp(x: number, y: number): PowerUpData {
    const types = ['speed', 'shield', 'magnet', 'doubleJump', 'invincibility']
    const type = types[Math.floor(this.rng() * types.length)]

    return {
      id: `powerup_${this.objectIdCounter++}`,
      type,
      x,
      y,
    }
  }

  /**
   * Create coin
   */
  private createCoin(x: number, y: number): CoinData {
    return {
      id: `coin_${this.objectIdCounter++}`,
      x,
      y,
      value: 1,
    }
  }

  /**
   * Create platform
   */
  private createPlatform(x: number, y: number, width: number, height: number): PlatformData {
    return {
      id: `platform_${this.objectIdCounter++}`,
      x,
      y,
      width,
      height,
    }
  }

  /**
   * Create enemy
   */
  private createEnemy(x: number, y: number): EnemyData {
    const types = ['walker', 'flyer', 'jumper']
    const type = types[Math.floor(this.rng() * types.length)]

    return {
      id: `enemy_${this.objectIdCounter++}`,
      type,
      x,
      y,
      behavior: 'patrol',
    }
  }

  /**
   * Select segment type
   */
  private selectSegmentType(): LevelSegment['type'] {
    const rand = this.rng()
    const difficultyFactor = this.config.difficulty

    if (rand < 0.4) return 'flat'
    if (rand < 0.55) return 'uphill'
    if (rand < 0.7) return 'downhill'
    if (rand < 0.8) return 'gap'
    if (rand < 0.9) return 'platform'
    return difficultyFactor > 0.7 ? 'challenge' : 'flat'
  }

  /**
   * Select theme
   */
  private selectTheme(): string {
    const themes = ['forest', 'desert', 'snow', 'city', 'cave']
    return themes[Math.floor(this.rng() * themes.length)]
  }

  /**
   * Create seeded random number generator
   */
  private createSeededRandom(seed: number): () => number {
    let state = seed
    return () => {
      state = (state * 9301 + 49297) % 233280
      return state / 233280
    }
  }

  /**
   * Export level data
   */
  exportLevel(level: LevelData): string {
    return JSON.stringify(level, null, 2)
  }

  /**
   * Import level data
   */
  importLevel(json: string): LevelData {
    return JSON.parse(json)
  }
}

export default LevelGenerator
