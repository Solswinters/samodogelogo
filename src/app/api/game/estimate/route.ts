import { NextRequest, NextResponse } from "next/server";
import { formatEther } from "viem";

// Reward calculation matches the smart contract logic
function calculateReward(score: number, isWinner: boolean): bigint {
  const BASE_REWARD = BigInt(10) * BigInt(10 ** 18); // 10 tokens
  const SCORE_TO_TOKEN_RATE = 100;
  const WINNER_MULTIPLIER = 15000; // 150% in basis points
  
  // Base reward + score bonus
  const scoreBonus = (BigInt(score) * BigInt(10 ** 18)) / BigInt(SCORE_TO_TOKEN_RATE);
  let reward = BASE_REWARD + scoreBonus;
  
  // Apply winner multiplier
  if (isWinner) {
    reward = (reward * BigInt(WINNER_MULTIPLIER)) / BigInt(10000);
  }
  
  return reward;
}

export async function POST(request: NextRequest) {
  try {
    const { score, isWinner } = await request.json();

    // Validate inputs
    if (typeof score !== "number" || typeof isWinner !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    if (score < 0) {
      return NextResponse.json(
        { error: "Score must be non-negative" },
        { status: 400 }
      );
    }

    const rewardWei = calculateReward(score, isWinner);
    const rewardEth = formatEther(rewardWei);

    return NextResponse.json({
      reward: rewardEth,
      rewardWei: rewardWei.toString(),
      score,
      isWinner,
      breakdown: {
        baseReward: "10",
        scoreBonus: formatEther((BigInt(score) * BigInt(10 ** 18)) / BigInt(100)),
        winnerMultiplier: isWinner ? "1.5x" : "1x",
      },
    });
  } catch (error: any) {
    console.error("Estimate API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

