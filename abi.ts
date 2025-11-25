/**
 * GaslessAchievements Smart Contract
 *
 * Network: Base (Chain ID: 8453)
 * Contract Address: 0x2c366F0a2c9CB85ef7e1f6Af7b264640840faA89
 *
 * This contract manages gasless achievement NFTs for the Jump Game.
 * Players can claim achievements without paying gas fees using EIP-2771 meta-transactions.
 */

/**
 * GASLESS_ACHIEVEMENTS_ADDRESS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of GASLESS_ACHIEVEMENTS_ADDRESS.
 */
export const GASLESS_ACHIEVEMENTS_ADDRESS = '0x2c366F0a2c9CB85ef7e1f6Af7b264640840faA89' as const

/**
 * GASLESS_ACHIEVEMENTS_ABI utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of GASLESS_ACHIEVEMENTS_ABI.
 */
export const GASLESS_ACHIEVEMENTS_ABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'initialOwner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'trustedForwarder',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    name: 'ERC721EnumerableForbiddenBatchMint',
    type: 'error',
    inputs: [],
  },
  {
    name: 'ERC721IncorrectOwner',
    type: 'error',
    inputs: [
      {
        name: 'sender',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    name: 'ERC721InsufficientApproval',
    type: 'error',
    inputs: [
      {
        name: 'operator',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    name: 'ERC721InvalidApprover',
    type: 'error',
    inputs: [
      {
        name: 'approver',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    name: 'ERC721InvalidOperator',
    type: 'error',
    inputs: [
      {
        name: 'operator',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    name: 'ERC721InvalidOwner',
    type: 'error',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    name: 'ERC721InvalidReceiver',
    type: 'error',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    name: 'ERC721InvalidSender',
    type: 'error',
    inputs: [
      {
        name: 'sender',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    name: 'ERC721NonexistentToken',
    type: 'error',
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    name: 'ERC721OutOfBoundsIndex',
    type: 'error',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'index',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    name: 'OwnableInvalidOwner',
    type: 'error',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    name: 'AchievementConfigured',
    type: 'event',
    inputs: [
      {
        name: 'achievementType',
        type: 'uint8',
        indexed: true,
        internalType: 'enum GaslessAchievements.AchievementType',
      },
      {
        name: 'name',
        type: 'string',
        indexed: false,
        internalType: 'string',
      },
      {
        name: 'rarity',
        type: 'uint8',
        indexed: false,
        internalType: 'enum GaslessAchievements.Rarity',
      },
      {
        name: 'scoreRequired',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    name: 'AchievementUnlocked',
    type: 'event',
    inputs: [
      {
        name: 'player',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'achievementType',
        type: 'uint8',
        indexed: false,
        internalType: 'enum GaslessAchievements.AchievementType',
      },
      {
        name: 'score',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'rarity',
        type: 'uint8',
        indexed: false,
        internalType: 'enum GaslessAchievements.Rarity',
      },
      {
        name: 'timestamp',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    name: 'Approval',
    type: 'event',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'approved',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    name: 'ApprovalForAll',
    type: 'event',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'operator',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'approved',
        type: 'bool',
        indexed: false,
        internalType: 'bool',
      },
    ],
    anonymous: false,
  },
  {
    name: 'AuthorizedUpdaterChanged',
    type: 'event',
    inputs: [
      {
        name: 'updater',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'authorized',
        type: 'bool',
        indexed: false,
        internalType: 'bool',
      },
    ],
    anonymous: false,
  },
  {
    name: 'BatchMetadataUpdate',
    type: 'event',
    inputs: [
      {
        name: '_fromTokenId',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: '_toTokenId',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    name: 'MetadataUpdate',
    type: 'event',
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    name: 'OwnershipTransferred',
    type: 'event',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    name: 'ScoreUpdated',
    type: 'event',
    inputs: [
      {
        name: 'player',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'oldScore',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'newScore',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'timestamp',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    name: 'StatsUpdated',
    type: 'event',
    inputs: [
      {
        name: 'player',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'timestamp',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    name: 'Transfer',
    type: 'event',
    inputs: [
      {
        name: 'from',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'to',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    name: 'achievementConfigs',
    type: 'function',
    inputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'enum GaslessAchievements.AchievementType',
      },
    ],
    outputs: [
      {
        name: 'name',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'description',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'rarity',
        type: 'uint8',
        internalType: 'enum GaslessAchievements.Rarity',
      },
      {
        name: 'scoreRequired',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'isActive',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'metadataURI',
        type: 'string',
        internalType: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'achievements',
    type: 'function',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'achievementType',
        type: 'uint8',
        internalType: 'enum GaslessAchievements.AchievementType',
      },
      {
        name: 'scoreAtUnlock',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'timestamp',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'player',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'rarity',
        type: 'uint8',
        internalType: 'enum GaslessAchievements.Rarity',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'approve',
    type: 'function',
    inputs: [
      {
        name: 'to',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'authorizedUpdaters',
    type: 'function',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'batchClaimAchievements',
    type: 'function',
    inputs: [
      {
        name: 'achievementTypes',
        type: 'uint8[]',
        internalType: 'enum GaslessAchievements.AchievementType[]',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    name: 'claimAchievement',
    type: 'function',
    inputs: [
      {
        name: 'achievementType',
        type: 'uint8',
        internalType: 'enum GaslessAchievements.AchievementType',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    name: 'gameRewardsContract',
    type: 'function',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'getAchievementDetails',
    type: 'function',
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          {
            name: 'achievementType',
            type: 'uint8',
            internalType: 'enum GaslessAchievements.AchievementType',
          },
          {
            name: 'scoreAtUnlock',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'timestamp',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'player',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'rarity',
            type: 'uint8',
            internalType: 'enum GaslessAchievements.Rarity',
          },
        ],
        internalType: 'struct GaslessAchievements.Achievement',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'getApproved',
    type: 'function',
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'getEligibleAchievements',
    type: 'function',
    inputs: [
      {
        name: 'player',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint8[]',
        internalType: 'enum GaslessAchievements.AchievementType[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'getPlayerAchievements',
    type: 'function',
    inputs: [
      {
        name: 'player',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'hasAchievement',
    type: 'function',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '',
        type: 'uint8',
        internalType: 'enum GaslessAchievements.AchievementType',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'isApprovedForAll',
    type: 'function',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'operator',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'isEligible',
    type: 'function',
    inputs: [
      {
        name: 'player',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'achievementType',
        type: 'uint8',
        internalType: 'enum GaslessAchievements.AchievementType',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'isTrustedForwarder',
    type: 'function',
    inputs: [
      {
        name: 'forwarder',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'name',
    type: 'function',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'owner',
    type: 'function',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'ownerOf',
    type: 'function',
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'playerScores',
    type: 'function',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'playerStats',
    type: 'function',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'consecutiveJumps',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'powerUpsCollected',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'obstaclesDodged',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'multiplayerWins',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'tokensEarned',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'daysPlayed',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'lastPlayedDay',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'renounceOwnership',
    type: 'function',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'safeTransferFrom',
    type: 'function',
    inputs: [
      {
        name: 'from',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'to',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'safeTransferFrom',
    type: 'function',
    inputs: [
      {
        name: 'from',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'to',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'data',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'setApprovalForAll',
    type: 'function',
    inputs: [
      {
        name: 'operator',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'approved',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'setAuthorizedUpdater',
    type: 'function',
    inputs: [
      {
        name: 'updater',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'authorized',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'setBaseURI',
    type: 'function',
    inputs: [
      {
        name: 'baseURI',
        type: 'string',
        internalType: 'string',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'setGameRewardsContract',
    type: 'function',
    inputs: [
      {
        name: '_gameRewardsContract',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'supportsInterface',
    type: 'function',
    inputs: [
      {
        name: 'interfaceId',
        type: 'bytes4',
        internalType: 'bytes4',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'symbol',
    type: 'function',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'tokenByIndex',
    type: 'function',
    inputs: [
      {
        name: 'index',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'tokenOfOwnerByIndex',
    type: 'function',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'index',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'tokenURI',
    type: 'function',
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'totalSupply',
    type: 'function',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'transferFrom',
    type: 'function',
    inputs: [
      {
        name: 'from',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'to',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'transferOwnership',
    type: 'function',
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'trustedForwarder',
    type: 'function',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'updateAchievementConfig',
    type: 'function',
    inputs: [
      {
        name: 'achievementType',
        type: 'uint8',
        internalType: 'enum GaslessAchievements.AchievementType',
      },
      {
        name: 'name',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'description',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'rarity',
        type: 'uint8',
        internalType: 'enum GaslessAchievements.Rarity',
      },
      {
        name: 'scoreRequired',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'isActive',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'metadataURI',
        type: 'string',
        internalType: 'string',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'updatePlayerScore',
    type: 'function',
    inputs: [
      {
        name: 'player',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'newScore',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'updatePlayerStats',
    type: 'function',
    inputs: [
      {
        name: 'player',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'consecutiveJumps',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'powerUpsCollected',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'obstaclesDodged',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'multiplayerWins',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'tokensEarned',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'daysPlayed',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 * Achievement Types Enum
 * Matches the solidity enum GaslessAchievements.AchievementType
 */
export enum AchievementType {
  FIRST_JUMP = 0,
  SCORE_100 = 1,
  SCORE_500 = 2,
  SCORE_1000 = 3,
  SCORE_5000 = 4,
  CONSECUTIVE_10 = 5,
  CONSECUTIVE_50 = 6,
  POWER_UP_MASTER = 7,
  OBSTACLE_DODGER = 8,
  SPEED_DEMON = 9,
  DAILY_PLAYER = 10,
  WEEKLY_CHAMPION = 11,
  MULTIPLAYER_WINNER = 12,
  TOKEN_EARNER = 13,
  EARLY_ADOPTER = 14,
}

/**
 * Rarity Levels Enum
 * Matches the solidity enum GaslessAchievements.Rarity
 */
export enum Rarity {
  COMMON = 0,
  RARE = 1,
  EPIC = 2,
  LEGENDARY = 3,
}

/**
 * Contract Configuration
 */
export const CONTRACT_CONFIG = {
  address: GASLESS_ACHIEVEMENTS_ADDRESS,
  abi: GASLESS_ACHIEVEMENTS_ABI,
  network: 'base',
  chainId: 8453,
  name: 'Jump Game Achievement',
  symbol: 'JGACH',
  blockExplorer: `https://basescan.org/address/${GASLESS_ACHIEVEMENTS_ADDRESS}`,
} as const
