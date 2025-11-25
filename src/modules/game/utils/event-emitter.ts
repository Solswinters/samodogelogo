/**
 * Simple event emitter for game events
 */

type EventCallback = (...args: unknown[]) => void

export class EventEmitter {
  private events: Map<string, Set<EventCallback>> = new Map()

  on(event: string, callback: EventCallback): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    this.events.get(event)?.add(callback)
  }

  off(event: string, callback: EventCallback): void {
    this.events.get(event)?.delete(callback)
  }

  once(event: string, callback: EventCallback): void {
    const wrappedCallback = (...args: unknown[]) => {
      callback(...args)
      this.off(event, wrappedCallback)
    }
    this.on(event, wrappedCallback)
  }

  emit(event: string, ...args: unknown[]): void {
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(...args)
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error)
        }
      })
    }
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.events.delete(event)
    } else {
      this.events.clear()
    }
  }

  listenerCount(event: string): number {
    return this.events.get(event)?.size ?? 0
  }

  eventNames(): string[] {
    return Array.from(this.events.keys())
  }
}

// Global game event emitter
/**
 * gameEvents utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of gameEvents.
 */
export const gameEvents = new EventEmitter()

// Common game events
/**
 * GAME_EVENTS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of GAME_EVENTS.
 */
export const GAME_EVENTS = {
  PLAYER_JUMP: 'player:jump',
  PLAYER_COLLISION: 'player:collision',
  PLAYER_DEATH: 'player:death',
  SCORE_UPDATE: 'score:update',
  OBSTACLE_CLEARED: 'obstacle:cleared',
  GAME_START: 'game:start',
  GAME_PAUSE: 'game:pause',
  GAME_RESUME: 'game:resume',
  GAME_OVER: 'game:over',
  POWER_UP_COLLECTED: 'powerup:collected',
  ACHIEVEMENT_UNLOCKED: 'achievement:unlocked',
  LEVEL_UP: 'level:up',
} as const
