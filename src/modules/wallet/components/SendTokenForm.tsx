/**
 * Send token form component
 */

'use client'

import { useState } from 'react'
import { type Address, isAddress } from 'viem'
import { Card } from '@/shared/components/Card'
import { Input } from '@/shared/components/Input'
import { Button } from '@/shared/components/Button'
import { useTokenTransfer } from '../hooks/useTokenTransfer'
import { useTokenBalance } from '../hooks/useTokenBalance'

interface SendTokenFormProps {
  tokenAddress: Address
  onSuccess?: () => void
}

/**
 * SendTokenForm utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of SendTokenForm.
 */
export function SendTokenForm({ tokenAddress, onSuccess }: SendTokenFormProps) {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { balance } = useTokenBalance(tokenAddress)
  const { transfer, isTransferring, isSuccess } = useTokenTransfer(tokenAddress)

  const validateForm = (): boolean => {
    setError(null)

    if (!recipient) {
      setError('Recipient address is required')
      return false
    }

    if (!isAddress(recipient)) {
      setError('Invalid recipient address')
      return false
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0')
      return false
    }

    try {
      const amountBigInt = BigInt(amount)
      if (amountBigInt > balance) {
        setError('Insufficient balance')
        return false
      }
    } catch {
      setError('Invalid amount')
      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const amountBigInt = BigInt(amount)
      transfer(recipient as Address, amountBigInt)
    } catch (err) {
      setError('Failed to send transaction')
    }
  }

  const handleMaxClick = () => {
    setAmount(balance.toString())
  }

  if (isSuccess) {
    onSuccess?.()
    // Reset form
    setRecipient('')
    setAmount('')
  }

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Send Tokens</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Recipient Address</label>
          <Input
            type="text"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={isTransferring}
          />
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-400">Amount</label>
            <button
              type="button"
              onClick={handleMaxClick}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Max: {balance.toString()}
            </button>
          </div>
          <Input
            type="text"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isTransferring}
          />
        </div>

        {/* Error */}
        {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isTransferring || !recipient || !amount}
        >
          {isTransferring ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </Card>
  )
}
