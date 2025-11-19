/**
 * Main menu component
 */

'use client'

import { Button } from '@/shared/components/Button'

export interface MainMenuProps {
  onPlay: () => void
  onMultiplayer: () => void
  onLeaderboard: () => void
  onSettings: () => void
  onConnect: () => void
  isWalletConnected: boolean
}

export function MainMenu({
  onPlay,
  onMultiplayer,
  onLeaderboard,
  onSettings,
  onConnect,
  isWalletConnected,
}: MainMenuProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="mb-2 text-6xl font-bold text-white">JUMP</h1>
          <p className="text-xl text-purple-400">Master the obstacles, earn rewards</p>
        </div>

        <div className="space-y-3">
          <Button onClick={onPlay} variant="default" className="w-full text-lg">
            Play Solo
          </Button>
          <Button onClick={onMultiplayer} variant="outline" className="w-full">
            Multiplayer
          </Button>
          <Button onClick={onLeaderboard} variant="outline" className="w-full">
            Leaderboard
          </Button>
          <Button onClick={onSettings} variant="outline" className="w-full">
            Settings
          </Button>
        </div>

        <div className="border-t border-gray-700 pt-6">
          {isWalletConnected ? (
            <div className="text-center text-sm text-green-400">✓ Wallet Connected</div>
          ) : (
            <Button onClick={onConnect} variant="default" className="w-full">
              Connect Wallet for Rewards
            </Button>
          )}
        </div>

        <div className="text-center text-xs text-gray-500">v1.0.0 | Built on Base</div>
      </div>
    </div>
  )
}
