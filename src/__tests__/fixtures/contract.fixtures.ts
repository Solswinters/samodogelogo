export const mockContractAddresses = {
  gameToken: '0x1234567890123456789012345678901234567890' as `0x${string}`,
  gameRewards: '0x0987654321098765432109876543210987654321' as `0x${string}`,
}

export const mockPlayerStats = {
  gamesPlayed: 10,
  totalClaimed: '100',
  highestScore: 5000,
  lastClaimTime: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
}

export const mockTokenBalance = {
  raw: BigInt('1000000000000000000'), // 1 token
  formatted: '1.0',
}

export const mockTransactionHash = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' as `0x${string}`

export const mockSignature = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12' as `0x${string}`

