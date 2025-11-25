/**
 * Wallet interaction analytics service
 */

import { type Address } from 'viem'

export interface WalletEvent {
  type: 'connect' | 'disconnect' | 'transaction' | 'sign' | 'switch_network'
  address?: Address
  chainId?: number
  timestamp: number
  metadata?: Record<string, unknown>
}

export class WalletAnalytics {
  private events: WalletEvent[]
  private maxEvents = 1000

  constructor() {
    this.events = []
  }

  trackConnect(address: Address, chainId: number): void {
    this.addEvent({
      type: 'connect',
      address,
      chainId,
      timestamp: Date.now(),
    })
  }

  trackDisconnect(address: Address): void {
    this.addEvent({
      type: 'disconnect',
      address,
      timestamp: Date.now(),
    })
  }

  trackTransaction(address: Address, txHash: string, chainId: number): void {
    this.addEvent({
      type: 'transaction',
      address,
      chainId,
      timestamp: Date.now(),
      metadata: { txHash },
    })
  }

  trackSign(address: Address, message: string): void {
    this.addEvent({
      type: 'sign',
      address,
      timestamp: Date.now(),
      metadata: { messageLength: message.length },
    })
  }

  trackNetworkSwitch(address: Address, fromChainId: number, toChainId: number): void {
    this.addEvent({
      type: 'switch_network',
      address,
      chainId: toChainId,
      timestamp: Date.now(),
      metadata: { fromChainId },
    })
  }

  private addEvent(event: WalletEvent): void {
    this.events.unshift(event)

    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents)
    }
  }

  getEvents(type?: WalletEvent['type']): WalletEvent[] {
    if (type) {
      return this.events.filter(e => e.type === type)
    }
    return [...this.events]
  }

  getEventsByAddress(address: Address): WalletEvent[] {
    return this.events.filter(e => e.address === address)
  }

  getStats() {
    return {
      total: this.events.length,
      connects: this.getEvents('connect').length,
      disconnects: this.getEvents('disconnect').length,
      transactions: this.getEvents('transaction').length,
      signs: this.getEvents('sign').length,
      networkSwitches: this.getEvents('switch_network').length,
    }
  }

  clear(): void {
    this.events = []
  }
}

/**
 * walletAnalytics utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of walletAnalytics.
 */
export const walletAnalytics = new WalletAnalytics()
