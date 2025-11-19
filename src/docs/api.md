# API Documentation

## Game Engine API

### GameEngine

Main orchestrator for the game loop.

```typescript
const engine = new GameEngine(canvas, config)
engine.start()
engine.pause()
engine.reset()
```

### Physics

```typescript
// Collision detection
checkAABB(a: AABB, b: AABB): boolean
checkSAT(poly1: Polygon, poly2: Polygon): boolean

// Spatial partitioning
const quadtree = new Quadtree(bounds, capacity)
quadtree.insert(entity)
quadtree.query(range): Entity[]
```

### Player

```typescript
player.jump()
player.moveLeft()
player.moveRight()
player.applyPowerUp(powerUp)
```

## Wallet API

### Contract Service

```typescript
// Read operations
const balance = await contractService.getBalance(address)
const rewards = await contractService.getPendingRewards(address)

// Write operations
await contractService.claimRewards()
await contractService.approveToken(spender, amount)
```

### Hooks

```typescript
// Token balance
const { balance, isLoading } = useTokenBalance()

// Rewards
const { rewards, claim } = useRewards()

// Transaction
const { write, isLoading, error } = useContractWrite()
```

## Multiplayer API

### WebSocket Events

```typescript
// Client → Server
socket.emit('room:create', { name, maxPlayers })
socket.emit('room:join', { roomId })
socket.emit('game:input', { keys })

// Server → Client
socket.on('room:created', { roomId, room })
socket.on('game:state', { players, obstacles })
socket.on('player:joined', { player })
```

### Services

```typescript
// Room management
await roomService.create(options)
await roomService.join(roomId)
await roomService.leave()

// Chat
await chatService.send(message)
chatService.onMessage(callback)
```

## State Management

### Zustand Stores

```typescript
// Game store
const { playerHealth, setPlayerHealth, score, increaseScore } = useGameStore()

// Wallet store
const { address, isConnected, connect, disconnect } = useWalletStore()

// UI store
const { theme, setTheme, isModalOpen, toggleModal } = useUIStore()
```

## Utility Functions

### Validation

```typescript
isEmail(value: string): boolean
isAddress(value: string): boolean
isNumeric(value: string): boolean
```

### Formatting

```typescript
formatNumber(num: number, options?): string
formatCurrency(amount: number, currency?): string
formatAddress(address: string): string
formatDate(date: Date, options?): string
```

### Async

```typescript
retry(fn, options): Promise<T>
timeout(promise, ms): Promise<T>
debounceAsync(fn, delay): Function
```
