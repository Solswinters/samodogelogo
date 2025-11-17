/**
 * Wallet validation schemas
 */

import { z } from 'zod'

export const addressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')

export const transactionHashSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash')

export const amountSchema = z.string().regex(/^\d+(\.\d+)?$/, 'Invalid amount format')

export const chainIdSchema = z.number().int().positive()

export const walletConnectionSchema = z.object({
  address: addressSchema,
  chainId: chainIdSchema,
  isConnected: z.boolean(),
})

export const tokenBalanceSchema = z.object({
  address: addressSchema,
  balance: z.string(),
  decimals: z.number().int().min(0).max(18),
  symbol: z.string(),
})

export const transactionSchema = z.object({
  to: addressSchema,
  from: addressSchema,
  value: amountSchema,
  data: z.string().optional(),
  gasLimit: z.string().optional(),
  gasPrice: z.string().optional(),
})

export type WalletConnection = z.infer<typeof walletConnectionSchema>
export type TokenBalance = z.infer<typeof tokenBalanceSchema>
export type Transaction = z.infer<typeof transactionSchema>
