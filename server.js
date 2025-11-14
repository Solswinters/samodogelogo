const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || `http://${hostname}:${port}`,
      methods: ["GET", "POST"],
    },
  });

  // Multiplayer room management
  const rooms = new Map();
  const playerRooms = new Map();

  io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);

    socket.on("join-room", (roomId) => {
      let room;

      if (roomId && rooms.has(roomId)) {
        room = rooms.get(roomId);
      } else {
        // Find available room or create new one
        for (const [id, r] of rooms.entries()) {
          if (!r.gameStarted && r.players.size < r.maxPlayers) {
            room = r;
            break;
          }
        }

        if (!room) {
          const newRoomId = `room-${Date.now()}`;
          room = {
            id: newRoomId,
            players: new Map(),
            obstacles: [],
            gameStarted: false,
            gameTime: 0,
            difficulty: 1,
            maxPlayers: 4,
          };
          rooms.set(newRoomId, room);
        }
      }

      if (room.players.size >= room.maxPlayers) {
        socket.emit("room-full");
        return;
      }

      const colorIndex = room.players.size;
      const player = {
        id: socket.id,
        x: 100,
        y: 320,
        velocityY: 0,
        isJumping: false,
        isGrounded: true,
        score: 0,
        isAlive: true,
        color: ["#3B82F6", "#EF4444", "#10B981", "#F59E0B"][colorIndex % 4],
      };

      room.players.set(socket.id, player);
      playerRooms.set(socket.id, room.id);

      socket.join(room.id);
      socket.emit("room-joined", {
        roomId: room.id,
        playerId: socket.id,
        player,
      });

      socket.to(room.id).emit("player-joined", {
        playerId: socket.id,
        player,
      });

      socket.emit("room-state", {
        players: Array.from(room.players.entries()).map(([id, p]) => ({ id, ...p })),
        obstacles: room.obstacles,
        gameStarted: room.gameStarted,
      });

      console.log(`Player ${socket.id} joined room ${room.id}`);
    });

    socket.on("start-game", () => {
      const roomId = playerRooms.get(socket.id);
      if (!roomId) return;

      const room = rooms.get(roomId);
      if (!room || room.gameStarted) return;

      room.gameStarted = true;
      room.gameTime = 0;

      io.to(roomId).emit("game-started");
      console.log(`Game started in room ${roomId}`);
    });

    socket.on("player-jump", () => {
      const roomId = playerRooms.get(socket.id);
      if (!roomId) return;
      socket.to(roomId).emit("player-jumped", socket.id);
    });

    socket.on("update-position", (position) => {
      const roomId = playerRooms.get(socket.id);
      if (!roomId) return;

      const room = rooms.get(roomId);
      if (!room) return;

      const player = room.players.get(socket.id);
      if (player) {
        player.y = position.y;
        player.velocityY = position.velocityY;
        player.isGrounded = position.isGrounded;

        socket.to(roomId).emit("position-updated", {
          playerId: socket.id,
          position,
        });
      }
    });

    socket.on("update-score", (score) => {
      const roomId = playerRooms.get(socket.id);
      if (!roomId) return;

      const room = rooms.get(roomId);
      if (!room) return;

      const player = room.players.get(socket.id);
      if (player) {
        player.score = score;
        io.to(roomId).emit("score-updated", {
          playerId: socket.id,
          score,
        });
      }
    });

    socket.on("sync-obstacles", (obstacles) => {
      const roomId = playerRooms.get(socket.id);
      if (!roomId) return;

      const room = rooms.get(roomId);
      if (!room) return;

      room.obstacles = obstacles;
      socket.to(roomId).emit("obstacles-synced", obstacles);
    });

    socket.on("player-died", () => {
      const roomId = playerRooms.get(socket.id);
      if (!roomId) return;

      const room = rooms.get(roomId);
      if (!room) return;

      const player = room.players.get(socket.id);
      if (player) {
        player.isAlive = false;
        io.to(roomId).emit("player-died", socket.id);

        const alivePlayers = Array.from(room.players.values()).filter((p) => p.isAlive);
        if (alivePlayers.length === 0) {
          const allPlayers = Array.from(room.players.values());
          allPlayers.sort((a, b) => b.score - a.score);
          const winner = allPlayers[0];

          io.to(roomId).emit("game-over", {
            winnerId: winner.id,
            scores: allPlayers.map((p) => ({
              playerId: p.id,
              score: p.score,
            })),
          });

          console.log(`Game over in room ${roomId}. Winner: ${winner.id}`);
        }
      }
    });

    socket.on("leave-room", () => {
      handlePlayerLeave(socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Player disconnected:", socket.id);
      handlePlayerLeave(socket.id);
    });

    function handlePlayerLeave(socketId) {
      const roomId = playerRooms.get(socketId);
      if (!roomId) return;

      const room = rooms.get(roomId);
      if (!room) return;

      room.players.delete(socketId);
      playerRooms.delete(socketId);

      io.to(roomId).emit("player-left", socketId);

      if (room.players.size === 0) {
        rooms.delete(roomId);
        console.log(`Room ${roomId} deleted (empty)`);
      }
    }
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.io server running`);
    });
});

