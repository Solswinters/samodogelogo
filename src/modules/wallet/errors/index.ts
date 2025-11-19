/**
 * Wallet-specific error classes
 */

import { AppError } from '@/shared/error-handler'

export class WalletConnectionError extends AppError {
  constructor(message: string) {
    super(message, 'WALLET_CONNECTION_ERROR', 503)
    this.name = 'WalletConnectionError'
  }
}

export class TransactionError extends AppError {
  constructor(
    message: string,
    public txHash?: string
  ) {
    super(message, 'TRANSACTION_ERROR', 500)
    this.name = 'TransactionError'
  }
}

export class ContractError extends AppError {
  constructor(
    message: string,
    public contractAddress?: string
  ) {
    super(message, 'CONTRACT_ERROR', 500)
    this.name = 'ContractError'
  }
}

export class InsufficientBalanceError extends AppError {
  constructor(message: string) {
    super(message, 'INSUFFICIENT_BALANCE', 400)
    this.name = 'InsufficientBalanceError'
  }
}

export class ChainNotSupportedError extends AppError {
  constructor(chainId: number) {
    super(`Chain ${chainId} is not supported`, 'CHAIN_NOT_SUPPORTED', 400)
    this.name = 'ChainNotSupportedError'
  }
}
