/**
 * Simple event bus for decoupled communication
 */

type EventCallback = (data?: unknown) => void

class EventBus {
  private events: Map<string, EventCallback[]> = new Map()

  on(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(callback)

    // Return unsubscribe function
    return () => this.off(event, callback)
  }

  off(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event)
    if (!callbacks) return

    const index = callbacks.indexOf(callback)
    if (index > -1) {
      callbacks.splice(index, 1)
    }
  }

  emit(event: string, data?: unknown): void {
    const callbacks = this.events.get(event)
    if (!callbacks) return

    callbacks.forEach((callback) => callback(data))
  }

  once(event: string, callback: EventCallback): void {
    const onceCallback: EventCallback = (data) => {
      callback(data)
      this.off(event, onceCallback)
    }
    this.on(event, onceCallback)
  }

  clear(event?: string): void {
    if (event) {
      this.events.delete(event)
    } else {
      this.events.clear()
    }
  }
}

export const eventBus = new EventBus()
