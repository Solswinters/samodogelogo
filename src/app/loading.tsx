/**
 * Global loading state
 */

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-4 inline-block h-16 w-16 animate-spin rounded-full border-4 border-gray-700 border-t-purple-500" />
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  )
}
