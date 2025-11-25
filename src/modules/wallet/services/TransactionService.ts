import { Address } from 'viem'

import { IService } from '@/common/interfaces'

/**
 * Service for managing transaction queue and retry logic
 */

export interface Transaction {
  id: string
  hash?: Address
  status: 'pending' | 'confirmed' | 'failed'
  type: string
  data: unknown
  attempts: number
  maxAttempts: number
  timestamp: number
  error?: string
}

export class TransactionService implements IService {
  public readonly serviceName = 'TransactionService'

  private transactions: Map<string, Transaction> = new Map()
  private listeners: Set<(tx: Transaction) => void> = new Set()

  /**
   * Add transaction to queue
   */
  addTransaction(id: string, type: string, data: unknown, maxAttempts: number = 3): Transaction {
    const transaction: Transaction = {
      id,
      status: 'pending',
      type,
      data,
      attempts: 0,
      maxAttempts,
      timestamp: Date.now(),
    }

    this.transactions.set(id, transaction)
    this.notifyListeners(transaction)
    return transaction
  }

  /**
   * Update transaction status
   */
  updateTransaction(id: string, updates: Partial<Transaction>): void {
    const tx = this.transactions.get(id)
    if (!tx) return

    const updated = { ...tx, ...updates }
    this.transactions.set(id, updated)
    this.notifyListeners(updated)
  }

  /**
   * Get transaction by ID
   */
  getTransaction(id: string): Transaction | undefined {
    return this.transactions.get(id)
  }

  /**
   * Get all transactions
   */
  getAllTransactions(): Transaction[] {
    return Array.from(this.transactions.values())
  }

  /**
   * Get pending transactions
   */
  getPendingTransactions(): Transaction[] {
    return this.getAllTransactions().filter((tx) => tx.status === 'pending')
  }

  /**
   * Retry failed transaction
   */
  retryTransaction(id: string): boolean {
    const tx = this.transactions.get(id)
    if (!tx || tx.status !== 'failed') return false

    if (tx.attempts >= tx.maxAttempts) {
      return false
    }

    tx.attempts++
    tx.status = 'pending'
    tx.error = undefined
    this.transactions.set(id, tx)
    this.notifyListeners(tx)
    return true
  }

  /**
   * Remove transaction from queue
   */
  removeTransaction(id: string): void {
    this.transactions.delete(id)
  }

  /**
   * Clear all transactions
   */
  clearTransactions(): void {
    this.transactions.clear()
  }

  /**
   * Subscribe to transaction updates
   */
  subscribe(listener: (tx: Transaction) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(tx: Transaction): void {
    this.listeners.forEach((listener) => listener(tx))
  }

  destroy(): void {
    this.transactions.clear()
    this.listeners.clear()
  }
}
