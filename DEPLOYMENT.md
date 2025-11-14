# Deployment Configuration

## Deployed Contracts

### GameToken Contract
- **Address**: `0xa294FfD0E35ba61BCD8bd0a4D7Eda5bCb83BC24F`
- **Network**: Base Sepolia (testnet) or Base Mainnet
- **Token Name**: Jump Game Token
- **Token Symbol**: JUMP
- **Initial Supply**: 10,000,000 JUMP
- **Max Supply**: 100,000,000 JUMP

### GameRewards Contract
- **Address**: `0x070D2758aFD45504490A7aFD76c6cF1a5B2C5828`
- **Network**: Same as GameToken

## Environment Variables Setup

Create a `.env.local` file in the root directory with the following:

```env
# Reown/WalletConnect Project ID
# Get from: https://cloud.reown.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Deployed Contract Addresses
NEXT_PUBLIC_GAME_TOKEN_ADDRESS=0xa294FfD0E35ba61BCD8bd0a4D7Eda5bCb83BC24F
NEXT_PUBLIC_GAME_REWARDS_ADDRESS=your_game_rewards_address_here

# Socket.io Configuration
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend Verifier Private Key (KEEP SECRET!)
# This private key is used to sign reward claims
# Generate a new one: openssl rand -hex 32
VERIFIER_PRIVATE_KEY=0x...your_private_key_here
```

## Next Steps

### 1. Deploy GameRewards Contract

If you haven't deployed the GameRewards contract yet:

```bash
cd contracts
npm install
npm run deploy:base-sepolia  # or deploy:base for mainnet
```

After deployment:
1. Copy the GameRewards address
2. Update `NEXT_PUBLIC_GAME_REWARDS_ADDRESS` in `.env.local`
3. Transfer JUMP tokens to the GameRewards contract for distribution

### 2. Configure GameToken

The GameToken contract needs to know about the GameRewards contract:

```bash
# Using a contract interaction tool or Etherscan
# Call: setGameRewardsContract(gameRewardsAddress)
```

### 3. Fund GameRewards Contract

Transfer tokens to GameRewards for player rewards:

```bash
# Recommended: 5,000,000 JUMP tokens
# This allows for approximately 500,000 game sessions
```

### 4. Set Up Verifier Private Key

The `VERIFIER_PRIVATE_KEY` should be a wallet that the GameRewards contract trusts:

1. Generate a new private key (don't use your deployment key!)
2. Add the address as the verifier in GameRewards contract
3. Keep this key secure - it's used to sign reward claims

### 5. Get WalletConnect Project ID

1. Visit https://cloud.reown.com
2. Create a new project
3. Copy the Project ID
4. Update `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

## Contract Verification

Verify your contracts on Basescan for transparency:

```bash
cd contracts
npm run verify:base-sepolia  # or verify:base for mainnet
```

## Testing the Deployment

1. Start the development server:
```bash
npm run dev
```

2. Open http://localhost:3000

3. Connect your wallet (should have Base Sepolia ETH)

4. Play a game and test reward claiming

## Production Deployment

### Frontend Deployment (Vercel/Netlify)

1. Update environment variables in your hosting platform
2. Build and deploy:
```bash
npm run build
npm start
```

### Important Production Changes

1. **Update CORS settings** in `server.js` to match your domain
2. **Secure the verifier private key** using a secrets manager
3. **Add rate limiting** to the `/api/game/claim` endpoint
4. **Set up monitoring** for contract interactions
5. **Deploy Socket.io server** separately or on same instance

## Security Checklist

- [ ] GameToken contract verified on Basescan
- [ ] GameRewards contract verified on Basescan
- [ ] Verifier private key is secure and not exposed
- [ ] Contract ownership transferred to secure multisig (if applicable)
- [ ] Rate limiting enabled on API endpoints
- [ ] Environment variables set in production
- [ ] Test reward claiming on testnet first
- [ ] Monitor for suspicious activity

## Monitoring

Watch these metrics:
- Total tokens distributed
- Number of unique players
- Average score per game
- Reward claim frequency
- Failed transactions

## Support

For issues or questions:
- Check contract on Basescan: https://basescan.org/address/0xa294FfD0E35ba61BCD8bd0a4D7Eda5bCb83BC24F
- Review deployment logs
- Test on Base Sepolia first before mainnet

