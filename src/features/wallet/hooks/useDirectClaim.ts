"use client";

import { useAccount, useSignMessage, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { keccak256, encodePacked } from "viem";
import { GAME_REWARDS_ADDRESS, GAME_REWARDS_ABI } from "@/lib/contracts";

/**
 * Hook for claiming rewards directly from the wallet without backend verification
 * User signs the message with their own wallet
 */
export function useDirectClaim() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { writeContractAsync, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const claimRewardDirect = async (score: number, isWinner: boolean) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    try {
      // Generate nonce
      const nonce = Date.now();

      // Create message hash matching the smart contract
      // message = keccak256(abi.encodePacked(player, score, isWinner, nonce))
      const messageHash = keccak256(
        encodePacked(
          ["address", "uint256", "bool", "uint256"],
          [address, BigInt(score), isWinner, BigInt(nonce)]
        )
      );

      // Sign the message with user's wallet
      const signature = await signMessageAsync({
        message: { raw: messageHash },
      });

      console.log("Signature created:", { score, isWinner, nonce, signature });

      // Call the contract
      const txHash = await writeContractAsync({
        address: GAME_REWARDS_ADDRESS,
        abi: GAME_REWARDS_ABI,
        functionName: "claimReward",
        args: [BigInt(score), isWinner, BigInt(nonce), signature as `0x${string}`],
      });

      return txHash;
    } catch (error: any) {
      console.error("Direct claim error:", error);
      throw error;
    }
  };

  return {
    claimRewardDirect,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  };
}

