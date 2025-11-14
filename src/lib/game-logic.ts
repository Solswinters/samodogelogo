export interface Player {
  id: string;
  x: number;
  y: number;
  velocityY: number;
  isJumping: boolean;
  isGrounded: boolean;
  score: number;
  isAlive: boolean;
  color: string;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameState {
  players: Map<string, Player>;
  obstacles: Obstacle[];
  gameSpeed: number;
  gameTime: number;
  difficulty: number;
  isMultiplayer: boolean;
  roomId?: string;
}

export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 400,
  PLAYER_WIDTH: 40,
  PLAYER_HEIGHT: 60,
  PLAYER_START_X: 100,
  GROUND_Y: 320,
  GRAVITY: 0.8,
  JUMP_FORCE: -15,
  INITIAL_GAME_SPEED: 5,
  MAX_GAME_SPEED: 15,
  OBSTACLE_WIDTH: 30,
  OBSTACLE_MIN_HEIGHT: 40,
  OBSTACLE_MAX_HEIGHT: 80,
  OBSTACLE_SPAWN_DISTANCE: 400,
  DIFFICULTY_INCREASE_INTERVAL: 10000, // 10 seconds
  DIFFICULTY_MULTIPLIER: 0.3,
};

export const PLAYER_COLORS = [
  "#3B82F6", // blue
  "#EF4444", // red
  "#10B981", // green
  "#F59E0B", // yellow
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#14B8A6", // teal
  "#F97316", // orange
];

export function createPlayer(id: string, colorIndex: number): Player {
  return {
    id,
    x: GAME_CONFIG.PLAYER_START_X,
    y: GAME_CONFIG.GROUND_Y,
    velocityY: 0,
    isJumping: false,
    isGrounded: true,
    score: 0,
    isAlive: true,
    color: PLAYER_COLORS[colorIndex % PLAYER_COLORS.length],
  };
}

export function createObstacle(x: number): Obstacle {
  const height = Math.random() * (GAME_CONFIG.OBSTACLE_MAX_HEIGHT - GAME_CONFIG.OBSTACLE_MIN_HEIGHT) + GAME_CONFIG.OBSTACLE_MIN_HEIGHT;
  
  return {
    id: `obstacle-${Date.now()}-${Math.random()}`,
    x,
    y: GAME_CONFIG.GROUND_Y - height,
    width: GAME_CONFIG.OBSTACLE_WIDTH,
    height,
  };
}

export function checkCollision(player: Player, obstacle: Obstacle): boolean {
  return (
    player.x < obstacle.x + obstacle.width &&
    player.x + GAME_CONFIG.PLAYER_WIDTH > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + GAME_CONFIG.PLAYER_HEIGHT > obstacle.y
  );
}

export function updatePlayerPhysics(player: Player): Player {
  if (!player.isAlive) return player;

  let newY = player.y + player.velocityY;
  let newVelocityY = player.velocityY + GAME_CONFIG.GRAVITY;
  let newIsGrounded = false;
  let newIsJumping = player.isJumping;

  // Check ground collision
  if (newY >= GAME_CONFIG.GROUND_Y) {
    newY = GAME_CONFIG.GROUND_Y;
    newVelocityY = 0;
    newIsGrounded = true;
    newIsJumping = false;
  }

  return {
    ...player,
    y: newY,
    velocityY: newVelocityY,
    isGrounded: newIsGrounded,
    isJumping: newIsJumping,
  };
}

export function jump(player: Player): Player {
  if (player.isGrounded && !player.isJumping) {
    return {
      ...player,
      velocityY: GAME_CONFIG.JUMP_FORCE,
      isJumping: true,
      isGrounded: false,
    };
  }
  return player;
}

export function calculateScore(gameTime: number, obstaclesCleared: number): number {
  // Score = time survived (in seconds) * 10 + obstacles cleared * 5
  return Math.floor(gameTime / 100) * 10 + obstaclesCleared * 5;
}

export function calculateDifficulty(gameTime: number): number {
  const intervals = Math.floor(gameTime / GAME_CONFIG.DIFFICULTY_INCREASE_INTERVAL);
  return 1 + intervals * GAME_CONFIG.DIFFICULTY_MULTIPLIER;
}

export function getGameSpeed(baseDifficulty: number, difficultyMultiplier: number): number {
  const speed = GAME_CONFIG.INITIAL_GAME_SPEED * (1 + difficultyMultiplier);
  return Math.min(speed, GAME_CONFIG.MAX_GAME_SPEED);
}

