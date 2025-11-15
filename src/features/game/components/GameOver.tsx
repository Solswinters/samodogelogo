"use client";

import React, { useState, useEffect } from "react";
import { useSimpleClaim } from "@/hooks/useSimpleClaim";
import { GAME_REWARDS_ADDRESS } from "@/lib/contracts";
import { formatEther } from "viem";

interface GameOverProps {
  score: number;
  isWinner: boolean;
  onRestart: () => void;
}

export default function GameOver({ score, isWinner, onRestart }: GameOverProps) {
  const {
    claimReward,
    canClaim,
    timeUntilNextClaim,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    address,
  } = useSimpleClaim(GAME_REWARDS_ADDRESS);

  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estimatedReward, setEstimatedReward] = useState<string>("0");

  useEffect(() => {
    // Fetch estimated reward from API
    const fetchEstimate = async () => {
      try {
        const response = await fetch("/api/game/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score, isWinner }),
        });
        const data = await response.json();
        setEstimatedReward(data.reward);
      } catch (err) {
        console.error("Failed to fetch reward estimate:", err);
      }
    };

    fetchEstimate();
  }, [score, isWinner]);

  const handleClaimReward = async () => {
    if (!address || !canClaim) return;

    setIsClaiming(true);
    setError(null);

    try {
      // Simple claim - just the score, no signature needed!
      await claimReward(score);
    } catch (err: any) {
      console.error("Claim error:", err);
      setError(err.message || "Failed to claim reward");
    } finally {
      setIsClaiming(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-gray-700 rounded-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">
            {isWinner ? "🏆 Victory!" : "Game Over"}
          </h2>
          <p className="text-gray-400">
            {isWinner ? "You won the match!" : "Better luck next time!"}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400">Final Score</span>
            <span className="text-2xl font-bold">{score}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Estimated Reward</span>
            <span className="text-xl font-bold text-green-400">
              {estimatedReward} JUMP
            </span>
          </div>

          {isWinner && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-sm text-yellow-400">
                ⚡ Winner Bonus: 1.5x multiplier applied!
              </p>
            </div>
          )}
        </div>

        {address ? (
          <div className="space-y-4">
            {canClaim ? (
              <button
                onClick={handleClaimReward}
                disabled={isClaiming || isPending || isConfirming}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                {isClaiming || isPending
                  ? "Preparing..."
                  : isConfirming
                  ? "Confirming..."
                  : isConfirmed
                  ? "Claimed! ✓"
                  : "Claim Reward"}
              </button>
            ) : (
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-400 mb-2">Cooldown Active</p>
                <p className="text-xl font-bold">
                  {formatTime(timeUntilNextClaim)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  You can claim again after the cooldown
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-500 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {isConfirmed && hash && (
              <div className="p-3 bg-green-900/30 border border-green-500 rounded-lg">
                <p className="text-green-400 text-sm mb-1">Reward claimed successfully!</p>
                <a
                  href={`https://basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-xs hover:underline"
                >
                  View on Basescan →
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-800 rounded-lg mb-4">
            <p className="text-gray-400">
              Connect your wallet to claim rewards
            </p>
          </div>
        )}

        <button
          onClick={onRestart}
          className="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

