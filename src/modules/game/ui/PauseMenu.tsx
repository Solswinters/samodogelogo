import React from 'react'
import { Button } from '@/shared/components/Button'

export interface PauseMenuProps {
  onResume: () => void
  onRestart: () => void
  onMainMenu: () => void
}

/**
 * PauseMenu utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of PauseMenu.
 */
export const PauseMenu: React.FC<PauseMenuProps> = ({ onResume, onRestart, onMainMenu }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-gray-900 p-8 shadow-2xl">
        <h2 className="text-center text-3xl font-bold text-white">PAUSED</h2>

        <div className="space-y-3">
          <Button onClick={onResume} variant="primary" fullWidth>
            Resume Game
          </Button>

          <Button onClick={onRestart} variant="secondary" fullWidth>
            Restart
          </Button>

          <Button onClick={onMainMenu} variant="ghost" fullWidth>
            Main Menu
          </Button>
        </div>

        <p className="text-center text-sm text-gray-400">Press ESC to resume</p>
      </div>
    </div>
  )
}
