# Deployment Guide

## Environment Setup

### Required Environment Variables

```env
# API
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_URL=wss://ws.yourdomain.com

# Blockchain
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_GAME_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_GAME_REWARDS_ADDRESS=0x...

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://...

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
```

## Build & Deploy

### Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t game-app .
docker run -p 3000:3000 game-app
```

### Vercel Deployment

```bash
vercel --prod
```

## CI/CD Pipeline

GitHub Actions workflow automatically:

1. Runs linting and type checking
2. Executes test suite
3. Builds production bundle
4. Deploys to staging
5. Runs E2E tests
6. Promotes to production

## Smart Contract Deployment

### Hardhat Deployment

```bash
npx hardhat compile
npx hardhat test
npx hardhat deploy --network base
```

### Contract Verification

```bash
npx hardhat verify --network base DEPLOYED_ADDRESS
```

## Monitoring

### Application Monitoring

- Sentry for error tracking
- Google Analytics for user behavior
- Custom performance metrics

### Infrastructure Monitoring

- Server health checks
- Database performance
- API response times
- WebSocket connections

## Rollback Procedure

```bash
# Revert to previous deployment
vercel rollback

# Or use git
git revert HEAD
git push origin main
```

## Security Checklist

- [ ] Environment variables secured
- [ ] API rate limiting enabled
- [ ] CORS configured correctly
- [ ] Smart contracts audited
- [ ] Security headers configured
- [ ] Input sanitization verified
- [ ] Authentication implemented
- [ ] HTTPS enforced
