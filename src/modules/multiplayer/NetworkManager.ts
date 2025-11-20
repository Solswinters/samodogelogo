/**
 * Network Manager - Handle client-server communication for multiplayer
 */

export enum NetworkEventType {
  // Connection
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  RECONNECT = 'reconnect',
  CONNECTION_ERROR = 'connection_error',

  // Room
  ROOM_JOINED = 'room_joined',
  ROOM_LEFT = 'room_left',
  ROOM_UPDATED = 'room_updated',

  // Players
  PLAYER_JOINED = 'player_joined',
  PLAYER_LEFT = 'player_left',
  PLAYER_STATE_UPDATE = 'player_state_update',

  // Game
  GAME_START = 'game_start',
  GAME_END = 'game_end',
  GAME_STATE_UPDATE = 'game_state_update',

  // Chat
  CHAT_MESSAGE = 'chat_message',

  // Custom
  CUSTOM = 'custom',
}

export interface NetworkMessage {
  type: NetworkEventType
  data: any
  timestamp: number
  senderId?: string
}

export interface ConnectionConfig {
  url: string
  autoReconnect?: boolean
  reconnectDelay?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
  timeout?: number
}

export interface NetworkStats {
  latency: number
  packetsSent: number
  packetsReceived: number
  bytesSent: number
  bytesReceived: number
  connectionTime: number
  reconnectAttempts: number
}

type EventCallback = (data: any) => void

export class NetworkManager {
  private ws: WebSocket | null = null
  private config: ConnectionConfig
  private eventHandlers: Map<NetworkEventType | string, Set<EventCallback>> = new Map()
  private connectionState: 'disconnected' | 'connecting' | 'connected' | 'reconnecting' =
    'disconnected'
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private reconnectAttempts: number = 0
  private stats: NetworkStats = {
    latency: 0,
    packetsSent: 0,
    packetsReceived: 0,
    bytesSent: 0,
    bytesReceived: 0,
    connectionTime: 0,
    reconnectAttempts: 0,
  }
  private lastHeartbeat: number = 0
  private messageQueue: NetworkMessage[] = []

  constructor(config: ConnectionConfig) {
    this.config = {
      autoReconnect: true,
      reconnectDelay: 3000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      timeout: 10000,
      ...config,
    }
  }

  /**
   * Connect to server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connectionState === 'connected') {
        resolve()
        return
      }

      this.connectionState = 'connecting'

      try {
        this.ws = new WebSocket(this.config.url)

        const timeout = setTimeout(() => {
          if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
            this.ws.close()
            reject(new Error('Connection timeout'))
          }
        }, this.config.timeout)

        this.ws.onopen = () => {
          clearTimeout(timeout)
          this.connectionState = 'connected'
          this.reconnectAttempts = 0
          this.stats.connectionTime = Date.now()
          this.startHeartbeat()
          this.processMessageQueue()
          this.emit(NetworkEventType.CONNECT, {})
          resolve()
        }

        this.ws.onclose = (event) => {
          clearTimeout(timeout)
          this.handleDisconnect(event.wasClean)
        }

        this.ws.onerror = (error) => {
          clearTimeout(timeout)
          this.emit(NetworkEventType.CONNECTION_ERROR, { error })
          reject(error)
        }

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.stopHeartbeat()
    this.stopReconnect()
    this.connectionState = 'disconnected'
  }

  /**
   * Send message to server
   */
  send(type: NetworkEventType | string, data: any): void {
    const message: NetworkMessage = {
      type: type as NetworkEventType,
      data,
      timestamp: Date.now(),
    }

    if (this.connectionState !== 'connected') {
      // Queue message for later
      this.messageQueue.push(message)
      return
    }

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not open')
      return
    }

    const messageString = JSON.stringify(message)
    this.ws.send(messageString)

    this.stats.packetsSent++
    this.stats.bytesSent += messageString.length
  }

  /**
   * Subscribe to network event
   */
  on(event: NetworkEventType | string, callback: EventCallback): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set())
    }

    this.eventHandlers.get(event)!.add(callback)
  }

  /**
   * Unsubscribe from network event
   */
  off(event: NetworkEventType | string, callback: EventCallback): void {
    const handlers = this.eventHandlers.get(event)

    if (handlers) {
      handlers.delete(callback)
    }
  }

  /**
   * Emit network event
   */
  private emit(event: NetworkEventType | string, data: any): void {
    const handlers = this.eventHandlers.get(event)

    if (handlers) {
      handlers.forEach((callback) => callback(data))
    }
  }

  /**
   * Handle incoming message
   */
  private handleMessage(data: string): void {
    try {
      const message: NetworkMessage = JSON.parse(data)

      this.stats.packetsReceived++
      this.stats.bytesReceived += data.length

      // Handle heartbeat response
      if (message.type === ('heartbeat_response' as any)) {
        this.stats.latency = Date.now() - this.lastHeartbeat
        return
      }

      // Emit event to handlers
      this.emit(message.type, message.data)
    } catch (error) {
      console.error('Failed to parse network message:', error)
    }
  }

  /**
   * Handle disconnection
   */
  private handleDisconnect(wasClean: boolean): void {
    this.connectionState = 'disconnected'
    this.stopHeartbeat()

    this.emit(NetworkEventType.DISCONNECT, { wasClean })

    // Auto-reconnect if enabled
    if (this.config.autoReconnect && this.reconnectAttempts < this.config.maxReconnectAttempts!) {
      this.attemptReconnect()
    }
  }

  /**
   * Attempt reconnection
   */
  private attemptReconnect(): void {
    if (this.reconnectTimer) {
      return
    }

    this.connectionState = 'reconnecting'
    this.reconnectAttempts++
    this.stats.reconnectAttempts++

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null

      this.connect()
        .then(() => {
          this.emit(NetworkEventType.RECONNECT, {
            attempts: this.reconnectAttempts,
          })
        })
        .catch(() => {
          if (this.reconnectAttempts < this.config.maxReconnectAttempts!) {
            this.attemptReconnect()
          } else {
            this.emit(NetworkEventType.CONNECTION_ERROR, {
              error: 'Max reconnection attempts reached',
            })
          }
        })
    }, this.config.reconnectDelay)
  }

  /**
   * Stop reconnection attempts
   */
  private stopReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  /**
   * Start heartbeat
   */
  private startHeartbeat(): void {
    if (this.heartbeatTimer) {
      return
    }

    this.heartbeatTimer = setInterval(() => {
      this.lastHeartbeat = Date.now()
      this.send('heartbeat' as any, {})
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
   * Process queued messages
   */
  private processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()!
      this.send(message.type, message.data)
    }
  }

  /**
   * Get connection state
   */
  getState(): typeof this.connectionState {
    return this.connectionState
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connectionState === 'connected' && this.ws?.readyState === WebSocket.OPEN
  }

  /**
   * Get network statistics
   */
  getStats(): NetworkStats {
    return { ...this.stats }
  }

  /**
   * Get latency
   */
  getLatency(): number {
    return this.stats.latency
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      latency: 0,
      packetsSent: 0,
      packetsReceived: 0,
      bytesSent: 0,
      bytesReceived: 0,
      connectionTime: this.stats.connectionTime,
      reconnectAttempts: 0,
    }
  }

  /**
   * Clear message queue
   */
  clearQueue(): void {
    this.messageQueue = []
  }

  /**
   * Get queued message count
   */
  getQueueSize(): number {
    return this.messageQueue.length
  }
}

export default NetworkManager
