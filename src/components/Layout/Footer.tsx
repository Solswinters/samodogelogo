/**
 * Application footer component
 */

'use client'

import Link from 'next/link'

/**
 * Footer utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of Footer.
 */
export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-bold text-white">Samodoge</h3>
            <p className="text-sm text-gray-400">Play to earn crypto rewards on Base blockchain</p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Game</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/game" className="text-gray-400 hover:text-white">
                  Play Now
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-gray-400 hover:text-white">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="text-gray-400 hover:text-white">
                  Rewards
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Telegram
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-white">
                  Documentation
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Whitepaper
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Samodoge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
