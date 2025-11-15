/**
 * Game difficulty management
 */

import { GAME_CONSTANTS } from '@/constants/game'

export interface DifficultyConfig {
  level: number
  speedMultiplier: number
  obstacleFrequency: number
  name: string
}

export const DIFFICULTY_LEVELS: Record<number, DifficultyConfig> = {
  1: {
    level: 1,
    speedMultiplier: 1.0,
    obstacleFrequency: 1.0,
    name: 'Easy',
  },
  2: {
    level: 2,
    speedMultiplier: 1.2,
    obstacleFrequency: 1.1,
    name: 'Normal',
  },
  3: {
    level: 3,
    speedMultiplier: 1.4,
    obstacleFrequency: 1.2,
    name: 'Hard',
  },
  4: {
    level: 4,
    speedMultiplier: 1.6,
    obstacleFrequency: 1.3,
    name: 'Expert',
  },
  5: {
    level: 5,
    speedMultiplier: 1.8,
    obstacleFrequency: 1.4,
    name: 'Master',
  },
}

export function getDifficultyLevel(gameTime: number): number {
  const secondsPlayed = Math.floor(gameTime / 1000)
  const level = Math.floor(secondsPlayed / 30) + 1
  return Math.min(level, GAME_CONSTANTS.MAX_DIFFICULTY)
}

export function getDifficultyConfig(level: number): DifficultyConfig {
  return DIFFICULTY_LEVELS[level] ?? DIFFICULTY_LEVELS[GAME_CONSTANTS.MAX_DIFFICULTY]
}

export function getGameSpeed(baseSpeed: number, difficulty: number): number {
  const config = getDifficultyConfig(difficulty)
  return baseSpeed * config.speedMultiplier
}

export function getObstacleSpawnRate(baseRate: number, difficulty: number): number {
  const config = getDifficultyConfig(difficulty)
  return baseRate / config.obstacleFrequency
}

export function getDifficultyName(level: number): string {
  return getDifficultyConfig(level).name
}

export function calculateDifficultyScore(difficulty: number): number {
  return difficulty * 100
}
