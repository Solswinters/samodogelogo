/**
 * Noise generation for procedural content
 */

export class NoiseGenerator {
  private permutation: number[]

  constructor(seed = 0) {
    this.permutation = this.generatePermutation(seed)
  }

  private generatePermutation(seed: number): number[] {
    const p: number[] = []
    for (let i = 0; i < 256; i++) {
      p[i] = i
    }

    // Shuffle using seed
    let n = seed
    for (let i = 255; i > 0; i--) {
      n = (n * 16807) % 2147483647
      const j = Math.floor((n / 2147483647) * (i + 1))
      ;[p[i], p[j]] = [p[j] as number, p[i] as number]
    }

    // Duplicate for wrapping
    return [...p, ...p]
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a)
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 3
    const u = h < 2 ? x : y
    const v = h < 2 ? y : x
    return (h & 1 ? -u : u) + (h & 2 ? -v : v)
  }

  noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255

    x -= Math.floor(x)
    y -= Math.floor(y)

    const u = this.fade(x)
    const v = this.fade(y)

    const a = (this.permutation[X] ?? 0) + Y
    const b = (this.permutation[X + 1] ?? 0) + Y

    return this.lerp(
      v,
      this.lerp(
        u,
        this.grad(this.permutation[a] ?? 0, x, y),
        this.grad(this.permutation[b] ?? 0, x - 1, y)
      ),
      this.lerp(
        u,
        this.grad(this.permutation[a + 1] ?? 0, x, y - 1),
        this.grad(this.permutation[b + 1] ?? 0, x - 1, y - 1)
      )
    )
  }

  octaveNoise2D(x: number, y: number, octaves: number, persistence: number): number {
    let total = 0
    let frequency = 1
    let amplitude = 1
    let maxValue = 0

    for (let i = 0; i < octaves; i++) {
      total += this.noise2D(x * frequency, y * frequency) * amplitude
      maxValue += amplitude
      amplitude *= persistence
      frequency *= 2
    }

    return total / maxValue
  }
}
