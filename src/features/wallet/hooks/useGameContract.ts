"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { GAME_TOKEN_ADDRESS, GAME_REWARDS_ADDRESS, GAME_TOKEN_ABI, GAME_REWARDS_ABI } from "@/lib/contracts";
import { formatEther } from "viem";

export function useGameContract() {
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
      refetchInterval: 1000, // Refetch every second
    },
  });

  // Cooldown period
  const { data: cooldownPeriod } = useReadContract({
    address: GAME_REWARDS_ADDRESS,
    abi: GAME_REWARDS_ABI,
    functionName: "cooldownPeriod",
  });

  // Calculate reward preview
  const calculateReward = (score: number, isWinner: boolean) => {
    return useReadContract({
      address: GAME_REWARDS_ADDRESS,
      abi: GAME_REWARDS_ABI,
      functionName: "calculateReward",
      args: [BigInt(score), isWinner],
    });
  };

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Claim reward function
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

  const canClaim = timeUntilNextClaim !== undefined && timeUntilNextClaim === BigInt(0);

  return {
    address,
    tokenBalance: tokenBalance ? formatEther(tokenBalance) : "0",
    tokenBalanceRaw: tokenBalance,
    playerStats: playerStats ? {
      gamesPlayed: Number(playerStats[0]),
      totalClaimed: formatEther(playerStats[1]),
      highestScore: Number(playerStats[2]),
      lastClaimTime: Number(playerStats[3]),
    } : null,
    timeUntilNextClaim: timeUntilNextClaim ? Number(timeUntilNextClaim) : 0,
    cooldownPeriod: cooldownPeriod ? Number(cooldownPeriod) : 3600,
    canClaim,
    claimReward,
    isWritePending,
    isConfirming,
    isConfirmed,
    hash,
    refetchBalance,
    refetchStats,
    calculateReward,
  };
}

