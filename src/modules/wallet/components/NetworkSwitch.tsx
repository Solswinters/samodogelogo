/**
 * Network switching component
 */

'use client'

import { useAccount, useSwitchChain } from 'wagmi'

/**
 * NetworkSwitch utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of NetworkSwitch.
 */
export function NetworkSwitch() {
  const { chain } = useAccount()
  const { chains, switchChain, isPending } = useSwitchChain()

  if (!chain) {
    return null
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-300">Network</h3>

      <div className="flex flex-col gap-2">
        {chains.map((c) => (
          <button
            key={c.id}
            onClick={() => switchChain({ chainId: c.id })}
            disabled={isPending || chain.id === c.id}
            className={`rounded-md px-4 py-2 text-left transition-colors ${
              chain.id === c.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {c.name}
            {chain.id === c.id && <span className="ml-2 text-xs">(Current)</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
