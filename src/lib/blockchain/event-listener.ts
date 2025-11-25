import { logger } from '@/lib/logger'

export type EventCallback = (data: unknown) => void

export interface ContractEvent {
  eventName: string
  address: string
  blockNumber: number
  transactionHash: string
  data: unknown
}

export class EventListener {
  private listeners: Map<string, Set<EventCallback>> = new Map()
  private isListening = false

  subscribe(eventName: string, callback: EventCallback): () => void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set())
    }

    this.listeners.get(eventName)!.add(callback)

    logger.info(`Subscribed to event: ${eventName}`)

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventName)
      if (callbacks) {
        callbacks.delete(callback)
        if (callbacks.size === 0) {
          this.listeners.delete(eventName)
        }
      }
      logger.info(`Unsubscribed from event: ${eventName}`)
    }
  }

  emit(event: ContractEvent): void {
    const callbacks = this.listeners.get(event.eventName)
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(event.data)
        } catch (error) {
          logger.error(`Error in event callback for ${event.eventName}:`, error)
        }
      })
    }
  }

  async startListening(contractAddress: string, events: string[]): Promise<void> {
    if (this.isListening) {
      logger.warn('Already listening to events')
      return
    }

    this.isListening = true
    logger.info(`Started listening to events for contract: ${contractAddress}`)

    // In a real implementation, this would set up Web3 event listeners
    // For now, just log that we're listening
    events.forEach((event) => {
      logger.info(`Listening for event: ${event}`)
    })
  }

  stopListening(): void {
    this.isListening = false
    logger.info('Stopped listening to events')
  }

  removeAllListeners(): void {
    this.listeners.clear()
    this.stopListening()
    logger.info('Removed all event listeners')
  }

  getListenerCount(eventName?: string): number {
    if (eventName) {
      return this.listeners.get(eventName)?.size ?? 0
    }
    return Array.from(this.listeners.values()).reduce((sum, callbacks) => sum + callbacks.size, 0)
  }
}

// Singleton instance
/**
 * eventListener utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of eventListener.
 */
export const eventListener = new EventListener()
