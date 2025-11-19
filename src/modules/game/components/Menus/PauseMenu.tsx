/**
 * Pause menu component
 */

'use client'

import { Button } from '@/shared/components/Button'

export interface PauseMenuProps {
  onResume: () => void
  onRestart: () => void
  onSettings: () => void
  onQuit: () => void
}

export function PauseMenu({ onResume, onRestart, onSettings, onQuit }: PauseMenuProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-gray-800 p-8 shadow-2xl">
        <h2 className="text-center text-3xl font-bold text-white">Paused</h2>

        <div className="space-y-3">
          <Button onClick={onResume} variant="default" className="w-full">
            Resume Game
          </Button>
          <Button onClick={onRestart} variant="outline" className="w-full">
            Restart Level
          </Button>
          <Button onClick={onSettings} variant="outline" className="w-full">
            Settings
          </Button>
          <Button onClick={onQuit} variant="outline" className="w-full text-red-400">
            Quit to Menu
          </Button>
        </div>

        <div className="pt-4 text-center text-sm text-gray-400">Press ESC to resume</div>
      </div>
    </div>
  )
}
