/**
 * Event bus for decoupled communication
 */

type EventCallback<T = unknown> = (data: T) => void

class EventBus {
  private events: Map<string, Set<EventCallback>> = new Map()

  on<T = unknown>(event: string, callback: EventCallback<T>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }

    const callbacks = this.events.get(event)
    callbacks?.add(callback as EventCallback)

    // Return unsubscribe function
    return () => this.off(event, callback)
  }

  once<T = unknown>(event: string, callback: EventCallback<T>): void {
    const wrappedCallback: EventCallback<T> = data => {
      callback(data)
      this.off(event, wrappedCallback)
    }

    this.on(event, wrappedCallback)
  }

  off<T = unknown>(event: string, callback: EventCallback<T>): void {
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.delete(callback as EventCallback)
      if (callbacks.size === 0) {
        this.events.delete(event)
      }
    }
  }

  emit<T = unknown>(event: string, data?: T): void {
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error)
        }
      })
    }
  }

  clear(event?: string): void {
    if (event) {
      this.events.delete(event)
    } else {
      this.events.clear()
    }
  }

  eventNames(): string[] {
    return Array.from(this.events.keys())
  }

  listenerCount(event: string): number {
    return this.events.get(event)?.size || 0
  }
}

export const eventBus = new EventBus()
export default eventBus
