/**
 * Achievement UI - Display achievement notifications
 */

import React, { useState, useEffect } from 'react'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface AchievementUIProps {
  achievement: Achievement | null
  onClose: () => void
}

const rarityColors = {
  common: 'from-gray-500 to-gray-600',
  rare: 'from-blue-500 to-blue-600',
  epic: 'from-purple-500 to-purple-600',
  legendary: 'from-yellow-500 to-yellow-600',
}

/**
 * AchievementUI utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of AchievementUI.
 */
export const AchievementUI: React.FC<AchievementUIProps> = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)

      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  if (!achievement) return null

  return (
    <div
      className={`
        fixed top-4 right-4 z-50
        transform transition-all duration-300
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div
        className={`
          rounded-lg p-4 shadow-2xl
          bg-gradient-to-r ${rarityColors[achievement.rarity]}
          text-white min-w-[300px]
        `}
      >
        <div className="flex items-start gap-3">
          <div className="text-4xl">{achievement.icon}</div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase opacity-75">Achievement Unlocked!</p>
            <h3 className="text-lg font-bold mt-1">{achievement.title}</h3>
            <p className="text-sm opacity-90 mt-1">{achievement.description}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="text-white opacity-75 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

export default AchievementUI
