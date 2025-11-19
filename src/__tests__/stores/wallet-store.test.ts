import { act } from '@testing-library/react'
import { useWalletStore } from '@/stores/wallet-store'

describe('walletStore', () => {
  beforeEach(() => {
    act(() => {
      useWalletStore.setState(
        {
          address: null,
          isConnected: false,
          chainId: null,
          balance: '0',
        },
        true
      )
    })
  })

  it('should initialize with default values', () => {
    const { address, isConnected, chainId, balance } = useWalletStore.getState()
    expect(address).toBeNull()
    expect(isConnected).toBe(false)
    expect(chainId).toBeNull()
    expect(balance).toBe('0')
  })

  it('should connect wallet', () => {
    act(() => {
      useWalletStore.getState().setAddress('0x1234567890abcdef')
      useWalletStore.getState().setIsConnected(true)
      useWalletStore.getState().setChainId(8453)
    })

    const { address, isConnected, chainId } = useWalletStore.getState()
    expect(address).toBe('0x1234567890abcdef')
    expect(isConnected).toBe(true)
    expect(chainId).toBe(8453)
  })

  it('should disconnect wallet', () => {
    act(() => {
      useWalletStore.getState().setAddress('0x1234567890abcdef')
      useWalletStore.getState().setIsConnected(true)
      useWalletStore.getState().disconnect()
    })

    const { address, isConnected, chainId } = useWalletStore.getState()
    expect(address).toBeNull()
    expect(isConnected).toBe(false)
    expect(chainId).toBeNull()
  })

  it('should update balance', () => {
    act(() => {
      useWalletStore.getState().setBalance('100.5')
    })

    expect(useWalletStore.getState().balance).toBe('100.5')
  })

  it('should switch chain', () => {
    act(() => {
      useWalletStore.getState().setChainId(1)
    })

    expect(useWalletStore.getState().chainId).toBe(1)
  })
})
