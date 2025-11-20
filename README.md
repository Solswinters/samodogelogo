# Jump Game - Onchain Rewards

A high-performance jump obstacle game with blockchain rewards built on Base.

## Features

- 🎮 **Smooth Gameplay** - 60 FPS game engine with physics
- 🎯 **Power-ups & Obstacles** - Dynamic difficulty scaling
- 🏆 **Leaderboard** - Compete with other players
- 💰 **Token Rewards** - Earn tokens for high scores
- 🆓 **Gasless Achievement NFTs** - Claim achievements without paying gas fees
- 🏅 **15 Achievement Types** - Common to Legendary rarity system
- 🌐 **Multiplayer** - Real-time multiplayer mode
- 🎨 **Modern UI** - Beautiful, responsive interface
- 🔐 **Web3 Integration** - Connect wallet, claim rewards
- 📱 **Mobile Friendly** - Play on any device

## Quick Start

### Prerequisites

- Node.js 20+
- npm or pnpm
- MetaMask or another Web3 wallet

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/jump-game.git
cd jump-game

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create `.env.local` with the following variables:

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Blockchain
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_GAME_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_GAME_REWARDS_ADDRESS=0x...
NEXT_PUBLIC_GASLESS_ACHIEVEMENTS_ADDRESS=0x2c366F0a2c9CB85ef7e1f6Af7b264640840faA89

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
NEXT_PUBLIC_SENTRY_DSN=https://...
```

## Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run E2E tests
npm run test:all     # Run all tests

# Code Quality
npm run lint         # Lint code
npm run type-check   # Check TypeScript types
npm run format       # Format code

# Tools
npm run clean        # Clean build artifacts
npm run analyze      # Analyze bundle size
npm run storybook    # Start Storybook
```

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router
│   ├── modules/          # Feature modules
│   │   ├── game/        # Game engine
│   │   ├── wallet/      # Web3 integration
│   │   └── multiplayer/ # Real-time features
│   ├── shared/          # Shared code
│   ├── stores/          # State management
│   ├── lib/             # Libraries
│   └── config/          # Configuration
├── contracts/           # Smart contracts
│   └── contracts/
│       ├── GaslessAchievements.sol
│       ├── GameToken.sol
│       └── GameRewards.sol
├── abi.ts               # Contract ABI and configuration
├── public/              # Static assets
├── docs/                # Documentation
└── e2e/                 # E2E tests
```

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand with Immer
- **Web3**: Wagmi, Viem, RainbowKit
- **Testing**: Vitest, Playwright, Storybook
- **Blockchain**: Base (Ethereum L2)

## Game Controls

- **Space** or **Click** - Jump
- **Esc** - Pause
- **R** - Restart

## How to Play

1. **Connect Wallet** - Click "Connect Wallet" to link your Web3 wallet
2. **Start Game** - Click "Play" to begin
3. **Jump Obstacles** - Avoid obstacles by jumping
4. **Collect Power-ups** - Grab power-ups for advantages
5. **Earn Score** - Higher scores = more rewards
6. **Unlock Achievements** - Complete milestones to unlock achievements
7. **Claim Achievement NFTs** - Claim your achievement NFTs without gas fees
8. **Earn Token Rewards** - Submit your score and claim token rewards

## Smart Contracts

### Network

- **Blockchain**: Base (Chain ID: 8453)

### Deployed Contracts

#### 1. GaslessAchievements (NEW)

**Contract Address**: `0x2c366F0a2c9CB85ef7e1f6Af7b264640840faA89`  
**Block Explorer**: [View on BaseScan](https://basescan.org/address/0x2c366F0a2c9CB85ef7e1f6Af7b264640840faA89)

**Features**:

- 🆓 **Gasless Claiming** - Players claim NFTs without paying gas fees (EIP-2771 meta-transactions)
- 🏅 **15 Achievement Types** - From first jump to legendary milestones
- 🎨 **Rarity System** - Common, Rare, Epic, and Legendary achievements
- 👀 **View Functions** - Check eligibility without any gas costs
- 📊 **Player Stats Tracking** - Track jumps, power-ups, obstacles, and more
- 🎁 **Batch Claiming** - Claim multiple achievements at once

**Achievement Types**:

- `FIRST_JUMP` - Complete your first jump (Common)
- `SCORE_100` - Reach score of 100 (Common)
- `SCORE_500` - Reach score of 500 (Rare)
- `SCORE_1000` - Reach score of 1,000 (Rare)
- `SCORE_5000` - Reach score of 5,000 (Epic)
- `CONSECUTIVE_10` - 10 consecutive successful jumps (Rare)
- `CONSECUTIVE_50` - 50 consecutive successful jumps (Epic)
- `POWER_UP_MASTER` - Collect 100 power-ups (Rare)
- `OBSTACLE_DODGER` - Dodge 1,000 obstacles (Epic)
- `SPEED_DEMON` - Complete level at max speed (Epic)
- `DAILY_PLAYER` - Play 7 days in a row (Rare)
- `WEEKLY_CHAMPION` - Top 10 on weekly leaderboard (Epic)
- `MULTIPLAYER_WINNER` - Win 10 multiplayer matches (Epic)
- `TOKEN_EARNER` - Earn 1,000 game tokens (Legendary)
- `EARLY_ADOPTER` - Join in first month (Legendary)

**How Gasless Works**:

1. Player signs a message off-chain (no gas required)
2. Relayer submits the transaction on-chain (relayer pays gas)
3. Player receives achievement NFT without spending any gas

**Usage**:

```typescript
import {
  GASLESS_ACHIEVEMENTS_ADDRESS,
  GASLESS_ACHIEVEMENTS_ABI,
  AchievementType,
  Rarity,
} from './abi'

// Check eligibility (no gas)
const isEligible = await contract.isEligible(playerAddress, AchievementType.SCORE_100)

// Claim achievement (gasless via relayer)
const tokenId = await contract.claimAchievement(AchievementType.SCORE_100)
```

#### 2. Game Token

- **Type**: ERC-20 reward token
- **Purpose**: In-game currency and rewards

#### 3. Rewards Contract

- **Purpose**: Manages score verification and payouts

See [`abi.ts`](./abi.ts) for complete contract ABIs and configuration.

## Development

### Generate Components

```bash
npm run generate:component ButtonPrimary
```

### Generate Hooks

```bash
npm run generate:hook useGameState
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Docker

```bash
docker-compose up -d
```

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

## Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Smart Contracts](./contracts/contracts/GaslessAchievements.sol) - Gasless achievement NFT contract
- [Contract ABI](./abi.ts) - Contract ABI and configuration for frontend integration
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing](./docs/CONTRIBUTING.md)

## Security

- ✅ Input sanitization
- ✅ Rate limiting
- ✅ CSRF protection
- ✅ XSS protection
- ✅ Secure headers

Report security issues to security@example.com

## Performance

- ⚡ Lighthouse score: 95+
- 📦 Bundle size: < 200KB (gzipped)
- 🚀 First Contentful Paint: < 1s
- 🎯 Time to Interactive: < 2s

## License

MIT License - see [LICENSE](./LICENSE) for details

## Support

- 📧 Email: support@example.com
- 💬 Discord: [Join Server](https://discord.gg/example)
- 🐦 Twitter: [@example](https://twitter.com/example)

## Acknowledgments

- Built with ❤️ by the team
- Powered by Base blockchain
- Special thanks to all contributors

---

**Happy Gaming! 🎮**
