import { GAME_TOKEN_ABI, GAME_REWARDS_ABI } from "./abi";

// Contract addresses - deployed on Base
export const GAME_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_GAME_TOKEN_ADDRESS || "0xa294FfD0E35ba61BCD8bd0a4D7Eda5bCb83BC24F") as `0x${string}`;
export const GAME_REWARDS_ADDRESS = (process.env.NEXT_PUBLIC_GAME_REWARDS_ADDRESS || "0x070D2758aFD45504490A7aFD76c6cF1a5B2C5828") as `0x${string}`;

// Export ABIs
export { GAME_TOKEN_ABI, GAME_REWARDS_ABI };
