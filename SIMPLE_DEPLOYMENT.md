# Simple Game Rewards Deployment Guide

## Overview

This guide is for deploying the **SimpleGameRewards** contract - a permissionless reward system where **anyone can connect their wallet, play, and claim rewards** without any verifier setup!

## Key Differences: Simple vs Original

| Feature | Simple (NEW) | Original |
|---------|--------------|----------|
| **Signature Required** | ❌ No | ✅ Yes |
| **Verifier Setup** | ❌ Not needed | ✅ Required |
| **Backend Needed** | ❌ No | ✅ Optional |
| **Gas Cost** | ~60,000 gas ($0.01-0.02) | ~120,000 gas ($0.02-0.05) |
| **Anti-Cheat** | Cooldown + Max reward | Signature verification |
| **User Experience** | ⭐ Best - Just claim! | ⚠️ Need verifier setup |

## Deployment Steps

### 1. Deploy in Remix

1. **Open Remix**: https://remix.ethereum.org
2. **Create new file**: `SimpleGameRewards.sol`
3. **Copy contract** from `contracts/contracts/SimpleGameRewards.sol`
4. **Compile**: Select Solidity 0.8.20+

5. **Deploy with parameters**:
   ```solidity
   _gameToken: 0xa294FfD0E35ba61BCD8bd0a4D7Eda5bCb83BC24F  // Your GameToken address
   initialOwner: YOUR_WALLET_ADDRESS  // You as owner
   ```

6. **Copy deployed address** - you'll need this!

### 2. Fund the Contract

Transfer JUMP tokens to the contract so it can pay rewards:

```solidity
// On GameToken contract (0xa294FfD0E35ba61BCD8bd0a4D7Eda5bCb83BC24F)
transfer("YOUR_SIMPLE_REWARDS_ADDRESS", 10000000000000000000000)
// This is 10,000 JUMP tokens
```

### 3. Configure Frontend

Update your `.env.local`:

```env
# Use the simple rewards contract
NEXT_PUBLIC_GAME_REWARDS_ADDRESS=YOUR_SIMPLE_REWARDS_ADDRESS
NEXT_PUBLIC_USE_SIMPLE_REWARDS=true
```

### 4. Update GameOver Component

Replace the claim logic in `src/components/Game/GameOver.tsx`:

```typescript
import { useSimpleClaim } from "@/hooks/useSimpleClaim";
import { GAME_REWARDS_ADDRESS } from "@/lib/contracts";

// In your component:
const {
  claimReward,
  canClaim,
  timeUntilNextClaim,
  isPending,
  isConfirming,
  isConfirmed,
  hash
} = useSimpleClaim(GAME_REWARDS_ADDRESS);

// Claim handler - super simple!
const handleClaimReward = async () => {
  try {
    await claimReward(score);
  } catch (err: any) {
    setError(err.message || "Failed to claim reward");
  }
};
```

## Contract Configuration

Default parameters (can be changed by owner):

```solidity
baseReward = 10 JUMP tokens
scoreToTokenRate = 100  // 1 JUMP per 100 points
maxRewardPerClaim = 1000 JUMP  // Maximum per claim
cooldownPeriod = 1 hour
minScore = 10  // Minimum score to claim
```

### Adjust Parameters

```solidity
// In Remix, as contract owner:

// Change base reward
setBaseReward(20000000000000000000)  // 20 JUMP

// Change score rate (1 JUMP per 50 points)
setScoreToTokenRate(50)

// Change max reward (500 JUMP max)
setMaxRewardPerClaim(500000000000000000000)

// Change cooldown (30 minutes)
setCooldownPeriod(1800)

// Change minimum score
setMinScore(50)
```

## Anti-Cheat Measures

Since there's no signature verification, the contract uses these protections:

1. **Cooldown Period** (1 hour default)
   - Prevents spam claims
   - Players must wait between claims

2. **Maximum Reward Cap** (1000 JUMP default)
   - Even if someone claims a high score, reward is capped
   - Limits potential abuse

3. **Minimum Score** (10 default)
   - Prevents zero/low score claims
   - Ensures meaningful gameplay

4. **Contract Balance Check**
   - Can't claim if contract is empty
   - Owner controls funding

## Security Considerations

### ⚠️ Important: This System is More Vulnerable to Cheating

**Pros:**
- ✅ Super easy UX - no verifier setup
- ✅ Truly permissionless
- ✅ Lower gas costs
- ✅ No backend needed

**Cons:**
- ❌ Players can claim fake scores (limited by max reward)
- ❌ Bots could spam (limited by cooldown)
- ❌ No proof of actual gameplay

### Recommended Use Cases:

1. **Low-stake games** - Where cheating isn't a big concern
2. **Marketing/airdrops** - Getting tokens to users easily
3. **Testing/demos** - Rapid prototyping
4. **Community games** - Trusted player base

### NOT Recommended For:

- ❌ High-value tournaments
- ❌ Competitive leaderboards with prizes
- ❌ Games where fairness is critical

## Monitoring & Management

### Check Contract Status

```solidity
// Get contract balance
balanceOf(SIMPLE_REWARDS_ADDRESS)

// View player stats
getPlayerStats(PLAYER_ADDRESS)
// Returns: (gamesPlayed, totalClaimed, highestScore, lastClaimTime)
```

### Withdraw Excess Tokens

```solidity
// As owner, withdraw tokens
withdrawTokens(YOUR_ADDRESS, AMOUNT)
```

## Cost Comparison

| Operation | Simple Contract | Original Contract |
|-----------|----------------|-------------------|
| **Deploy** | ~1,200,000 gas | ~2,500,000 gas |
| **Claim** | ~60,000 gas | ~120,000 gas |
| **Set Params** | ~30,000 gas | ~30,000 gas |

**On Base, claiming costs ~$0.01-0.02** with the simple contract! 🎉

## Testing Checklist

- [ ] Deploy contract on testnet first
- [ ] Fund contract with test tokens
- [ ] Connect wallet and play game
- [ ] Claim reward successfully
- [ ] Verify cooldown works
- [ ] Test max reward cap
- [ ] Test minimum score requirement
- [ ] Verify gas costs are lower

## Migration from Original Contract

If you have the original GameRewards deployed:

1. **Deploy SimpleGameRewards** (keep old one active)
2. **Update `.env.local`** with new address
3. **Test thoroughly** on testnet
4. **Gradually migrate** users to new contract
5. **Withdraw** remaining tokens from old contract

## Full Example: Start to Finish

```bash
# 1. Deploy SimpleGameRewards in Remix
# Address: 0xNEW_SIMPLE_REWARDS_ADDRESS

# 2. Fund it
# In Remix on GameToken:
transfer("0xNEW_SIMPLE_REWARDS_ADDRESS", "10000000000000000000000")

# 3. Update .env.local
echo "NEXT_PUBLIC_GAME_REWARDS_ADDRESS=0xNEW_SIMPLE_REWARDS_ADDRESS" >> .env.local

# 4. Restart app
npm run dev

# 5. Play and claim!
# No verifier setup needed - just connect wallet and claim! 🎮
```

## Troubleshooting

### "Cooldown period not elapsed"
- **Cause**: You claimed less than 1 hour ago
- **Solution**: Wait for cooldown or reduce it: `setCooldownPeriod(600)` (10 min)

### "Score too low"
- **Cause**: Score is below minimum (default 10)
- **Solution**: Play better OR reduce min: `setMinScore(1)`

### "Reward exceeds maximum"
- **Cause**: Calculated reward > max (1000 JUMP)
- **Solution**: Increase max: `setMaxRewardPerClaim(2000000000000000000000)` (2000 JUMP)

### "Insufficient contract balance"
- **Cause**: Contract ran out of tokens
- **Solution**: Transfer more JUMP tokens to contract

## Best Practices

1. **Start with conservative limits**
   - Low max reward (100-500 JUMP)
   - Keep cooldown at 1 hour
   - Monitor usage patterns

2. **Monitor contract balance**
   - Set up alerts for low balance
   - Refill regularly

3. **Adjust parameters based on usage**
   - If seeing abuse, lower max reward
   - If too restrictive, increase limits

4. **Consider hybrid approach**
   - Use simple contract for casual play
   - Use signed contract for tournaments

## Support

Need help? Check:
- [Main README](./README.md)
- [Gas Costs Guide](./GAS_COSTS.md)
- [Verifier Setup](./VERIFIER_SETUP.md) (for original contract)

---

**🎉 Congratulations! You now have a truly permissionless reward system!**

Connect → Play → Claim. That's it! 🚀

