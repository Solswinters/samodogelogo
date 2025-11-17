/**
 * Simple event emitter utility
 */

type EventHandler<T = unknown> = (data: T) => void

export class EventEmitter<Events extends Record<string, unknown> = Record<string, unknown>> {
  private events: Map<keyof Events, Set<EventHandler>> = new Map()

  on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }

    this.events.get(event)!.add(handler as EventHandler)

    return () => this.off(event, handler)
  }

  off<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void {
    const handlers = this.events.get(event)
    if (handlers) {
      handlers.delete(handler as EventHandler)
    }
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    const handlers = this.events.get(event)
    if (handlers) {
      handlers.forEach(handler => handler(data))
    }
  }

  once<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): () => void {
    const wrapper = (data: Events[K]) => {
      handler(data)
      this.off(event, wrapper)
    }

    return this.on(event, wrapper)
  }

  removeAllListeners(event?: keyof Events): void {
    if (event) {
      this.events.delete(event)
    } else {
      this.events.clear()
    }
  }

  listenerCount(event: keyof Events): number {
    return this.events.get(event)?.size ?? 0
  }
}
