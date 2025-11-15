import { GAME_TOKEN_ABI, GAME_REWARDS_ABI, SIMPLE_GAME_REWARDS_ABI } from "@/config/contracts/abis";

/**
 * Contract addresses - deployed on Base
 * These should be set in your .env.local file
 */
export const GAME_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_GAME_TOKEN_ADDRESS as `0x${string}`;
export const GAME_REWARDS_ADDRESS = process.env.NEXT_PUBLIC_GAME_REWARDS_ADDRESS as `0x${string}`;

/**
 * Validate that contract addresses are set
 */
if (!GAME_TOKEN_ADDRESS) {
  console.error("NEXT_PUBLIC_GAME_TOKEN_ADDRESS is not set in environment variables");
}
if (!GAME_REWARDS_ADDRESS) {
  console.error("NEXT_PUBLIC_GAME_REWARDS_ADDRESS is not set in environment variables");
}

/**
 * Export ABIs for wallet module
 */
export { GAME_TOKEN_ABI, GAME_REWARDS_ABI, SIMPLE_GAME_REWARDS_ABI };

