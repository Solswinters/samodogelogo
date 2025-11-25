/**
 * Message signing and verification service
 */

import { type Address } from 'viem'
import { signMessage, verifyMessage } from '@wagmi/core'
import { config } from '../config/web3'

export interface SignedMessage {
  message: string
  signature: `0x${string}`
  address: Address
  timestamp: number
}

export class SignatureService {
  async signMessage(message: string): Promise<`0x${string}`> {
    try {
      const signature = await signMessage(config, { message })
      return signature
    } catch (error) {
      console.error('Failed to sign message', { error })
      throw error
    }
  }

  async verifySignature(
    message: string,
    signature: `0x${string}`,
    address: Address
  ): Promise<boolean> {
    try {
      const isValid = await verifyMessage(config, {
        message,
        signature,
        address,
      })
      return isValid
    } catch (error) {
      console.error('Failed to verify signature', { error })
      return false
    }
  }

  createAuthMessage(address: Address, nonce: string): string {
    return `Sign this message to authenticate with the game.\n\nAddress: ${address}\nNonce: ${nonce}\nTimestamp: ${Date.now()}`
  }

  async signAuth(address: Address, nonce: string): Promise<SignedMessage> {
    const message = this.createAuthMessage(address, nonce)
    const signature = await this.signMessage(message)

    return {
      message,
      signature,
      address,
      timestamp: Date.now(),
    }
  }
}

/**
 * signatureService utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of signatureService.
 */
export const signatureService = new SignatureService()
