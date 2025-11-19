/**
 * Wallet module exports
 */

// Components
export { WalletButton } from './components/WalletButton'
export { NetworkSwitch } from './components/NetworkSwitch'
export { TokenDisplay } from './components/TokenDisplay'
export { RewardsDisplay } from './components/RewardsDisplay'
export { TransactionList } from './components/TransactionList'

// Hooks
export { useTokenBalance } from './hooks/useTokenBalance'
export { useTokenApproval } from './hooks/useTokenApproval'
export { useRewards } from './hooks/useRewards'
export { useTransactionHistory } from './hooks/useTransactionHistory'
export { useENSAddress, useENSName, useENSAvatar } from './hooks/useENS'
export { useWalletStore } from './hooks/useWalletStore'

// Services
export { contractService } from './services/ContractService'
export { ensService } from './services/ENSService'
export { RewardsService } from './services/RewardsService'

// Types
export type * from './types/blockchain'

// Utils
export * from './utils/blockchain'
export * from './utils/format'

// Stores
export { useTransactionsStore } from './stores/transactions-store'

// ABIs
export { GameTokenABI } from './abi/GameToken'
export { GameRewardsABI } from './abi/GameRewards'

// Config
export { config } from './config/web3'
