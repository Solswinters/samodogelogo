// Contract service - blockchain interaction business logic

import { ethers } from 'ethers'
import { contractLogger as logger } from '@/middleware/logging'

export interface SignatureData {
  message: string
  signature: string
  nonce: number
  expiresAt: number
}

// Verify contract signature
export function verifyContractSignature(
  message: string,
  signature: string,
  expectedSigner: string
): boolean {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature)
    const isValid = recoveredAddress.toLowerCase() === expectedSigner.toLowerCase()

    logger.info('Signature verification', {
      expectedSigner,
      recoveredAddress,
      isValid,
    })

    return isValid
  } catch (error) {
    logger.error('Signature verification failed', error as Error, {
      expectedSigner,
    })
    return false
  }
}

// Generate signature for claim
export async function generateClaimSignature(data: {
  address: string
  score: number
  isWinner: boolean
  nonce: number
}): Promise<{ signature: string; messageHash: string }> {
  try {
    const privateKey = process.env.VERIFIER_PRIVATE_KEY

    if (!privateKey) {
      throw new Error('VERIFIER_PRIVATE_KEY not configured')
    }

    const wallet = new ethers.Wallet(privateKey)

    // Create message hash matching contract
    const messageHash = ethers.solidityPackedKeccak256(
      ['address', 'uint256', 'bool', 'uint256'],
      [data.address, data.score, data.isWinner, data.nonce]
    )

    // Sign the message
    const signature = await wallet.signMessage(ethers.getBytes(messageHash))

    logger.info('Claim signature generated', {
      address: data.address,
      score: data.score,
      nonce: data.nonce,
    })

    return { signature, messageHash }
  } catch (error) {
    logger.error('Failed to generate claim signature', error as Error, {
      address: data.address,
    })
    throw error
  }
}

// Verify transaction
export async function verifyTransaction(
  txHash: string,
  expectedFrom: string
): Promise<{
  valid: boolean
  confirmed: boolean
  blockNumber?: number
}> {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const tx = await provider.getTransaction(txHash)

    if (!tx) {
      return { valid: false, confirmed: false }
    }

    const isValidSender = tx.from.toLowerCase() === expectedFrom.toLowerCase()

    const receipt = await provider.getTransactionReceipt(txHash)
    const confirmed = receipt !== null && receipt.status === 1

    logger.info('Transaction verified', {
      txHash,
      valid: isValidSender,
      confirmed,
      blockNumber: receipt?.blockNumber,
    })

    return {
      valid: isValidSender,
      confirmed,
      blockNumber: receipt?.blockNumber,
    }
  } catch (error) {
    logger.error('Transaction verification failed', error as Error, { txHash })
    return { valid: false, confirmed: false }
  }
}

// Get contract balance
export async function getContractBalance(contractAddress: string): Promise<string> {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const balance = await provider.getBalance(contractAddress)

    return ethers.formatEther(balance)
  } catch (error) {
    logger.error('Failed to get contract balance', error as Error, {
      contractAddress,
    })
    throw error
  }
}

// Monitor contract events
export function watchContractEvents(
  contractAddress: string,
  eventName: string,
  callback: (event: ethers.Log) => void
): () => void {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)

    const filter = {
      address: contractAddress,
      topics: [ethers.id(eventName)],
    }

    void provider.on(filter, callback)

    logger.info('Started watching contract events', {
      contractAddress,
      eventName,
    })

    // Return cleanup function
    return () => {
      void provider.off(filter, callback)
      logger.info('Stopped watching contract events', {
        contractAddress,
        eventName,
      })
    }
  } catch (error) {
    logger.error('Failed to watch contract events', error as Error, {
      contractAddress,
      eventName,
    })
    throw error
  }
}
