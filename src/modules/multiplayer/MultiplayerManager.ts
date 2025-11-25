/**
 * Multiplayer Manager - Central orchestrator for multiplayer functionality
 */

import { WebSocketService } from './services/WebSocketService'
import { RoomService } from './services/RoomService'
import { ChatService } from './services/ChatService'
import { MatchmakingService } from './services/MatchmakingService'
import { SyncService } from './services/SyncService'
import { LatencyService } from './services/LatencyService'
import { PresenceService } from './services/PresenceService'
import { PlayerService } from './services/PlayerService'
import { ConnectionRecoveryService } from './services/ConnectionRecoveryService'
import { MessageProtocol, MessageType, type Message } from './protocols/MessageProtocol'
import { ConnectionState, ConnectionStatus } from './state/ConnectionState'
import { RoomState } from './state/RoomState'
import { GameState, GamePhase } from './state/GameState'
import { PlayerCache } from './cache/PlayerCache'
import { RoomCache } from './cache/RoomCache'

export interface MultiplayerConfig {
  wsUrl: string
  autoReconnect?: boolean
  maxReconnectAttempts?: number
  reconnectDelay?: number
  heartbeatInterval?: number
  syncInterval?: number
  enableLatencyTracking?: boolean
  enablePresence?: boolean
  enableChat?: boolean
}

export interface PlayerInfo {
  id: string
  name: string
  walletAddress?: string
  avatar?: string
  score?: number
  isReady?: boolean
  latency?: number
}

export interface RoomInfo {
  id: string
  name: string
  host: string
  players: PlayerInfo[]
  maxPlayers: number
  isPrivate: boolean
  gameMode?: string
  status: 'waiting' | 'playing' | 'finished'
  createdAt: number
}

export interface GameStateUpdate {
  timestamp: number
  playerId: string
  position?: { x: number; y: number }
  velocity?: { x: number; y: number }
  score?: number
  health?: number
  powerUps?: string[]
  actions?: string[]
}

export type MultiplayerEventType =
  | 'connected'
  | 'disconnected'
  | 'reconnecting'
  | 'reconnected'
  | 'room_joined'
  | 'room_left'
  | 'player_joined'
  | 'player_left'
  | 'player_ready'
  | 'game_started'
  | 'game_ended'
  | 'state_update'
  | 'chat_message'
  | 'error'

export type MultiplayerEventHandler = (data?: any) => void

export class MultiplayerManager {
  private wsService: WebSocketService
  private roomService: RoomService
  private chatService: ChatService
  private matchmakingService: MatchmakingService
  private syncService: SyncService
  private latencyService: LatencyService
  private presenceService: PresenceService
  private playerService: PlayerService
  private recoveryService: ConnectionRecoveryService

  private connectionState: ConnectionState
  private roomState: RoomState
  private gameState: GameState
  private playerCache: PlayerCache
  private roomCache: RoomCache

  private eventHandlers: Map<MultiplayerEventType, Set<MultiplayerEventHandler>>
  private config: Required<MultiplayerConfig>
  private currentPlayer: PlayerInfo | null = null
  private currentRoom: RoomInfo | null = null

  private heartbeatTimer: NodeJS.Timeout | null = null
  private syncTimer: NodeJS.Timeout | null = null

  constructor(config: MultiplayerConfig) {
    this.config = {
      autoReconnect: true,
      maxReconnectAttempts: 5,
      reconnectDelay: 2000,
      heartbeatInterval: 10000,
      syncInterval: 100,
      enableLatencyTracking: true,
      enablePresence: true,
      enableChat: true,
      ...config,
    }

    // Initialize services
    this.wsService = new WebSocketService(config.wsUrl)
    this.roomService = new RoomService()
    this.chatService = new ChatService()
    this.matchmakingService = new MatchmakingService()
    this.syncService = new SyncService()
    this.latencyService = new LatencyService()
    this.presenceService = new PresenceService()
    this.playerService = new PlayerService()
    this.recoveryService = new ConnectionRecoveryService()

    // Initialize state
    this.connectionState = new ConnectionState()
    this.roomState = new RoomState()
    this.gameState = new GameState()
    this.playerCache = new PlayerCache()
    this.roomCache = new RoomCache()

    this.eventHandlers = new Map()

    this.setupMessageHandlers()
  }

  /**
   * Setup WebSocket message handlers
   */
  private setupMessageHandlers(): void {
    this.wsService.on('open', () => {
      this.connectionState.setStatus(ConnectionStatus.CONNECTED)
      this.emit('connected')
      this.startHeartbeat()

      if (this.config.enablePresence) {
        this.presenceService.updateStatus('online')
      }
    })

    this.wsService.on('close', () => {
      this.connectionState.setStatus(ConnectionStatus.DISCONNECTED)
      this.emit('disconnected')
      this.stopHeartbeat()
      this.stopSync()

      if (this.config.autoReconnect) {
        this.handleReconnect()
      }
    })

    this.wsService.on('error', (error: Error) => {
      this.emit('error', { error: error.message })
    })

    this.wsService.on('message', (message: Message) => {
      this.handleMessage(message)
    })
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(message: Message): void {
    switch (message.type) {
      case MessageType.ROOM_JOINED:
        this.handleRoomJoined(message.payload)
        break
      case MessageType.ROOM_LEFT:
        this.handleRoomLeft(message.payload)
        break
      case MessageType.PLAYER_JOINED:
        this.handlePlayerJoined(message.payload)
        break
      case MessageType.PLAYER_LEFT:
        this.handlePlayerLeft(message.payload)
        break
      case MessageType.PLAYER_READY:
        this.handlePlayerReady(message.payload)
        break
      case MessageType.GAME_STARTED:
        this.handleGameStarted(message.payload)
        break
      case MessageType.GAME_ENDED:
        this.handleGameEnded(message.payload)
        break
      case MessageType.STATE_UPDATE:
        this.handleStateUpdate(message.payload)
        break
      case MessageType.CHAT_MESSAGE:
        this.handleChatMessage(message.payload)
        break
      case MessageType.ERROR:
        this.emit('error', message.payload)
        break
    }
  }

  /**
   * Connect to multiplayer server
   */
  async connect(playerInfo: PlayerInfo): Promise<void> {
    this.currentPlayer = playerInfo
    this.connectionState.setStatus(ConnectionStatus.CONNECTING)

    try {
      await this.wsService.connect()

      // Send authentication message
      this.send({
        type: MessageType.CONNECT,
        payload: {
          player: playerInfo,
          timestamp: Date.now(),
        },
      })
    } catch (error) {
      this.connectionState.setStatus(ConnectionStatus.DISCONNECTED)
      throw error
    }
  }

  /**
   * Disconnect from multiplayer server
   */
  disconnect(): void {
    this.stopHeartbeat()
    this.stopSync()

    if (this.currentRoom) {
      this.leaveRoom()
    }

    this.wsService.disconnect()
    this.connectionState.setStatus(ConnectionStatus.DISCONNECTED)
    this.currentPlayer = null
  }

  /**
   * Create a new room
   */
  async createRoom(roomInfo: Partial<RoomInfo>): Promise<RoomInfo> {
    if (!this.isConnected()) {
      throw new Error('Not connected to server')
    }

    const room = await this.roomService.createRoom({
      ...roomInfo,
      host: this.currentPlayer!.id,
      players: [this.currentPlayer!],
      createdAt: Date.now(),
    })

    this.send({
      type: MessageType.ROOM_CREATE,
      payload: { room },
    })

    return room
  }

  /**
   * Join an existing room
   */
  async joinRoom(roomId: string, password?: string): Promise<void> {
    if (!this.isConnected()) {
      throw new Error('Not connected to server')
    }

    this.send({
      type: MessageType.ROOM_JOIN,
      payload: {
        roomId,
        player: this.currentPlayer,
        password,
      },
    })
  }

  /**
   * Leave current room
   */
  leaveRoom(): void {
    if (!this.currentRoom) return

    this.send({
      type: MessageType.ROOM_LEAVE,
      payload: {
        roomId: this.currentRoom.id,
        playerId: this.currentPlayer!.id,
      },
    })

    this.stopSync()
    this.currentRoom = null
    this.roomState.reset()
    this.gameState.reset()
  }

  /**
   * Set player ready status
   */
  setReady(isReady: boolean): void {
    if (!this.currentRoom) return

    this.send({
      type: MessageType.PLAYER_READY,
      payload: {
        roomId: this.currentRoom.id,
        playerId: this.currentPlayer!.id,
        isReady,
      },
    })
  }

  /**
   * Start game (host only)
   */
  startGame(): void {
    if (!this.currentRoom) return
    if (this.currentRoom.host !== this.currentPlayer!.id) {
      throw new Error('Only the host can start the game')
    }

    this.send({
      type: MessageType.GAME_START,
      payload: {
        roomId: this.currentRoom.id,
      },
    })
  }

  /**
   * Send game state update
   */
  sendStateUpdate(update: GameStateUpdate): void {
    if (!this.currentRoom || this.gameState.phase !== GamePhase.PLAYING) return

    this.send({
      type: MessageType.STATE_UPDATE,
      payload: {
        roomId: this.currentRoom.id,
        update,
      },
    })
  }

  /**
   * Send chat message
   */
  sendChatMessage(message: string): void {
    if (!this.currentRoom || !this.config.enableChat) return

    this.send({
      type: MessageType.CHAT_MESSAGE,
      payload: {
        roomId: this.currentRoom.id,
        playerId: this.currentPlayer!.id,
        playerName: this.currentPlayer!.name,
        message,
        timestamp: Date.now(),
      },
    })
  }

  /**
   * Find match through matchmaking
   */
  async findMatch(criteria?: {
    gameMode?: string
    skillLevel?: number
    region?: string
  }): Promise<RoomInfo> {
    if (!this.isConnected()) {
      throw new Error('Not connected to server')
    }

    return this.matchmakingService.findMatch({
      playerId: this.currentPlayer!.id,
      ...criteria,
    })
  }

  /**
   * Get list of available rooms
   */
  async getRooms(filter?: {
    gameMode?: string
    isPrivate?: boolean
    hasSlots?: boolean
  }): Promise<RoomInfo[]> {
    return this.roomService.getRooms(filter)
  }

  /**
   * Get current latency
   */
  getLatency(): number {
    return this.latencyService.getLatency()
  }

  /**
   * Check if connected to server
   */
  isConnected(): boolean {
    return this.connectionState.status === ConnectionStatus.CONNECTED
  }

  /**
   * Check if in a room
   */
  isInRoom(): boolean {
    return this.currentRoom !== null
  }

  /**
   * Check if game is active
   */
  isGameActive(): boolean {
    return this.gameState.phase === GamePhase.PLAYING
  }

  /**
   * Get current player info
   */
  getCurrentPlayer(): PlayerInfo | null {
    return this.currentPlayer
  }

  /**
   * Get current room info
   */
  getCurrentRoom(): RoomInfo | null {
    return this.currentRoom
  }

  /**
   * Get game state
   */
  getGameState(): GameState {
    return this.gameState
  }

  /**
   * Subscribe to multiplayer events
   */
  on(event: MultiplayerEventType, handler: MultiplayerEventHandler): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set())
    }

    this.eventHandlers.get(event)!.add(handler)

    // Return unsubscribe function
    return () => {
      this.eventHandlers.get(event)?.delete(handler)
    }
  }

  /**
   * Emit event to subscribers
   */
  private emit(event: MultiplayerEventType, data?: any): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data)
        } catch (error) {
          console.error(`Error in ${event} handler:`, error)
        }
      })
    }
  }

  /**
   * Send message to server
   */
  private send(message: Partial<Message>): void {
    const fullMessage: Message = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...message,
    } as Message

    this.wsService.send(fullMessage)
  }

  /**
   * Handle reconnection logic
   */
  private async handleReconnect(): Promise<void> {
    this.connectionState.setStatus(ConnectionStatus.RECONNECTING)
    this.emit('reconnecting')

    let attempts = 0

    while (attempts < this.config.maxReconnectAttempts) {
      attempts++

      try {
        await new Promise((resolve) => setTimeout(resolve, this.config.reconnectDelay))
        await this.connect(this.currentPlayer!)

        // Rejoin room if we were in one
        if (this.currentRoom) {
          await this.joinRoom(this.currentRoom.id)
        }

        this.emit('reconnected')
        return
      } catch (error) {
        console.error(`Reconnection attempt ${attempts} failed:`, error)
      }
    }

    this.connectionState.setStatus(ConnectionStatus.DISCONNECTED)
    this.emit('error', { error: 'Failed to reconnect after maximum attempts' })
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.stopHeartbeat()

    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send({
          type: MessageType.HEARTBEAT,
          payload: { timestamp: Date.now() },
        })
      }
    }, this.config.heartbeatInterval)
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * Start game state synchronization
   */
  private startSync(): void {
    this.stopSync()

    this.syncTimer = setInterval(() => {
      if (this.isGameActive()) {
        const state = this.syncService.getLocalState()
        this.sendStateUpdate(state)
      }
    }, this.config.syncInterval)
  }

  /**
   * Stop game state synchronization
   */
  private stopSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer)
      this.syncTimer = null
    }
  }

  /**
   * Handle room joined message
   */
  private handleRoomJoined(payload: any): void {
    this.currentRoom = payload.room
    this.roomState.updateRoom(payload.room)
    this.emit('room_joined', payload.room)
  }

  /**
   * Handle room left message
   */
  private handleRoomLeft(payload: any): void {
    this.currentRoom = null
    this.roomState.reset()
    this.emit('room_left')
  }

  /**
   * Handle player joined message
   */
  private handlePlayerJoined(payload: any): void {
    if (this.currentRoom) {
      this.currentRoom.players.push(payload.player)
      this.playerCache.addPlayer(payload.player)
    }
    this.emit('player_joined', payload.player)
  }

  /**
   * Handle player left message
   */
  private handlePlayerLeft(payload: any): void {
    if (this.currentRoom) {
      this.currentRoom.players = this.currentRoom.players.filter((p) => p.id !== payload.playerId)
      this.playerCache.removePlayer(payload.playerId)
    }
    this.emit('player_left', payload)
  }

  /**
   * Handle player ready message
   */
  private handlePlayerReady(payload: any): void {
    if (this.currentRoom) {
      const player = this.currentRoom.players.find((p) => p.id === payload.playerId)
      if (player) {
        player.isReady = payload.isReady
      }
    }
    this.emit('player_ready', payload)
  }

  /**
   * Handle game started message
   */
  private handleGameStarted(payload: any): void {
    this.gameState.setPhase(GamePhase.PLAYING)
    this.startSync()
    this.emit('game_started', payload)
  }

  /**
   * Handle game ended message
   */
  private handleGameEnded(payload: any): void {
    this.gameState.setPhase(GamePhase.ENDED)
    this.stopSync()
    this.emit('game_ended', payload)
  }

  /**
   * Handle state update message
   */
  private handleStateUpdate(payload: any): void {
    this.syncService.applyRemoteState(payload.update)
    this.emit('state_update', payload.update)
  }

  /**
   * Handle chat message
   */
  private handleChatMessage(payload: any): void {
    if (this.config.enableChat) {
      this.chatService.addMessage(payload)
      this.emit('chat_message', payload)
    }
  }

  /**
   * Cleanup and destroy manager
   */
  destroy(): void {
    this.disconnect()
    this.eventHandlers.clear()
    this.playerCache.clear()
    this.roomCache.clear()
  }
}

// Export singleton instance
let multiplayerManagerInstance: MultiplayerManager | null = null

/**
 * getMultiplayerManager utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getMultiplayerManager.
 */
export function getMultiplayerManager(config?: MultiplayerConfig): MultiplayerManager {
  if (!multiplayerManagerInstance && config) {
    multiplayerManagerInstance = new MultiplayerManager(config)
  }

  if (!multiplayerManagerInstance) {
    throw new Error('Multiplayer manager not initialized. Provide config on first call.')
  }

  return multiplayerManagerInstance
}

/**
 * resetMultiplayerManager utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of resetMultiplayerManager.
 */
export function resetMultiplayerManager(): void {
  if (multiplayerManagerInstance) {
    multiplayerManagerInstance.destroy()
    multiplayerManagerInstance = null
  }
}
