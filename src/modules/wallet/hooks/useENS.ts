/**
 * Hook for ENS resolution
 */

import { useEnsAddress, useEnsName, useEnsAvatar } from 'wagmi'
import { normalize } from 'viem/ens'
import { type Address } from 'viem'

export function useENSAddress(name: string | undefined) {
  const normalized = name ? normalize(name) : undefined

  const {
    data: address,
    isLoading,
    error,
  } = useEnsAddress({
    name: normalized,
    query: {
      enabled: !!normalized,
    },
  })

  return {
    address,
    isLoading,
    error,
  }
}

export function useENSName(address: Address | undefined) {
  const {
    data: name,
    isLoading,
    error,
  } = useEnsName({
    address,
    query: {
      enabled: !!address,
    },
  })

  return {
    name,
    isLoading,
    error,
  }
}

export function useENSAvatar(name: string | undefined) {
  const normalized = name ? normalize(name) : undefined

  const {
    data: avatar,
    isLoading,
    error,
  } = useEnsAvatar({
    name: normalized,
    query: {
      enabled: !!normalized,
    },
  })

  return {
    avatar,
    isLoading,
    error,
  }
}
