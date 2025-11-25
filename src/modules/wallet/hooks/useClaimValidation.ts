'use client'

import { useAccount, useReadContract } from 'wagmi'
import {
  GAME_REWARDS_ADDRESS,
  GAME_REWARDS_ABI,
  GAME_TOKEN_ADDRESS,
  GAME_TOKEN_ABI,
} from '@/config/contracts'
import { formatEther } from 'viem'

interface ClaimValidation {
  canClaim: boolean
  errors: string[]
  warnings: string[]
  estimatedGas: string
  verifierAddress?: string
  contractBalance?: string
  timeUntilClaim?: number
}

/**
 * useClaimValidation utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useClaimValidation.
 */
export function useClaimValidation(score: number): ClaimValidation {
  const { address } = useAccount()

  // Get verifier address
  const { data: verifier } = useReadContract({
    address: GAME_REWARDS_ADDRESS,
    abi: GAME_REWARDS_ABI,
    functionName: 'verifier',
  })

  // Get contract token balance
  const { data: contractBalance } = useReadContract({
    address: GAME_TOKEN_ADDRESS,
    abi: GAME_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [GAME_REWARDS_ADDRESS],
  })

  // Get last claim time
  const { data: lastClaimTime } = useReadContract({
    address: GAME_REWARDS_ADDRESS,
    abi: GAME_REWARDS_ABI,
    functionName: 'lastClaimTime',
    args: address ? [address] : undefined,
  })

  // Get cooldown period
  const { data: cooldownPeriod } = useReadContract({
    address: GAME_REWARDS_ADDRESS,
    abi: GAME_REWARDS_ABI,
    functionName: 'cooldownPeriod',
  })

  // Calculate estimated reward
  const { data: estimatedReward } = useReadContract({
    address: GAME_REWARDS_ADDRESS,
    abi: GAME_REWARDS_ABI,
    functionName: 'calculateReward',
    args: [BigInt(score), false],
  })

  const errors: string[] = []
  const warnings: string[] = []

  // Check if wallet is connected
  if (!address) {
    errors.push('Wallet not connected')
  }

  // Check if verifier is set
  if (verifier === '0x0000000000000000000000000000000000000000' || !verifier) {
    errors.push('⚠️ Verifier not set in contract! You need to set your wallet as verifier first.')
    warnings.push('See VERIFIER_SETUP.md for instructions')
  } else if (address && verifier?.toLowerCase() !== address.toLowerCase()) {
    warnings.push(`⚠️ Verifier is ${verifier}, but you're claiming with ${address}`)
    warnings.push('Signature verification will fail! Set your wallet as verifier first.')
  }

  // Check cooldown
  if (address && lastClaimTime && cooldownPeriod) {
    const now = Math.floor(Date.now() / 1000)
    const lastClaim = Number(lastClaimTime)
    const cooldown = Number(cooldownPeriod)
    const nextClaimTime = lastClaim + cooldown

    if (now < nextClaimTime) {
      const timeLeft = nextClaimTime - now
      errors.push(`Cooldown active. Wait ${Math.ceil(timeLeft / 60)} more minutes`)
    }
  }

  // Check contract has enough tokens
  if (contractBalance && estimatedReward) {
    if (contractBalance < estimatedReward) {
      errors.push("Contract doesn't have enough tokens to pay reward")
      warnings.push(
        `Contract has ${formatEther(contractBalance)} JUMP, needs ${formatEther(estimatedReward)} JUMP`
      )
    }
  }

  // Estimate gas cost
  const estimatedGas = '~100,000-150,000 gas (~$0.01-0.05 on Base)'

  return {
    canClaim: errors.length === 0,
    errors,
    warnings,
    estimatedGas,
    verifierAddress: verifier as string | undefined,
    contractBalance: contractBalance ? formatEther(contractBalance) : undefined,
    timeUntilClaim:
      lastClaimTime && cooldownPeriod
        ? Math.max(
            0,
            Number(lastClaimTime) + Number(cooldownPeriod) - Math.floor(Date.now() / 1000)
          )
        : undefined,
  }
}
