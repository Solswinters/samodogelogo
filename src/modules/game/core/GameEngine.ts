/**
 * Core game engine orchestrator
 */

import { GameLoop } from '../loop/GameLoop'
import { Player } from '../player/Player'
import { ObstaclePoolManager } from '../obstacles/pool'
import { DifficultyManager } from '../difficulty/DifficultyManager'
import { ScoreManager } from '../scoring/ScoreManager'
import { GameStateMachine } from '../state/GameStateMachine'
import { inputManager } from '../input/InputManager'
import { soundManager } from '../audio/SoundManager'
import { achievementManager } from '../achievements/AchievementManager'
import { Background } from '../background/Background'
import { Quadtree } from '../physics/spatial/quadtree'
import type { Obstacle } from '../obstacles/types'
import { updateObstacle, isObstacleOffscreen } from '../obstacles/updater'
import { checkAABBCollision } from '../physics/collision/aabb'

export class GameEngine {
  private gameLoop: GameLoop
  private player: Player
  private obstaclePool: ObstaclePoolManager
  private difficultyManager: DifficultyManager
  private scoreManager: ScoreManager
  private stateMachine: GameStateMachine
  private background: Background
  private quadtree: Quadtree<Obstacle>
  private isInitialized: boolean = false
  private lastSpawnTime: number = 0

  constructor() {
    this.player = new Player()
    this.obstaclePool = new ObstaclePoolManager()
    this.difficultyManager = new DifficultyManager()
    this.scoreManager = new ScoreManager()
    this.stateMachine = new GameStateMachine()
    this.background = new Background()
    this.quadtree = new Quadtree({ x: 0, y: 0, width: 1600, height: 600 })

    this.gameLoop = new GameLoop(
      deltaTime => this.update(deltaTime),
      _alpha => this.render()
    )
  }

  initialize(): void {
    if (this.isInitialized) {
      return
    }

    inputManager.initialize()
    soundManager.initialize()
    achievementManager.initialize()

    inputManager.on('jump', () => this.handleJump())
    inputManager.on('pause', () => this.handlePause())

    this.stateMachine.onEnter('playing', () => this.onGameStart())
    this.stateMachine.onEnter('game-over', () => this.onGameEnd())

    this.isInitialized = true
  }

  start(): void {
    this.stateMachine.transition('playing')
    this.gameLoop.start()
  }

  stop(): void {
    this.gameLoop.stop()
  }

  private onGameStart(): void {
    this.player.reset()
    this.obstaclePool.clear()
    this.scoreManager.reset()
    this.difficultyManager.reset()
    this.background.reset()
    this.lastSpawnTime = 0

    soundManager.playMusic('gameplay')
    achievementManager.trigger({ type: 'special', id: 'first-jump' })
  }

  private onGameEnd(): void {
    const finalScore = this.scoreManager.getCurrentScore()
    const highScore = this.scoreManager.getHighScore()

    soundManager.playSound('game-over')
    soundManager.stopMusic()

    achievementManager.trigger({ type: 'score', value: finalScore })

    if (finalScore === highScore) {
      // New high score!
    }
  }

  private update(deltaTime: number): void {
    if (!this.stateMachine.is('playing')) {
      return
    }

    // Update core systems
    this.player.update(deltaTime)
    this.difficultyManager.update(deltaTime)
    this.background.update(5, deltaTime)

    // Spawn obstacles
    this.spawnObstacles(deltaTime)

    // Update obstacles
    this.updateObstacles(deltaTime)

    // Check collisions
    this.checkCollisions()

    // Update score
    achievementManager.trigger({
      type: 'time',
      value: Math.floor(this.difficultyManager.getSurvivalTime() / 1000),
    })
  }

  private spawnObstacles(deltaTime: number): void {
    const now = Date.now()
    const spawnRate = this.difficultyManager.getCurrentConfig().spawnRate

    if (now - this.lastSpawnTime > spawnRate) {
      const obstacle = this.obstaclePool.acquire(800)
      this.lastSpawnTime = now
    }
  }

  private updateObstacles(deltaTime: number): void {
    const active = this.obstaclePool.getActive()

    for (let i = active.length - 1; i >= 0; i--) {
      const obstacle = active[i]
      if (!obstacle) continue

      updateObstacle(obstacle, deltaTime)

      if (isObstacleOffscreen(obstacle, 800)) {
        this.obstaclePool.release(obstacle)
        if (!obstacle.passed) {
          obstacle.passed = true
          this.scoreManager.addPoints(10)
          soundManager.playSound('score')
          achievementManager.trigger({ type: 'obstacles', value: 1 })
        }
      }
    }
  }

  private checkCollisions(): void {
    const playerBounds = this.player.getBounds()
    const obstacles = this.obstaclePool.getActive()

    for (const obstacle of obstacles) {
      if (checkAABBCollision(playerBounds, obstacle)) {
        this.handleCollision()
        break
      }
    }
  }

  private handleCollision(): void {
    this.player.die()
    this.stateMachine.transition('game-over')
  }

  private handleJump(): void {
    if (this.player.jump()) {
      soundManager.playSound('jump')
    }
  }

  private handlePause(): void {
    if (this.stateMachine.is('playing')) {
      this.stateMachine.transition('paused')
      this.gameLoop.stop()
    } else if (this.stateMachine.is('paused')) {
      this.stateMachine.transition('playing')
      this.gameLoop.start()
    }
  }

  private render(): void {
    // Rendering will be handled by React components
  }

  cleanup(): void {
    this.gameLoop.stop()
    inputManager.cleanup()
    soundManager.cleanup()
  }

  getPlayer(): Player {
    return this.player
  }

  getObstacles(): Obstacle[] {
    return this.obstaclePool.getActive()
  }

  getScore(): number {
    return this.scoreManager.getCurrentScore()
  }

  getState(): string {
    return this.stateMachine.getCurrentState()
  }
}
