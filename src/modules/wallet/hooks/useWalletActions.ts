"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { GAME_TOKEN_ADDRESS, GAME_REWARDS_ADDRESS, GAME_TOKEN_ABI, GAME_REWARDS_ABI } from "@/lib/contracts";
import { formatEther } from "viem";

/**
 * Unified hook for all wallet operations
 * Consolidates token balance, player stats, and contract interactions
 */
export function useWalletActions() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending: isWritePending } = useWriteContract();

  // Token balance
  const { data: tokenBalance, refetch: refetchBalance } = useReadContract({
    address: GAME_TOKEN_ADDRESS,
    abi: GAME_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Player stats
  const { data: playerStats, refetch: refetchStats } = useReadContract({
    address: GAME_REWARDS_ADDRESS,
    abi: GAME_REWARDS_ABI,
    functionName: "getPlayerStats",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Time until next claim
  const { data: timeUntilNextClaim } = useReadContract({
    address: GAME_REWARDS_ADDRESS,
    abi: GAME_REWARDS_ABI,
    functionName: "getTimeUntilNextClaim",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 1000,
    },
  });

  // Cooldown period
  const { data: cooldownPeriod } = useReadContract({
    address: GAME_REWARDS_ADDRESS,
    abi: GAME_REWARDS_ABI,
    functionName: "cooldownPeriod",
  });

  // Verifier address
  const { data: verifier } = useReadContract({
    address: GAME_REWARDS_ADDRESS,
    abi: GAME_REWARDS_ABI,
    functionName: "verifier",
  });

  // Contract token balance
  const { data: contractBalance } = useReadContract({
    address: GAME_TOKEN_ADDRESS,
    abi: GAME_TOKEN_ABI,
    functionName: "balanceOf",
    args: [GAME_REWARDS_ADDRESS],
  });

  // Last claim time
  const { data: lastClaimTime } = useReadContract({
    address: GAME_REWARDS_ADDRESS,
    abi: GAME_REWARDS_ABI,
    functionName: "lastClaimTime",
    args: address ? [address] : undefined,
  });

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  /**
   * Calculate reward preview
   */
  const calculateReward = (score: number, isWinner: boolean) => {
    return useReadContract({
      address: GAME_REWARDS_ADDRESS,
      abi: GAME_REWARDS_ABI,
      functionName: "calculateReward",
      args: [BigInt(score), isWinner],
    });
  };

  /**
   * Claim reward function
   */
  const claimReward = async (
    score: number,
    isWinner: boolean,
    nonce: number,
    signature: `0x${string}`
  ) => {
    if (!address) throw new Error("Wallet not connected");

    return writeContract({
      address: GAME_REWARDS_ADDRESS,
      abi: GAME_REWARDS_ABI,
      functionName: "claimReward",
      args: [BigInt(score), isWinner, BigInt(nonce), signature],
    });
  };

  /**
   * Validate if claim is possible
   */
  const validateClaim = (score: number) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!address) {
      errors.push("Wallet not connected");
    }

    if (verifier === "0x0000000000000000000000000000000000000000" || !verifier) {
      errors.push("Verifier not set in contract");
      warnings.push("Set your wallet as verifier first");
    } else if (address && verifier?.toLowerCase() !== address.toLowerCase()) {
      warnings.push(`Verifier is ${verifier}, but you're claiming with ${address}`);
      warnings.push("Signature verification will fail");
    }

    if (address && lastClaimTime && cooldownPeriod) {
      const now = Math.floor(Date.now() / 1000);
      const lastClaim = Number(lastClaimTime);
      const cooldown = Number(cooldownPeriod);
      const nextClaimTime = lastClaim + cooldown;

      if (now < nextClaimTime) {
        const timeLeft = nextClaimTime - now;
        errors.push(`Cooldown active. Wait ${Math.ceil(timeLeft / 60)} more minutes`);
      }
    }

    const { data: estimatedReward } = calculateReward(score, false);
    if (contractBalance && estimatedReward) {
      if (contractBalance < estimatedReward) {
        errors.push("Contract doesn't have enough tokens");
        warnings.push(`Contract has ${formatEther(contractBalance)} JUMP`);
      }
    }

    return {
      canClaim: errors.length === 0,
      errors,
      warnings,
      estimatedReward: estimatedReward ? formatEther(estimatedReward) : "0",
    };
  };

  const canClaim = timeUntilNextClaim !== undefined && timeUntilNextClaim === BigInt(0);

  return {
    // Account
    address,

    // Balances
    tokenBalance: tokenBalance ? formatEther(tokenBalance) : "0",
    tokenBalanceRaw: tokenBalance,
    contractBalance: contractBalance ? formatEther(contractBalance) : "0",

    // Player data
    playerStats: playerStats
      ? {
          gamesPlayed: Number(playerStats[0]),
          totalClaimed: formatEther(playerStats[1]),
          highestScore: Number(playerStats[2]),
          lastClaimTime: Number(playerStats[3]),
        }
      : null,

    // Claim state
    timeUntilNextClaim: timeUntilNextClaim ? Number(timeUntilNextClaim) : 0,
    cooldownPeriod: cooldownPeriod ? Number(cooldownPeriod) : 3600,
    canClaim,
    verifier: verifier as `0x${string}` | undefined,

    // Actions
    claimReward,
    calculateReward,
    validateClaim,
    refetchBalance,
    refetchStats,

    // Transaction state
    isWritePending,
    isConfirming,
    isConfirmed,
    hash,
  };
}

