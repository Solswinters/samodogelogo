/**
 * ENS (Ethereum Name Service) resolution service
 */

import { type Address } from 'viem'
import { normalize } from 'viem/ens'
import { config } from '../config/web3'
import { getEnsAddress, getEnsName, getEnsAvatar } from '@wagmi/core'

export class ENSService {
  async resolveName(ensName: string): Promise<Address | null> {
    try {
      const normalized = normalize(ensName)
      const address = await getEnsAddress(config, { name: normalized })
      return address
    } catch (error) {
      console.error('Failed to resolve ENS name', { error, ensName })
      return null
    }
  }

  async lookupAddress(address: Address): Promise<string | null> {
    try {
      const name = await getEnsName(config, { address })
      return name
    } catch (error) {
      console.error('Failed to lookup ENS address', { error, address })
      return null
    }
  }

  async getAvatar(ensName: string): Promise<string | null> {
    try {
      const normalized = normalize(ensName)
      const avatar = await getEnsAvatar(config, { name: normalized })
      return avatar
    } catch (error) {
      console.error('Failed to get ENS avatar', { error, ensName })
      return null
    }
  }

  isENS(input: string): boolean {
    return input.endsWith('.eth')
  }
}

export const ensService = new ENSService()
