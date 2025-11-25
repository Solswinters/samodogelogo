/**
 * Game Utility Functions
 * Common utility functions used throughout the game
 */

import type { Position, Velocity, BoundingBox, Color } from '../modules/game/types/game-types'

// Math Utilities

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1)
}

/**
 * Inverse linear interpolation - returns the t value
 */
export function inverseLerp(start: number, end: number, value: number): number {
  return clamp((value - start) / (end - start), 0, 1)
}

/**
 * Map a value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return lerp(outMin, outMax, inverseLerp(inMin, inMax, value))
}

/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generate a random float between min and max
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * Pick a random element from an array
 */
export function pickRandom<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Calculate distance between two points
 */
export function distance(p1: Position, p2: Position): number {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Calculate squared distance between two points (faster, no sqrt)
 */
export function distanceSquared(p1: Position, p2: Position): number {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return dx * dx + dy * dy
}

/**
 * Calculate angle between two points in radians
 */
export function angleBetween(p1: Position, p2: Position): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x)
}

/**
 * Normalize an angle to be between 0 and 2π
 */
export function normalizeAngle(angle: number): number {
  while (angle < 0) angle += Math.PI * 2
  while (angle >= Math.PI * 2) angle -= Math.PI * 2
  return angle
}

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}

// Vector Utilities

/**
 * Add two vectors
 */
export function vectorAdd(v1: Velocity, v2: Velocity): Velocity {
  return { x: v1.x + v2.x, y: v1.y + v2.y }
}

/**
 * Subtract two vectors
 */
export function vectorSubtract(v1: Velocity, v2: Velocity): Velocity {
  return { x: v1.x - v2.x, y: v1.y - v2.y }
}

/**
 * Multiply a vector by a scalar
 */
export function vectorMultiply(v: Velocity, scalar: number): Velocity {
  return { x: v.x * scalar, y: v.y * scalar }
}

/**
 * Calculate the magnitude (length) of a vector
 */
export function vectorMagnitude(v: Velocity): number {
  return Math.sqrt(v.x * v.x + v.y * v.y)
}

/**
 * Normalize a vector to unit length
 */
export function vectorNormalize(v: Velocity): Velocity {
  const mag = vectorMagnitude(v)
  if (mag === 0) return { x: 0, y: 0 }
  return { x: v.x / mag, y: v.y / mag }
}

/**
 * Calculate dot product of two vectors
 */
export function vectorDot(v1: Velocity, v2: Velocity): number {
  return v1.x * v2.x + v1.y * v2.y
}

/**
 * Limit the magnitude of a vector
 */
export function vectorLimit(v: Velocity, max: number): Velocity {
  const mag = vectorMagnitude(v)
  if (mag > max) {
    return vectorMultiply(vectorNormalize(v), max)
  }
  return v
}

// Collision Detection

/**
 * Check if two bounding boxes overlap
 */
export function checkCollision(box1: BoundingBox, box2: BoundingBox): boolean {
  return (
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.y + box1.height > box2.y
  )
}

/**
 * Check if a point is inside a bounding box
 */
export function pointInBox(point: Position, box: BoundingBox): boolean {
  return (
    point.x >= box.x &&
    point.x <= box.x + box.width &&
    point.y >= box.y &&
    point.y <= box.y + box.height
  )
}

/**
 * Check if a point is inside a circle
 */
export function pointInCircle(point: Position, center: Position, radius: number): boolean {
  return distanceSquared(point, center) <= radius * radius
}

/**
 * Check if two circles overlap
 */
export function circleCollision(p1: Position, r1: number, p2: Position, r2: number): boolean {
  const radiusSum = r1 + r2
  return distanceSquared(p1, p2) <= radiusSum * radiusSum
}

/**
 * Get the overlap area between two bounding boxes
 */
export function getCollisionOverlap(box1: BoundingBox, box2: BoundingBox): BoundingBox | null {
  if (!checkCollision(box1, box2)) return null

  const x = Math.max(box1.x, box2.x)
  const y = Math.max(box1.y, box2.y)
  const width = Math.min(box1.x + box1.width, box2.x + box2.width) - x
  const height = Math.min(box1.y + box1.height, box2.y + box2.height) - y

  return { x, y, width, height }
}

// Color Utilities

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): Color | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Convert RGB color to hex
 */
export function rgbToHex(color: Color): string {
  const toHex = (c: number) => {
    const hex = Math.round(c).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`
}

/**
 * Convert RGB to CSS rgba string
 */
export function rgbaToCss(color: Color): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ?? 1})`
}

/**
 * Interpolate between two colors
 */
export function colorLerp(c1: Color, c2: Color, t: number): Color {
  return {
    r: lerp(c1.r, c2.r, t),
    g: lerp(c1.g, c2.g, t),
    b: lerp(c1.b, c2.b, t),
    a: lerp(c1.a ?? 1, c2.a ?? 1, t),
  }
}

// Time Utilities

/**
 * Format milliseconds to human-readable time string
 */
export function formatTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const sec = (seconds % 60).toString().padStart(2, '0')
  const min = (minutes % 60).toString().padStart(2, '0')

  if (hours > 0) {
    return `${hours}:${min}:${sec}`
  }
  return `${min}:${sec}`
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle a function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

// Array Utilities

/**
 * Chunk an array into smaller arrays of specified size
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Remove duplicates from an array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

/**
 * Group array elements by a key function
 */
export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce(
    (acc, item) => {
      const key = keyFn(item)
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    },
    {} as Record<string, T[]>
  )
}

// Number Utilities

/**
 * Format a number with commas as thousand separators
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Abbreviate large numbers (e.g., 1000 -> 1K)
 */
export function abbreviateNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

/**
 * Round a number to specified decimal places
 */
export function roundTo(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(num * factor) / factor
}

// String Utilities

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert camelCase to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * Convert snake_case to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Truncate a string to a maximum length with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

// Storage Utilities

/**
 * Safely get an item from localStorage
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * Safely set an item in localStorage
 */
export function setLocalStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/**
 * Remove an item from localStorage
 */
export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // Fail silently
  }
}

// Easing Functions

/**
 * easing utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of easing.
 */
export const easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
  easeInOutQuart: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  easeInSine: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t: number) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
} as const

// Performance Utilities

/**
 * Simple performance monitor
 */
export class PerformanceMonitor {
  private samples: number[] = []
  private maxSamples: number

  constructor(maxSamples: number = 60) {
    this.maxSamples = maxSamples
  }

  addSample(value: number): void {
    this.samples.push(value)
    if (this.samples.length > this.maxSamples) {
      this.samples.shift()
    }
  }

  getAverage(): number {
    if (this.samples.length === 0) return 0
    return this.samples.reduce((sum, val) => sum + val, 0) / this.samples.length
  }

  getMin(): number {
    return this.samples.length > 0 ? Math.min(...this.samples) : 0
  }

  getMax(): number {
    return this.samples.length > 0 ? Math.max(...this.samples) : 0
  }

  reset(): void {
    this.samples = []
  }
}

// Object Pool

export class ObjectPool<T> {
  private available: T[] = []
  private inUse: Set<T> = new Set()
  private factory: () => T
  private reset: (obj: T) => void

  constructor(factory: () => T, reset: (obj: T) => void, initialSize: number = 0) {
    this.factory = factory
    this.reset = reset

    for (let i = 0; i < initialSize; i++) {
      this.available.push(factory())
    }
  }

  acquire(): T {
    let obj: T
    if (this.available.length > 0) {
      obj = this.available.pop()!
    } else {
      obj = this.factory()
    }
    this.inUse.add(obj)
    return obj
  }

  release(obj: T): void {
    if (this.inUse.has(obj)) {
      this.inUse.delete(obj)
      this.reset(obj)
      this.available.push(obj)
    }
  }

  releaseAll(): void {
    this.inUse.forEach((obj) => {
      this.reset(obj)
      this.available.push(obj)
    })
    this.inUse.clear()
  }

  getStats(): { available: number; inUse: number; total: number } {
    return {
      available: this.available.length,
      inUse: this.inUse.size,
      total: this.available.length + this.inUse.size,
    }
  }
}
