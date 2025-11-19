/**
 * Game over screen component
 */

'use client'

import { Button } from '@/shared/components/Button'
import { Stat } from '@/shared/components/Stat'

export interface GameOverScreenProps {
  score: number
  highScore: number
  level: number
  timePlayed: number
  onRestart: () => void
  onMainMenu: () => void
  isNewHighScore?: boolean
}

export function GameOverScreen({
  score,
  highScore,
  level,
  timePlayed,
  onRestart,
  onMainMenu,
  isNewHighScore = false,
}: GameOverScreenProps) {
  const minutes = Math.floor(timePlayed / 60)
  const seconds = timePlayed % 60

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur">
      <div className="w-full max-w-lg space-y-6 rounded-lg bg-gray-800 p-8 shadow-2xl">
        <div className="text-center">
          <h2 className="mb-2 text-4xl font-bold text-red-500">Game Over</h2>
          {isNewHighScore && (
            <div className="animate-pulse text-xl font-semibold text-yellow-500">
              🎉 New High Score! 🎉
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Stat label="Score" value={score.toLocaleString()} />
          <Stat label="High Score" value={highScore.toLocaleString()} />
          <Stat label="Level Reached" value={level.toString()} />
          <Stat label="Time Played" value={`${minutes}:${String(seconds).padStart(2, '0')}`} />
        </div>

        <div className="space-y-3">
          <Button onClick={onRestart} variant="default" className="w-full">
            Play Again
          </Button>
          <Button onClick={onMainMenu} variant="outline" className="w-full">
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  )
}
