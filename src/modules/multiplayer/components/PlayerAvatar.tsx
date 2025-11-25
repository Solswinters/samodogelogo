/**
 * Player avatar component
 */

'use client'

interface PlayerAvatarProps {
  name: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
  online?: boolean
}

/**
 * PlayerAvatar utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of PlayerAvatar.
 */
export function PlayerAvatar({ name, color, size = 'md', online = false }: PlayerAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const bgColor = color || `hsl(${name.charCodeAt(0) * 10}, 70%, 50%)`

  return (
    <div className="relative">
      <div
        className={`flex items-center justify-center rounded-full font-semibold text-white ${sizeClasses[size]}`}
        style={{ backgroundColor: bgColor }}
      >
        {initials}
      </div>
      {online && (
        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-gray-800 bg-green-500"></div>
      )}
    </div>
  )
}
