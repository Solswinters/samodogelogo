# Verifier Setup for Direct Wallet Claims

## Overview
The game now uses **direct wallet claims** - players sign reward claims with their own wallet instead of relying on a backend signature. This means you don't need to provide a private key to the application!

## How It Works

1. **Player Completes Game** → Gets a score
2. **Player Clicks "Claim Reward"** → Their wallet prompts them to sign a message
3. **Player Signs Message** → Creates a signature proving they earned the reward
4. **Smart Contract Verifies** → Checks the signature matches the expected verifier address
5. **Tokens Transferred** → Player receives their JUMP tokens

## Setting the Verifier Address

The `GameRewards` contract has a `verifier` address that determines who can sign valid reward claims. You need to set this to your wallet address (the one you use to play the game).

### Using Remix

1. **Connect to the Contract**
   - Go to [Remix](https://remix.ethereum.org)
   - Load the contract at: `0x070D2758aFD45504490A7aFD76c6cF1a5B2C5828`
   - Connect to Base network

2. **Check Current Verifier**
   ```solidity
   // Read the current verifier address
   verifier() // Returns current verifier address
   ```

3. **Set Your Wallet as Verifier**
   ```solidity
   // As contract owner, set verifier to your wallet address
   setVerifier("YOUR_WALLET_ADDRESS")
   ```
   Replace `YOUR_WALLET_ADDRESS` with the wallet you'll use to play the game.

4. **Fund the Contract**
   - The `GameRewards` contract needs JUMP tokens to pay out rewards
   - Transfer tokens from `GameToken` to `GameRewards` contract:
   ```solidity
   // On GameToken contract (0xa294FfD0E35ba61BCD8bd0a4D7Eda5bCb83BC24F)
   transfer("0x070D2758aFD45504490A7aFD76c6cF1a5B2C5828", AMOUNT)
   ```

## Contract Functions

### GameRewards Contract (`0x070D2758aFD45504490A7aFD76c6cF1a5B2C5828`)

**Owner Functions (Only Contract Owner):**
- `setVerifier(address)` - Set who can sign valid claims
- `setBaseReward(uint256)` - Change base reward amount
- `setScoreToTokenRate(uint256)` - Change score to token conversion rate
- `setCooldownPeriod(uint256)` - Change cooldown between claims
- `withdrawTokens(address, uint256)` - Withdraw excess tokens

**Player Functions:**
- `claimReward(score, isWinner, nonce, signature)` - Claim rewards (called automatically by the game)
- `calculateReward(score, isWinner)` - Preview reward amount
- `getTimeUntilNextClaim(address)` - Check cooldown status
- `getPlayerStats(address)` - View player statistics

## Testing the Setup

1. Set your wallet as verifier (as shown above)
2. Play the game and earn a score
3. Click "Claim Reward"
4. Your wallet will prompt you to sign a message
5. After signing, the transaction will be sent to claim your reward

## Troubleshooting

### "Invalid signature" Error
- **Cause**: The verifier address in the contract doesn't match the wallet you're using
- **Solution**: Set the verifier address to your current wallet address

### "Claim cooldown active" Error
- **Cause**: You've claimed too recently (default: 1 hour cooldown)
- **Solution**: Wait for the cooldown period or reduce it using `setCooldownPeriod()`

### "Insufficient token balance in contract" Error
- **Cause**: GameRewards contract doesn't have enough JUMP tokens
- **Solution**: Transfer JUMP tokens to the GameRewards contract

## Security Notes

- Each signature can only be used once (anti-replay protection)
- Signatures include a nonce (timestamp) to prevent reuse
- Only the designated verifier can create valid signatures
- The cooldown period prevents spam claims

## Advanced: Multiple Players

If you want multiple people to be able to claim rewards:

**Option 1: Set a Shared Verifier**
- Use a backend service with a shared verifier key (what the backend API was for)
- This requires setting up `VERIFIER_PRIVATE_KEY` in `.env.local`

**Option 2: Each Player as Their Own Verifier**
- Each player sets themselves as verifier before claiming
- Only practical for single-player use or trusted groups

For a production game with many players, you'd typically use Option 1 with a secure backend service.

