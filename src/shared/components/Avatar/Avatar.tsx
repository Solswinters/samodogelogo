/**
 * Avatar component
 */

'use client'

export interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'away' | 'busy'
  shape?: 'circle' | 'square'
}

/**
 * Avatar utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of Avatar.
 */
export function Avatar({
  src,
  alt = '',
  fallback,
  size = 'md',
  status,
  shape = 'circle',
}: AvatarProps) {
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  }

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  }

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-lg'

  return (
    <div className="relative inline-block">
      <div
        className={`flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 font-semibold text-white ${sizeClasses[size]} ${shapeClass}`}
      >
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <span>{fallback || alt.substring(0, 2).toUpperCase()}</span>
        )}
      </div>
      {status && (
        <span
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-gray-800 ${statusColors[status]}`}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  )
}
