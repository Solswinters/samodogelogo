# Jump Game - Onchain Rewards on Base

A multiplayer jump obstacle game built on Base blockchain where players earn ERC20 tokens based on their performance. Features real-time multiplayer gameplay, signature-based reward verification, and seamless Web3 integration with Reown/WalletConnect.

![Jump Game Banner](./samodoge.png)

## 🎮 Features

- **Single & Multiplayer Modes**: Play solo or compete with up to 4 players in real-time
- **Increasing Difficulty**: Game speed and obstacle frequency increase every 10 seconds
- **Onchain Rewards**: Earn JUMP tokens directly to your wallet based on your score
- **Winner Bonuses**: Multiplayer winners receive a 1.5x reward multiplier
- **Anti-Cheat System**: Server-side signature verification prevents reward manipulation
- **Cooldown Protection**: 1-hour cooldown between reward claims
- **Real-time Synchronization**: WebSocket-based multiplayer with smooth player movement

## 🏗️ Architecture

### Smart Contracts (Solidity)
- **GameToken.sol**: ERC20 token with minting and burning capabilities
- **GameRewards.sol**: Manages reward distribution with signature verification

### Frontend (Next.js 14)
- React with TypeScript
- TailwindCSS for styling
- Canvas-based game rendering
- Reown/WalletConnect integration
- wagmi + viem for contract interactions

### Backend (Next.js API Routes)
- Signature generation for reward claims
- Reward estimation
- Anti-replay protection with nonce management

### Multiplayer (Socket.io)
- Room-based matchmaking (4 players per room)
- Real-time position synchronization
- Shared obstacle course
- Winner determination

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A wallet with Base Sepolia ETH for testing
- Reown Project ID (get from https://cloud.reown.com)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd samodogelogo
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install contract dependencies
cd contracts
npm install
cd ..
```

3. **Configure environment variables**

Create `.env.local` in the root directory:
```env
# Reown/WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Contract addresses (will be filled after deployment)
NEXT_PUBLIC_GAME_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_GAME_REWARDS_ADDRESS=0x...

# Socket.io server URL (optional, defaults to localhost:3000)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000

# Backend verifier private key (for signing rewards)
VERIFIER_PRIVATE_KEY=0x...
```

Create `.env` in the `contracts/` directory:
```env
PRIVATE_KEY=your_deployment_private_key
BASESCAN_API_KEY=your_basescan_api_key
VERIFIER_PRIVATE_KEY=your_backend_verifier_private_key
```

### Deploy Smart Contracts

1. **Compile contracts**
```bash
cd contracts
npm run compile
```

2. **Deploy to Base Sepolia (testnet)**
```bash
npm run deploy:base-sepolia
```

3. **Copy contract addresses** from the deployment output and update your `.env.local` file

4. **Fund the GameRewards contract** with tokens for distribution

### Run the Application

1. **Start the development server**
```bash
npm run dev
```

2. **Open your browser** and navigate to `http://localhost:3000`

3. **Connect your wallet** using the "Connect Wallet" button

4. **Play the game** and earn rewards!

## 🎯 How to Play

1. **Choose Game Mode**: Select Single Player or Multiplayer
2. **Jump**: Press SPACE or click/tap to jump over obstacles
3. **Survive**: Avoid obstacles and survive as long as possible
4. **Earn**: Your score increases based on time survived and obstacles cleared
5. **Claim**: After game over, claim your JUMP tokens (requires wallet connection)

## 💰 Reward System

- **Base Reward**: 10 JUMP tokens per game
- **Score Bonus**: +1 token per 100 points scored
- **Winner Multiplier**: 1.5x for multiplayer winners
- **Cooldown**: 1 hour between claims per wallet

**Example**: Score of 500 as multiplayer winner = (10 + 5) × 1.5 = **22.5 JUMP**

## 🔧 Technical Details

### Game Physics
- Gravity: 0.8
- Jump Force: -15
- Initial Speed: 5
- Max Speed: 15
- Player Size: 40x60
- Ground Level: Y=320

### Difficulty Scaling
- Speed increases by 30% every 10 seconds
- Obstacle spawn rate increases proportionally
- Maximum speed cap at 15

### Smart Contract Security
- Signature verification using ECDSA
- Nonce-based replay attack prevention
- Cooldown period enforcement
- ReentrancyGuard on claim function

### Multiplayer Architecture
- Socket.io for WebSocket communication
- Host-client model for obstacle synchronization
- Position updates every frame
- Automatic winner determination when all players die

## 📁 Project Structure

```
samodogelogo/
├── contracts/              # Smart contracts
│   ├── contracts/
│   │   ├── GameToken.sol
│   │   └── GameRewards.sol
│   ├── scripts/
│   │   └── deploy.js
│   └── hardhat.config.js
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   └── game/
│   │   │       ├── claim/
│   │   │       └── estimate/
│   │   ├── layout.tsx
│   │   └── page.tsx       # Main game page
│   ├── components/
│   │   ├── Game/
│   │   │   ├── GameEngine.tsx
│   │   │   └── GameOver.tsx
│   │   ├── WalletConnect.tsx
│   │   └── Web3Provider.tsx
│   ├── hooks/
│   │   ├── useGameContract.ts
│   │   └── useMultiplayer.ts
│   ├── lib/
│   │   ├── contracts.ts   # ABIs and addresses
│   │   ├── game-logic.ts  # Game physics and logic
│   │   └── web3.ts        # Web3 configuration
│   ├── server/
│   │   └── multiplayer.ts # Socket.io server
│   └── styles/
│       └── globals.css
├── package.json
└── README.md
```

## 🧪 Testing

### Test Smart Contracts
```bash
cd contracts
npx hardhat test
```

### Test Frontend
```bash
npm run build
npm start
```

## 🚢 Deployment

### Production Deployment

1. **Deploy contracts to Base mainnet**
```bash
cd contracts
npm run deploy:base
```

2. **Update environment variables** with mainnet contract addresses

3. **Build and deploy frontend**
```bash
npm run build
```

Deploy to Vercel, Netlify, or your preferred hosting platform.

4. **Configure WebSocket server** for multiplayer (separate deployment or same instance)

## 🔐 Security Considerations

- Never commit private keys or sensitive environment variables
- The VERIFIER_PRIVATE_KEY should be kept secure on the backend only
- Rate limit the claim API endpoint in production
- Implement additional anti-cheat measures for production (session tracking, behavioral analysis)
- Consider using a database to track claims and prevent abuse

## 🛠️ Built With

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Solidity](https://soliditylang.org/) - Smart contracts
- [Hardhat](https://hardhat.org/) - Contract development
- [wagmi](https://wagmi.sh/) - React hooks for Ethereum
- [viem](https://viem.sh/) - TypeScript Ethereum library
- [Reown/WalletConnect](https://reown.com/) - Wallet connection
- [Socket.io](https://socket.io/) - Real-time communication
- [Base](https://base.org/) - L2 blockchain

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

Made with ❤️ for the onchain gaming community

