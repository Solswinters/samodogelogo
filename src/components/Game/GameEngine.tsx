"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  GAME_CONFIG,
  Player,
  Obstacle,
  createPlayer,
  createObstacle,
  checkCollision,
  updatePlayerPhysics,
  jump,
  calculateScore,
  calculateDifficulty,
  getGameSpeed,
} from "@/lib/game-logic";
import { useMultiplayer } from "@/hooks/useMultiplayer";
import GameHUD from "./GameHUD";
import Leaderboard from "../Leaderboard";

interface GameEngineProps {
  isMultiplayer: boolean;
  onGameOver: (score: number, isWinner: boolean) => void;
  playerId?: string;
}

export default function GameEngine({ isMultiplayer, onGameOver, playerId }: GameEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"waiting" | "playing" | "ended">("waiting");
  const [localPlayer, setLocalPlayer] = useState<Player>(createPlayer("local", 0));
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameTime, setGameTime] = useState(0);
  const [obstaclesCleared, setObstaclesCleared] = useState(0);
  const [remotePlayers, setRemotePlayers] = useState<Map<string, Player>>(new Map());
  const [winnerId, setWinnerId] = useState<string | null>(null);

  const gameLoopRef = useRef<number>();
  const lastObstacleX = useRef(GAME_CONFIG.CANVAS_WIDTH);
  const lastUpdateTime = useRef(Date.now());

  const multiplayer = useMultiplayer({
    onPlayerJoined: (id, player) => {
      setRemotePlayers(prev => new Map(prev).set(id, player));
    },
    onPlayerLeft: (id) => {
      setRemotePlayers(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
    },
    onPlayerJumped: (id) => {
      setRemotePlayers(prev => {
        const newMap = new Map(prev);
        const player = newMap.get(id);
        if (player) {
          newMap.set(id, jump(player));
        }
        return newMap;
      });
    },
    onPositionUpdated: (id, position) => {
      setRemotePlayers(prev => {
        const newMap = new Map(prev);
        const player = newMap.get(id);
        if (player) {
          player.y = position.y;
          player.velocityY = position.velocityY;
          player.isGrounded = position.isGrounded;
        }
        return newMap;
      });
    },
    onObstaclesSynced: (syncedObstacles) => {
      if (!multiplayer.isHost) {
        setObstacles(syncedObstacles);
      }
    },
    onGameStarted: () => {
      startGame();
    },
    onGameOver: (data) => {
      setWinnerId(data.winnerId);
      endGame(data.winnerId === multiplayer.playerId);
    },
  });

  const startGame = useCallback(() => {
    setGameState("playing");
    setLocalPlayer(createPlayer(multiplayer.playerId || "local", 0));
    setObstacles([]);
    setGameTime(0);
    setObstaclesCleared(0);
    lastObstacleX.current = GAME_CONFIG.CANVAS_WIDTH;
    lastUpdateTime.current = Date.now();
  }, [multiplayer.playerId]);

  const endGame = useCallback((isWinner: boolean) => {
    setGameState("ended");
    const finalScore = calculateScore(gameTime, obstaclesCleared);
    onGameOver(finalScore, isWinner);
  }, [gameTime, obstaclesCleared, onGameOver]);

  const handleJump = useCallback(() => {
    if (gameState !== "playing" || !localPlayer.isAlive) return;

    setLocalPlayer(prev => {
      const jumped = jump(prev);
      if (jumped !== prev && isMultiplayer) {
        multiplayer.sendJump();
      }
      return jumped;
    });
  }, [gameState, localPlayer.isAlive, isMultiplayer, multiplayer]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        handleJump();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleJump]);

  useEffect(() => {
    if (!isMultiplayer || !multiplayer.isConnected) return;
    
    if (gameState === "waiting") {
      multiplayer.joinRoom();
    }

    return () => {
      if (gameState === "ended") {
        multiplayer.leaveRoom();
      }
    };
  }, [isMultiplayer]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdateTime.current;
      lastUpdateTime.current = now;

      setGameTime(prev => prev + deltaTime);

      // Update player physics
      setLocalPlayer(prev => {
        const updated = updatePlayerPhysics(prev);
        
        if (isMultiplayer) {
          multiplayer.updatePosition({
            y: updated.y,
            velocityY: updated.velocityY,
            isGrounded: updated.isGrounded,
          });
        }
        
        return updated;
      });

      // Update remote players
      if (isMultiplayer) {
        setRemotePlayers(prev => {
          const newMap = new Map<string, Player>();
          prev.forEach((player, id) => {
            newMap.set(id, updatePlayerPhysics(player));
          });
          return newMap;
        });
      }

      // Update obstacles (host only in multiplayer, or single player)
      if (!isMultiplayer || multiplayer.isHost) {
        setObstacles(prev => {
          const difficulty = calculateDifficulty(gameTime);
          const speed = getGameSpeed(GAME_CONFIG.INITIAL_GAME_SPEED, difficulty - 1);

          // Move obstacles
          let newObstacles = prev
            .map(obs => ({ ...obs, x: obs.x - speed }))
            .filter(obs => obs.x + obs.width > 0);

          // Spawn new obstacles
          const lastObstacle = newObstacles[newObstacles.length - 1];
          const shouldSpawn = !lastObstacle || 
            (GAME_CONFIG.CANVAS_WIDTH - lastObstacle.x) > GAME_CONFIG.OBSTACLE_SPAWN_DISTANCE / difficulty;

          if (shouldSpawn) {
            newObstacles.push(createObstacle(GAME_CONFIG.CANVAS_WIDTH));
          }

          // Sync obstacles in multiplayer
          if (isMultiplayer && newObstacles !== prev) {
            multiplayer.syncObstacles(newObstacles);
          }

          return newObstacles;
        });
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameTime, isMultiplayer, multiplayer]);

  // Collision detection
  useEffect(() => {
    if (gameState !== "playing" || !localPlayer.isAlive) return;

    for (const obstacle of obstacles) {
      if (checkCollision(localPlayer, obstacle)) {
        setLocalPlayer(prev => ({ ...prev, isAlive: false }));
        
        if (isMultiplayer) {
          multiplayer.notifyDeath();
        } else {
          endGame(false);
        }
        
        break;
      }
    }

    // Check if obstacles passed
    obstacles.forEach(obs => {
      if (obs.x + obs.width < localPlayer.x && obs.x + obs.width > localPlayer.x - 10) {
        setObstaclesCleared(prev => prev + 1);
      }
    });
  }, [obstacles, localPlayer, gameState, isMultiplayer, multiplayer, endGame]);

  // Update score
  useEffect(() => {
    if (gameState === "playing" && localPlayer.isAlive) {
      const score = calculateScore(gameTime, obstaclesCleared);
      setLocalPlayer(prev => ({ ...prev, score }));
      
      if (isMultiplayer) {
        multiplayer.updateScore(score);
      }
    }
  }, [gameTime, obstaclesCleared, gameState, localPlayer.isAlive, isMultiplayer, multiplayer]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

      // Draw ground
      ctx.fillStyle = "#333";
      ctx.fillRect(0, GAME_CONFIG.GROUND_Y + GAME_CONFIG.PLAYER_HEIGHT, GAME_CONFIG.CANVAS_WIDTH, 10);

      // Draw obstacles
      ctx.fillStyle = "#ff4444";
      obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      });

      // Draw local player
      if (localPlayer.isAlive) {
        ctx.fillStyle = localPlayer.color;
        ctx.fillRect(localPlayer.x, localPlayer.y, GAME_CONFIG.PLAYER_WIDTH, GAME_CONFIG.PLAYER_HEIGHT);
      }

      // Draw remote players
      if (isMultiplayer) {
        remotePlayers.forEach(player => {
          if (player.isAlive) {
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, GAME_CONFIG.PLAYER_WIDTH, GAME_CONFIG.PLAYER_HEIGHT);
          }
        });
      }

      // Draw score
      ctx.fillStyle = "#fff";
      ctx.font = "20px Arial";
      ctx.fillText(`Score: ${localPlayer.score}`, 20, 30);
      ctx.fillText(`Time: ${Math.floor(gameTime / 1000)}s`, 20, 60);

      requestAnimationFrame(render);
    };

    render();
  }, [localPlayer, obstacles, remotePlayers, gameTime, isMultiplayer]);

  return (
    <>
      {gameState === "playing" && (
        <>
          <GameHUD
            score={localPlayer.score}
            gameTime={gameTime}
            obstaclesCleared={obstaclesCleared}
            isMultiplayer={isMultiplayer}
            roomId={multiplayer.roomId}
          />
          {isMultiplayer && (
            <Leaderboard
              players={new Map([[multiplayer.playerId || "local", localPlayer], ...remotePlayers])}
              currentPlayerId={multiplayer.playerId}
            />
          )}
        </>
      )}

      <div className="flex flex-col items-center gap-4">
        <canvas
          ref={canvasRef}
          width={GAME_CONFIG.CANVAS_WIDTH}
          height={GAME_CONFIG.CANVAS_HEIGHT}
          className="border-2 border-gray-700 rounded-lg cursor-pointer"
          onClick={handleJump}
        />
        
        {gameState === "waiting" && (
          <div className="text-center">
            {isMultiplayer ? (
              multiplayer.isConnected ? (
                multiplayer.isHost ? (
                  <button
                    onClick={() => multiplayer.startGame()}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
                  >
                    Start Game (Host)
                  </button>
                ) : (
                  <p className="text-gray-400">Waiting for host to start...</p>
                )
              ) : (
                <p className="text-gray-400">Connecting to multiplayer...</p>
              )
            ) : (
              <button
                onClick={startGame}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
              >
                Start Game
              </button>
            )}
          </div>
        )}

        <p className="text-gray-400 text-sm">
          Press SPACE or click to jump
        </p>
      </div>
    </>
  );
}

