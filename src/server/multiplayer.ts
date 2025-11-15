import { Server as SocketIOServer } from 'socket.io'
import type { Server as HTTPServer } from 'http'
import type { Obstacle, Player } from '@/modules/game/domain/engine';
import { createPlayer } from '@/modules/game/domain/engine'

interface Room {
  id: string
  players: Map<string, Player>
  obstacles: Obstacle[]
  gameStarted: boolean
  gameTime: number
  difficulty: number
  maxPlayers: number
}

const rooms = new Map<string, Room>()
const playerRooms = new Map<string, string>()

export function initMultiplayerServer(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', socket => {
    console.log('Player connected:', socket.id)

    // Join or create room
    socket.on('join-room', (roomId?: string) => {
      let room: Room | undefined

      if (roomId && rooms.has(roomId)) {
        room = rooms.get(roomId)
      } else {
        // Find available room or create new one
        for (const r of Array.from(rooms.values())) {
          if (!r.gameStarted && r.players.size < r.maxPlayers) {
            room = r
            break
          }
        }

        if (!room) {
          // Create new room
          const newRoomId = `room-${Date.now()}`
          room = {
            id: newRoomId,
            players: new Map(),
            obstacles: [],
            gameStarted: false,
            gameTime: 0,
            difficulty: 1,
            maxPlayers: 4,
          }
          rooms.set(newRoomId, room)
        }
      }

      if (!room || room.players.size >= room.maxPlayers) {
        socket.emit('room-full')
        return
      }

      const colorIndex = room.players.size
      const player = createPlayer(socket.id, colorIndex)
      room.players.set(socket.id, player)
      playerRooms.set(socket.id, room.id)

      void socket.join(room.id)
      socket.emit('room-joined', {
        roomId: room.id,
        playerId: socket.id,
        player,
      })

      // Broadcast to other players in room
      socket.to(room.id).emit('player-joined', {
        playerId: socket.id,
        player,
      })

      // Send current room state to new player
      socket.emit('room-state', {
        players: Array.from(room.players.entries()).map(([id, p]) => ({ id, ...p })),
        obstacles: room.obstacles,
        gameStarted: room.gameStarted,
      })

      console.log(`Player ${socket.id} joined room ${room.id}`)
    })

    // Start game
    socket.on('start-game', () => {
      const roomId = playerRooms.get(socket.id)
      if (!roomId) {return}

      const room = rooms.get(roomId)
      if (!room || room.gameStarted) {return}

      room.gameStarted = true
      room.gameTime = 0

      io.to(roomId).emit('game-started')
      console.log(`Game started in room ${roomId}`)
    })

    // Player jump
    socket.on('player-jump', () => {
      const roomId = playerRooms.get(socket.id)
      if (!roomId) {return}

      const room = rooms.get(roomId)
      if (!room) {return}

      socket.to(roomId).emit('player-jumped', socket.id)
    })

    // Update player position
    socket.on(
      'update-position',
      (position: { y: number; velocityY: number; isGrounded: boolean }) => {
        const roomId = playerRooms.get(socket.id)
        if (!roomId) {return}

        const room = rooms.get(roomId)
        if (!room) {return}

        const player = room.players.get(socket.id)
        if (player) {
          player.y = position.y
          player.velocityY = position.velocityY
          player.isGrounded = position.isGrounded

          socket.to(roomId).emit('position-updated', {
            playerId: socket.id,
            position,
          })
        }
      }
    )

    // Update score
    socket.on('update-score', (score: number) => {
      const roomId = playerRooms.get(socket.id)
      if (!roomId) {return}

      const room = rooms.get(roomId)
      if (!room) {return}

      const player = room.players.get(socket.id)
      if (player) {
        player.score = score

        io.to(roomId).emit('score-updated', {
          playerId: socket.id,
          score,
        })
      }
    })

    // Sync obstacles (host only)
    socket.on('sync-obstacles', (obstacles: Obstacle[]) => {
      const roomId = playerRooms.get(socket.id)
      if (!roomId) {return}

      const room = rooms.get(roomId)
      if (!room) {return}

      room.obstacles = obstacles
      socket.to(roomId).emit('obstacles-synced', obstacles)
    })

    // Player died
    socket.on('player-died', () => {
      const roomId = playerRooms.get(socket.id)
      if (!roomId) {return}

      const room = rooms.get(roomId)
      if (!room) {return}

      const player = room.players.get(socket.id)
      if (player) {
        player.isAlive = false

        io.to(roomId).emit('player-died', socket.id)

        // Check if all players are dead
        const alivePlayers = Array.from(room.players.values()).filter(p => p.isAlive)
        if (alivePlayers.length === 0) {
          // Game over - find winner
          const allPlayers = Array.from(room.players.values())
          allPlayers.sort((a, b) => b.score - a.score)
          const winner = allPlayers[0]

          io.to(roomId).emit('game-over', {
            winnerId: winner.id,
            scores: allPlayers.map(p => ({
              playerId: p.id,
              score: p.score,
            })),
          })

          console.log(`Game over in room ${roomId}. Winner: ${winner.id}`)
        }
      }
    })

    // Leave room
    socket.on('leave-room', () => {
      handlePlayerLeave(socket.id)
    })

    // Disconnect
    socket.on('disconnect', () => {
      console.log('Player disconnected:', socket.id)
      handlePlayerLeave(socket.id)
    })
  })

  function handlePlayerLeave(socketId: string) {
    const roomId = playerRooms.get(socketId)
    if (!roomId) {return}

    const room = rooms.get(roomId)
    if (!room) {return}

    room.players.delete(socketId)
    playerRooms.delete(socketId)

    io.to(roomId).emit('player-left', socketId)

    // Delete room if empty
    if (room.players.size === 0) {
      rooms.delete(roomId)
      console.log(`Room ${roomId} deleted (empty)`)
    }
  }

  return io
}
