/**
 * Data compression utilities for efficient network transmission
 */

/**
 * compressPosition utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of compressPosition.
 */
export function compressPosition(x: number, y: number, precision = 10): number {
  const maxValue = Math.pow(2, 15) - 1
  const scaledX = Math.round((x / 10000) * maxValue)
  const scaledY = Math.round((y / 10000) * maxValue)
  return (scaledX << 16) | (scaledY & 0xffff)
}

/**
 * decompressPosition utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of decompressPosition.
 */
export function decompressPosition(compressed: number, precision = 10): { x: number; y: number } {
  const maxValue = Math.pow(2, 15) - 1
  const scaledX = (compressed >> 16) & 0xffff
  const scaledY = compressed & 0xffff
  return {
    x: (scaledX / maxValue) * 10000,
    y: (scaledY / maxValue) * 10000,
  }
}

/**
 * compressAngle utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of compressAngle.
 */
export function compressAngle(angle: number): number {
  const normalized = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
  return Math.round((normalized / (2 * Math.PI)) * 255)
}

/**
 * decompressAngle utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of decompressAngle.
 */
export function decompressAngle(compressed: number): number {
  return (compressed / 255) * 2 * Math.PI
}

/**
 * compressVelocity utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of compressVelocity.
 */
export function compressVelocity(vx: number, vy: number, maxVelocity = 1000): number {
  const scale = 127 / maxVelocity
  const compressedX = Math.round(vx * scale) & 0xff
  const compressedY = Math.round(vy * scale) & 0xff
  return (compressedX << 8) | compressedY
}

/**
 * decompressVelocity utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of decompressVelocity.
 */
export function decompressVelocity(
  compressed: number,
  maxVelocity = 1000
): { vx: number; vy: number } {
  const scale = 127 / maxVelocity
  let compressedX = (compressed >> 8) & 0xff
  let compressedY = compressed & 0xff

  // Convert to signed
  if (compressedX > 127) compressedX -= 256
  if (compressedY > 127) compressedY -= 256

  return {
    vx: compressedX / scale,
    vy: compressedY / scale,
  }
}

/**
 * deltaCompress utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of deltaCompress.
 */
export function deltaCompress(current: number[], previous: number[]): number[] {
  if (current.length !== previous.length) {
    return current
  }

  return current.map((value, index) => value - previous[index])
}

/**
 * deltaDecompress utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of deltaDecompress.
 */
export function deltaDecompress(delta: number[], previous: number[]): number[] {
  if (delta.length !== previous.length) {
    return delta
  }

  return delta.map((value, index) => value + previous[index])
}
