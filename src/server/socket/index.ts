// Socket.io server exports
export * from './types'
export * from './roomManager'
export * from './handlers'

import { Server as SocketIOServer } from 'socket.io'
import type { Server as HTTPServer } from 'http'
import type { GameServer } from './handlers';
import { handleConnection } from './handlers'
import type { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from './types'
import { multiplayerLogger as logger } from '@/middleware/logging'

// Initialize Socket.io server
export function initializeSocketServer(httpServer: HTTPServer): GameServer {
  const io: GameServer = new SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL ?? '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  })

  // Authentication middleware
  io.use((socket, next) => {
    // Set player ID from auth or generate
    const playerId = (socket.handshake.auth.playerId as string | undefined) ?? crypto.randomUUID()
    const playerName =
      (socket.handshake.auth.playerName as string | undefined) ?? `Player-${playerId.slice(0, 8)}`
    const address = socket.handshake.auth.address as string | undefined

    socket.data = {
      playerId,
      playerName,
      address,
    }

    logger.info('Socket authenticated', { playerId, playerName })
    next()
  })

  // Handle connections
  io.on('connection', socket => {
    handleConnection(io, socket)
  })

  logger.info('Socket.io server initialized')

  return io
}
