/**
 * Hook for message signing
 */

import { useSignMessage as useWagmiSignMessage, useAccount } from 'wagmi'
import { useState } from 'react'
import type { SignedMessage } from '../services/SignatureService'

export function useSignMessage() {
  const { address } = useAccount()
  const { signMessageAsync, isPending, error } = useWagmiSignMessage()
  const [signedMessage, setSignedMessage] = useState<SignedMessage | null>(null)

  const sign = async (message: string): Promise<SignedMessage | null> => {
    if (!address) {
      throw new Error('No wallet connected')
    }

    try {
      const signature = await signMessageAsync({ message })

      const signed: SignedMessage = {
        message,
        signature,
        address,
        timestamp: Date.now(),
      }

      setSignedMessage(signed)
      return signed
    } catch (err) {
      console.error('Failed to sign message', err)
      return null
    }
  }

  const reset = () => {
    setSignedMessage(null)
  }

  return {
    sign,
    signedMessage,
    isPending,
    error,
    reset,
  }
}
