import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";

// Store used nonces to prevent replay attacks
const usedNonces = new Set<number>();

export async function POST(request: NextRequest) {
  try {
    const { address, score, isWinner } = await request.json();

    // Validate inputs
    if (!address || typeof score !== "number" || typeof isWinner !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    // Validate address format
    if (!ethers.isAddress(address)) {
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    // Basic anti-cheat: check if score is reasonable
    // Max score should be around 10000 for a very long game
    if (score < 0 || score > 50000) {
      return NextResponse.json(
        { error: "Invalid score" },
        { status: 400 }
      );
    }

    // Generate unique nonce
    let nonce = Date.now();
    while (usedNonces.has(nonce)) {
      nonce += 1;
    }
    usedNonces.add(nonce);

    // Clean up old nonces (older than 1 hour)
    const oneHourAgo = Date.now() - 3600000;
    usedNonces.forEach(n => {
      if (n < oneHourAgo) usedNonces.delete(n);
    });

    // Get private key from environment
    const privateKey = process.env.VERIFIER_PRIVATE_KEY;
    if (!privateKey) {
      console.error("VERIFIER_PRIVATE_KEY not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create wallet instance for signing
    const wallet = new ethers.Wallet(privateKey);

    // Create message hash matching the smart contract
    // message = keccak256(abi.encodePacked(player, score, isWinner, nonce))
    const messageHash = ethers.solidityPackedKeccak256(
      ["address", "uint256", "bool", "uint256"],
      [address, score, isWinner, nonce]
    );

    // Sign the message
    const signature = await wallet.signMessage(ethers.getBytes(messageHash));

    // Log the claim attempt (in production, store this in a database)
    console.log("Claim request:", {
      address,
      score,
      isWinner,
      nonce,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      nonce,
      signature,
      message: "Signature generated successfully",
    });
  } catch (error: any) {
    console.error("Claim API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

