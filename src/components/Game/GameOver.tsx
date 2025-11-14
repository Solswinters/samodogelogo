"use client";

import React, { useState, useEffect } from "react";
import { useGameContract } from "@/hooks/useGameContract";
import { useDirectClaim } from "@/hooks/useDirectClaim";
import { useClaimValidation } from "@/hooks/useClaimValidation";
import { formatEther } from "viem";

interface GameOverProps {
  score: number;
  isWinner: boolean;
  onRestart: () => void;
}

export default function GameOver({ score, isWinner, onRestart }: GameOverProps) {
  const {
    address,
    canClaim,
    timeUntilNextClaim,
  } = useGameContract();

  const {
    claimRewardDirect,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  } = useDirectClaim();

  const validation = useClaimValidation(score);

  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estimatedReward, setEstimatedReward] = useState<string>("0");
  const [showGasInfo, setShowGasInfo] = useState(false);

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
      // Sign and claim directly with user's wallet (no backend needed!)
      await claimRewardDirect(score, isWinner);
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
            {/* Validation Warnings */}
            {validation.warnings.length > 0 && (
              <div className="p-3 bg-yellow-900/30 border border-yellow-500 rounded-lg space-y-1">
                {validation.warnings.map((warning, i) => (
                  <p key={i} className="text-yellow-400 text-sm">{warning}</p>
                ))}
              </div>
            )}

            {/* Validation Errors */}
            {validation.errors.length > 0 && (
              <div className="p-3 bg-red-900/30 border border-red-500 rounded-lg space-y-1">
                {validation.errors.map((error, i) => (
                  <p key={i} className="text-red-400 text-sm">{error}</p>
                ))}
              </div>
            )}

            {/* Gas Cost Info */}
            <button
              onClick={() => setShowGasInfo(!showGasInfo)}
              className="w-full text-left p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg hover:bg-blue-900/30 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-300">⛽ Gas Cost Info</span>
                <span className="text-xs text-gray-400">{showGasInfo ? "▼" : "▶"}</span>
              </div>
              {showGasInfo && (
                <div className="mt-2 pt-2 border-t border-blue-500/20 space-y-1 text-xs text-gray-300">
                  <p>• Estimated: {validation.estimatedGas}</p>
                  <p>• Why? 5 storage writes + signature verification + token transfer</p>
                  <p>• Contract Balance: {validation.contractBalance || "..."} JUMP</p>
                  <p>• Verifier: {validation.verifierAddress ? `${validation.verifierAddress.slice(0, 6)}...${validation.verifierAddress.slice(-4)}` : "Not set"}</p>
                </div>
              )}
            </button>

            {canClaim && validation.canClaim ? (
              <button
                onClick={handleClaimReward}
                disabled={isClaiming || isPending || isConfirming || !validation.canClaim}
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
            ) : !validation.canClaim && canClaim ? (
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-400 mb-2">⚠️ Cannot Claim</p>
                <p className="text-sm text-gray-500">
                  Fix the errors above first
                </p>
              </div>
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

