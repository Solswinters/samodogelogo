'use client'

import React, { useEffect } from 'react'
import WalletConnect from '@/modules/wallet/components/WalletConnect'
import GameEngine from '@/modules/game/components/GameEngine'
import GameOver from '@/modules/game/components/GameOver'
import { useGameContract } from '@/modules/wallet/hooks/useGameContract'
import { useGameStore } from '@/stores/game-store'
import { useIsMobile } from '@/shared/hooks'
import { useUIStore } from '@/stores/ui-store'

export default function Home() {
  const gameMode = useGameStore(state => state.mode)
  const gameState = useGameStore(state => state.state)
  const finalScore = useGameStore(state => state.finalScore)
  const isWinner = useGameStore(state => state.isWinner)
  const isMultiplayer = useGameStore(state => state.isMultiplayer)

  const setMode = useGameStore(state => state.setMode)
  const setFinalScore = useGameStore(state => state.setFinalScore)
  const resetGame = useGameStore(state => state.resetGame)
  const setMultiplayer = useGameStore(state => state.setMultiplayer)

  const setMobile = useUIStore(state => state.setMobile)
  const isMobile = useIsMobile()

  useEffect(() => {
    setMobile(isMobile)
  }, [isMobile, setMobile])

  const { address, tokenBalance, playerStats } = useGameContract()

  const handleGameOver = (score: number, winner: boolean) => {
    setFinalScore(score, winner)
  }

  const handleRestart = () => {
    resetGame()
  }

  const handleModeSelect = (mode: 'single' | 'multi') => {
    setMultiplayer(mode === 'multi')
    setMode(mode)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-xl">
              J
            </div>
            <div>
              <h1 className="text-2xl font-bold">Jump Game</h1>
              <p className="text-xs text-gray-400">Onchain Rewards on Base</p>
            </div>
          </div>
          <WalletConnect />
        </div>
      </header>

      {/* Stats Bar */}
      {address && (
        <div className="bg-gray-800/50 border-b border-gray-700">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Balance:</span>
                <span className="font-bold text-green-400">{tokenBalance} JUMP</span>
              </div>
              {playerStats && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Games Played:</span>
                    <span className="font-bold">{playerStats.gamesPlayed}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Highest Score:</span>
                    <span className="font-bold text-yellow-400">{playerStats.highestScore}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Total Claimed:</span>
                    <span className="font-bold text-purple-400">
                      {playerStats.totalClaimed} JUMP
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {gameMode === 'menu' ? (
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Jump. Survive. Earn.
              </h2>
              <p className="text-xl text-gray-300 mb-2">
                Play the obstacle jumping game and earn JUMP tokens on Base
              </p>
              <p className="text-gray-400">
                Compete in multiplayer, beat your high score, and claim onchain rewards
              </p>
            </div>

            {/* Game Mode Selection */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <button
                onClick={() => handleModeSelect('single')}
                className="bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 p-8 rounded-xl border-2 border-blue-500 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-2xl font-bold mb-2">Single Player</h3>
                <p className="text-gray-300">
                  Play solo and test your skills. Earn rewards based on your score.
                </p>
              </button>

              <button
                onClick={() => handleModeSelect('multi')}
                className="bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 p-8 rounded-xl border-2 border-purple-500 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-2xl font-bold mb-2">Multiplayer</h3>
                <p className="text-gray-300">
                  Compete with others in real-time. Winner gets 1.5x reward multiplier!
                </p>
              </button>
            </div>

            {/* How to Play */}
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-center">How to Play</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">⌨️</div>
                  <h4 className="font-bold mb-2">Jump</h4>
                  <p className="text-sm text-gray-400">
                    Press SPACE or click to make your character jump over obstacles
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🏃</div>
                  <h4 className="font-bold mb-2">Survive</h4>
                  <p className="text-sm text-gray-400">
                    Avoid obstacles and survive as long as possible. Difficulty increases over time!
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">💎</div>
                  <h4 className="font-bold mb-2">Earn Rewards</h4>
                  <p className="text-sm text-gray-400">
                    Claim JUMP tokens based on your score. Connect wallet to claim rewards!
                  </p>
                </div>
              </div>
            </div>

            {/* Reward Info */}
            <div className="mt-8 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-6 border border-green-700/50">
              <h3 className="text-xl font-bold mb-3 text-green-400">💰 Reward System</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Base reward: 10 JUMP tokens per game</li>
                <li>✓ Score bonus: +1 token per 100 points</li>
                <li>✓ Multiplayer winner: 1.5x multiplier</li>
                <li>✓ Cooldown: 1 hour between claims</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <GameEngine
              isMultiplayer={isMultiplayer}
              onGameOver={handleGameOver}
              playerId={address}
            />

            <button
              onClick={() => setMode('menu')}
              className="mt-6 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              ← Back to Menu
            </button>
          </div>
        )}
      </div>

      {/* Game Over Modal */}
      {gameState === 'ended' && (
        <GameOver score={finalScore} isWinner={isWinner} onRestart={handleRestart} />
      )}

      {/* Footer */}
      <footer className="border-t border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>Built on Base • Powered by Reown • Made with ❤️</p>
        </div>
      </footer>
    </main>
  )
}
