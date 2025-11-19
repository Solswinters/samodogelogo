/**
 * Consolidated wallet state hook
 */

import { useAccount } from 'wagmi'
import { useBalance } from './useBalance'
import { useNetwork } from './useNetwork'
import { useENSName } from './useENS'

export function useWalletState() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount()
  const { balance, formatted: formattedBalance, symbol } = useBalance()
  const { chain, chainId, isSupported } = useNetwork()
  const { name: ensName } = useENSName(address)

  return {
    // Account
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    ensName,

    // Balance
    balance,
    formattedBalance,
    symbol,

    // Network
    chain,
    chainId,
    isSupported,
  }
}
