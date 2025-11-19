/**
 * Multiplayer module exports
 */

// Components
export { RoomList } from './components/RoomList'
export { RoomLobby } from './components/RoomLobby'
export { ChatBox } from './components/ChatBox'
export { OnlinePlayersList } from './components/OnlinePlayersList'
export { ConnectionIndicator } from './components/ConnectionIndicator'
export { CreateRoomModal } from './components/CreateRoomModal'
export { MatchmakingQueue } from './components/MatchmakingQueue'
export { TeamDisplay } from './components/TeamDisplay'
export { InviteNotification } from './components/InviteNotification'
export { SpectatorList } from './components/SpectatorList'
export { LeaderboardDisplay } from './components/LeaderboardDisplay'
export { StatsDisplay } from './components/StatsDisplay'
export { ReplayList } from './components/ReplayList'
export { ErrorDisplay } from './components/ErrorDisplay'
export { RecoveryBanner } from './components/RecoveryBanner'
export { MultiplayerDashboard } from './components/MultiplayerDashboard'
export { EmoteDisplay } from './components/EmoteDisplay'
export { EmotePicker } from './components/EmotePicker'
export { SessionTimer } from './components/SessionTimer'
export { AnalyticsSummary } from './components/AnalyticsSummary'
export { VoiceChatButton } from './components/VoiceChatButton'
export { PingDisplay } from './components/PingDisplay'
export { RoomSettings } from './components/RoomSettings'
export { PlayerCard } from './components/PlayerCard'
export { GameModeSelector } from './components/GameModeSelector'
export { WaitingRoom } from './components/WaitingRoom'
export { QuickJoin } from './components/QuickJoin'
export { SpectatorView } from './components/SpectatorView'
export { GameResults } from './components/GameResults'
export { TournamentBracket } from './components/TournamentBracket'

// Hooks
export { useWebSocket } from './hooks/useWebSocket'
export { useWebSocketEvent } from './hooks/useWebSocketEvent'
export { useRoom } from './hooks/useRoom'
export { useChat } from './hooks/useChat'
export { usePresence } from './hooks/usePresence'
export { useSync } from './hooks/useSync'
export { useLatency } from './hooks/useLatency'
export { useMatchmaking } from './hooks/useMatchmaking'
export { useMultiplayerStore } from './hooks/useMultiplayerStore'
export { useTeam } from './hooks/useTeam'
export { useInvite } from './hooks/useInvite'
export { useSpectator } from './hooks/useSpectator'
export { useLeaderboard } from './hooks/useLeaderboard'
export { useStats } from './hooks/useStats'
export { useReplay } from './hooks/useReplay'
export { useConnectionRecovery } from './hooks/useConnectionRecovery'
export { useEmote } from './hooks/useEmote'
export { useSession } from './hooks/useSession'
export { useAnalytics } from './hooks/useAnalytics'

// Services
export { WebSocketService } from './services/WebSocketService'
export { RoomService } from './services/RoomService'
export { ChatService } from './services/ChatService'
export { PresenceService } from './services/PresenceService'
export { SyncService } from './services/SyncService'
export { LatencyService } from './services/LatencyService'
export { MatchmakingService } from './services/MatchmakingService'
export { TeamService } from './services/TeamService'
export { InviteService } from './services/InviteService'
export { SpectatorService } from './services/SpectatorService'
export { LeaderboardService } from './services/LeaderboardService'
export { StatsService } from './services/StatsService'
export { ReplayService } from './services/ReplayService'
export { ConnectionRecoveryService } from './services/ConnectionRecoveryService'
export { EmoteService } from './services/EmoteService'
export { SessionService } from './services/SessionService'
export { AnalyticsService } from './services/AnalyticsService'

// Middleware
export { MessageQueue } from './middleware/MessageQueue'
export { RateLimiter } from './middleware/RateLimiter'
export { MessageValidator } from './middleware/MessageValidator'

// State
export { ConnectionState, ConnectionStatus } from './state/ConnectionState'
export { RoomState } from './state/RoomState'
export { GameState, GamePhase } from './state/GameState'

// Cache
export { PlayerCache } from './cache/PlayerCache'
export { RoomCache } from './cache/RoomCache'

// Protocols
export { MessageProtocol, MessageType } from './protocols/MessageProtocol'
export type {
  Message,
  ConnectPayload,
  RoomPayload,
  PlayerPayload,
  ChatPayload,
  EmotePayload,
  ErrorPayload,
} from './protocols/MessageProtocol'

// Config
export {
  WEBSOCKET_CONFIG,
  ROOM_CONFIG,
  CHAT_CONFIG,
  SYNC_CONFIG,
  LATENCY_CONFIG,
} from './config/websocket'

// Types
export type * from './types'

// Utils - Consolidated exports from utils/index.ts
export * from './utils'

// Constants
export * from './constants'

// Errors
export * from './errors'

// Providers
export { MultiplayerProvider } from './providers/MultiplayerProvider'
