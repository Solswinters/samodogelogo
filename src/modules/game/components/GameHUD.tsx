"use client";

import React from "react";

interface GameHUDProps {
  score: number;
  gameTime: number;
  obstaclesCleared: number;
  isMultiplayer?: boolean;
  roomId?: string | null;
}

export default function GameHUD({
  score,
  gameTime,
  obstaclesCleared,
  isMultiplayer = false,
  roomId,
}: GameHUDProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="fixed top-20 left-4 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 w-64 shadow-xl">
      <div className="space-y-3">
        {/* Score */}
        <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-700/50 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Score</div>
          <div className="text-3xl font-bold text-yellow-400">{score}</div>
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">⏱️ Time</span>
            <span className="font-bold text-white">{formatTime(gameTime)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">🚧 Cleared</span>
            <span className="font-bold text-white">{obstaclesCleared}</span>
          </div>

          {isMultiplayer && roomId && (
            <div className="pt-2 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Room:</span>
                <span className="text-xs font-mono text-blue-400 truncate">
                  {roomId.slice(-8)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Difficulty Indicator */}
        <div className="pt-2 border-t border-gray-700">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">Difficulty</span>
            <span className="text-xs font-bold text-red-400">
              {Math.floor(gameTime / 10000) + 1}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(((gameTime % 10000) / 10000) * 100, 100)}%`,
              }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1 text-center">
            Next level in {Math.max(0, 10 - Math.floor((gameTime % 10000) / 1000))}s
          </div>
        </div>
      </div>
    </div>
  );
}

