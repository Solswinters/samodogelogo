/**
 * Game Loop Performance Tests - Performance tests for game loop
 * HIGH PRIORITY: Performance testing for 60fps target
 */

import { GameLoop } from './GameLoop'

describe('GameLoop Performance Tests', () => {
  let gameLoop: GameLoop
  let updateCalls: number
  let renderCalls: number

  const mockUpdate = jest.fn((deltaTime: number) => {
    updateCalls++
  })

  const mockRender = jest.fn((interpolation: number) => {
    renderCalls++
  })

  beforeEach(() => {
    updateCalls = 0
    renderCalls = 0

    gameLoop = new GameLoop({
      targetFPS: 60,
      maxFrameTime: 100,
      enableProfiling: true,
    })
  })

  afterEach(() => {
    gameLoop.stop()
  })

  describe('Frame Rate', () => {
    it('should maintain 60 FPS target', (done) => {
      gameLoop.start(mockUpdate, mockRender)

      setTimeout(() => {
        gameLoop.stop()
        const fps = gameLoop.getFPS()

        // Allow 10% tolerance
        expect(fps).toBeGreaterThanOrEqual(54)
        expect(fps).toBeLessThanOrEqual(66)
        done()
      }, 1000) // Test for 1 second
    }, 2000)

    it('should calculate accurate average FPS', (done) => {
      gameLoop.start(mockUpdate, mockRender)

      setTimeout(() => {
        gameLoop.stop()
        const avgFPS = gameLoop.getAverageFPS()

        expect(avgFPS).toBeGreaterThan(0)
        expect(avgFPS).toBeLessThanOrEqual(60)
        done()
      }, 1000)
    }, 2000)
  })

  describe('Update and Render Calls', () => {
    it('should call update function regularly', (done) => {
      gameLoop.start(mockUpdate, mockRender)

      setTimeout(() => {
        gameLoop.stop()

        // Should have called update approximately 60 times in 1 second
        expect(updateCalls).toBeGreaterThan(50)
        expect(updateCalls).toBeLessThan(70)
        done()
      }, 1000)
    }, 2000)

    it('should call render function regularly', (done) => {
      gameLoop.start(mockUpdate, mockRender)

      setTimeout(() => {
        gameLoop.stop()

        // Should have called render approximately 60 times in 1 second
        expect(renderCalls).toBeGreaterThan(50)
        expect(renderCalls).toBeLessThan(70)
        done()
      }, 1000)
    }, 2000)

    it('should pass deltaTime to update function', () => {
      gameLoop.start(mockUpdate, mockRender)

      setTimeout(() => {
        gameLoop.stop()

        expect(mockUpdate).toHaveBeenCalled()
        const firstCall = mockUpdate.mock.calls[0]
        expect(firstCall[0]).toBeGreaterThan(0)
      }, 100)
    })
  })

  describe('Performance Metrics', () => {
    it('should track loop statistics', (done) => {
      gameLoop.start(mockUpdate, mockRender)

      setTimeout(() => {
        gameLoop.stop()
        const stats = gameLoop.getLoopStats()

        expect(stats.frameCount).toBeGreaterThan(0)
        expect(stats.updateCount).toBeGreaterThan(0)
        expect(stats.renderCount).toBeGreaterThan(0)
        expect(stats.totalTime).toBeGreaterThan(0)
        done()
      }, 500)
    }, 1000)

    it('should track performance metrics when profiling enabled', (done) => {
      gameLoop.start(mockUpdate, mockRender)

      setTimeout(() => {
        gameLoop.stop()
        const metrics = gameLoop.getPerformanceMetrics()

        expect(metrics.averageFrameTime).toBeGreaterThan(0)
        expect(metrics.averageUpdateTime).toBeGreaterThan(0)
        expect(metrics.averageRenderTime).toBeGreaterThan(0)
        done()
      }, 500)
    }, 1000)

    it('should detect dropped frames', (done) => {
      // Create a slow update function
      const slowUpdate = () => {
        const start = Date.now()
        while (Date.now() - start < 20) {} // Block for 20ms
      }

      gameLoop.start(slowUpdate, mockRender)

      setTimeout(() => {
        gameLoop.stop()
        const stats = gameLoop.getLoopStats()

        // Should have some dropped frames with slow update
        expect(stats.droppedFrames).toBeGreaterThan(0)
        done()
      }, 500)
    }, 1000)
  })

  describe('Pause and Resume', () => {
    it('should stop calling update/render when paused', (done) => {
      gameLoop.start(mockUpdate, mockRender)

      setTimeout(() => {
        const callsBeforePause = updateCalls
        gameLoop.pause()

        setTimeout(() => {
          const callsAfterPause = updateCalls
          expect(callsAfterPause).toBe(callsBeforePause)

          gameLoop.stop()
          done()
        }, 100)
      }, 100)
    }, 500)

    it('should resume calling update/render after pause', (done) => {
      gameLoop.start(mockUpdate, mockRender)

      gameLoop.pause()

      setTimeout(() => {
        const callsWhilePaused = updateCalls
        gameLoop.resume()

        setTimeout(() => {
          const callsAfterResume = updateCalls
          expect(callsAfterResume).toBeGreaterThan(callsWhilePaused)

          gameLoop.stop()
          done()
        }, 100)
      }, 100)
    }, 500)
  })

  describe('Adaptive Timestep', () => {
    it('should handle variable frame times', (done) => {
      let callIndex = 0
      const variableUpdate = () => {
        // Alternate between fast and slow
        if (callIndex % 2 === 0) {
          const start = Date.now()
          while (Date.now() - start < 10) {}
        }
        callIndex++
      }

      gameLoop.start(variableUpdate, mockRender)

      setTimeout(() => {
        gameLoop.stop()
        const metrics = gameLoop.getPerformanceMetrics()

        expect(metrics.minFrameTime).toBeLessThan(metrics.maxFrameTime)
        done()
      }, 500)
    }, 1000)
  })

  describe('Memory Efficiency', () => {
    it('should not leak memory during long runs', (done) => {
      const initialMemory = process.memoryUsage().heapUsed

      gameLoop.start(mockUpdate, mockRender)

      setTimeout(() => {
        gameLoop.stop()
        const finalMemory = process.memoryUsage().heapUsed
        const memoryGrowth = finalMemory - initialMemory

        // Memory growth should be minimal (less than 10MB)
        expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024)
        done()
      }, 2000)
    }, 3000)
  })

  describe('Configuration', () => {
    it('should respect custom target FPS', (done) => {
      const customLoop = new GameLoop({ targetFPS: 30 })
      customLoop.start(mockUpdate, mockRender)

      setTimeout(() => {
        customLoop.stop()
        const fps = customLoop.getFPS()

        // Allow tolerance
        expect(fps).toBeGreaterThanOrEqual(27)
        expect(fps).toBeLessThanOrEqual(33)
        done()
      }, 1000)
    }, 2000)
  })
})
