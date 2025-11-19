/**
 * Terrain generation using noise
 */

import { NoiseGenerator } from './NoiseGenerator'

export interface TerrainConfig {
  width: number
  height: number
  seed?: number
  octaves?: number
  persistence?: number
  scale?: number
}

export type TerrainType = 'water' | 'sand' | 'grass' | 'rock' | 'snow'

export class TerrainGenerator {
  private noise: NoiseGenerator
  private config: Required<TerrainConfig>

  constructor(config: TerrainConfig) {
    this.config = {
      width: config.width,
      height: config.height,
      seed: config.seed ?? Date.now(),
      octaves: config.octaves ?? 4,
      persistence: config.persistence ?? 0.5,
      scale: config.scale ?? 0.01,
    }
    this.noise = new NoiseGenerator(this.config.seed)
  }

  getHeightAt(x: number, y: number): number {
    const nx = x * this.config.scale
    const ny = y * this.config.scale
    return this.noise.octaveNoise2D(nx, ny, this.config.octaves, this.config.persistence)
  }

  getTerrainTypeAt(x: number, y: number): TerrainType {
    const height = this.getHeightAt(x, y)

    if (height < -0.3) return 'water'
    if (height < -0.1) return 'sand'
    if (height < 0.3) return 'grass'
    if (height < 0.6) return 'rock'
    return 'snow'
  }

  generateHeightMap(): number[][] {
    const heightMap: number[][] = []

    for (let y = 0; y < this.config.height; y++) {
      heightMap[y] = []
      for (let x = 0; x < this.config.width; x++) {
        heightMap[y]![x] = this.getHeightAt(x, y)
      }
    }

    return heightMap
  }

  generateTerrainMap(): TerrainType[][] {
    const terrainMap: TerrainType[][] = []

    for (let y = 0; y < this.config.height; y++) {
      terrainMap[y] = []
      for (let x = 0; x < this.config.width; x++) {
        terrainMap[y]![x] = this.getTerrainTypeAt(x, y)
      }
    }

    return terrainMap
  }

  isWalkable(x: number, y: number): boolean {
    const terrainType = this.getTerrainTypeAt(x, y)
    return terrainType !== 'water'
  }
}
