// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";

/**
 * @title GaslessAchievements
 * @dev NFT contract for game achievements with gasless claiming via EIP-2771 meta-transactions
 * @notice Players can claim achievement NFTs without paying gas fees using a trusted relayer
 *
 * Deployment Network: Base (Chain ID: 8453)
 *
 * Features:
 * - Gasless NFT minting using EIP-2771 meta-transactions
 * - Achievement tracking for game milestones
 * - View functions to check eligibility (no gas required)
 * - Integration with GameToken and GameRewards contracts
 * - Score-based achievement unlocking
 * - Rarity tiers (Common, Rare, Epic, Legendary)
 *
 * How Gasless Transactions Work:
 * 1. Player signs a message off-chain (no gas)
 * 2. Relayer submits transaction on-chain (relayer pays gas)
 * 3. Player receives NFT without spending any gas
 */
contract GaslessAchievements is
    ERC721,
    ERC721URIStorage,
    ERC721Enumerable,
    Ownable,
    ReentrancyGuard,
    ERC2771Context
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Achievement types based on game milestones
    enum AchievementType {
        FIRST_JUMP,          // Complete first jump
        SCORE_100,           // Reach score of 100
        SCORE_500,           // Reach score of 500
        SCORE_1000,          // Reach score of 1000
        SCORE_5000,          // Reach score of 5000
        CONSECUTIVE_10,      // 10 consecutive successful jumps
        CONSECUTIVE_50,      // 50 consecutive successful jumps
        POWER_UP_MASTER,     // Collect 100 power-ups
        OBSTACLE_DODGER,     // Dodge 1000 obstacles
        SPEED_DEMON,         // Complete level at max speed
        DAILY_PLAYER,        // Play 7 days in a row
        WEEKLY_CHAMPION,     // Top 10 on weekly leaderboard
        MULTIPLAYER_WINNER,  // Win 10 multiplayer matches
        TOKEN_EARNER,        // Earn 1000 game tokens
        EARLY_ADOPTER        // Join in first month
    }

    // Rarity levels
    enum Rarity {
        COMMON,
        RARE,
        EPIC,
        LEGENDARY
    }

    // Achievement configuration
    struct AchievementConfig {
        string name;
        string description;
        Rarity rarity;
        uint256 scoreRequired;
        bool isActive;
        string metadataURI;
    }

    // Achievement data for each minted NFT
    struct Achievement {
        AchievementType achievementType;
        uint256 scoreAtUnlock;
        uint256 timestamp;
        address player;
        Rarity rarity;
    }

    // Mapping from achievement type to configuration
    mapping(AchievementType => AchievementConfig) public achievementConfigs;

    // Mapping from token ID to achievement data
    mapping(uint256 => Achievement) public achievements;

    // Mapping to track which achievements a player has earned
    mapping(address => mapping(AchievementType => bool)) public hasAchievement;

    // Mapping to track player scores (updated by backend/game server)
    mapping(address => uint256) public playerScores;

    // Mapping to track player stats for complex achievements
    mapping(address => PlayerStats) public playerStats;

    struct PlayerStats {
        uint256 consecutiveJumps;
        uint256 powerUpsCollected;
        uint256 obstaclesDodged;
        uint256 multiplayerWins;
        uint256 tokensEarned;
        uint256 daysPlayed;
        uint256 lastPlayedDay;
    }

    // Authorized updaters (game backend, reward contracts)
    mapping(address => bool) public authorizedUpdaters;

    // Reference to GameRewards contract for token integration
    address public gameRewardsContract;

    // Base URI for metadata
    string private _baseTokenURI;

    // Events
    event AchievementUnlocked(
        address indexed player,
        uint256 indexed tokenId,
        AchievementType achievementType,
        uint256 score,
        Rarity rarity,
        uint256 timestamp
    );

    event ScoreUpdated(
        address indexed player,
        uint256 oldScore,
        uint256 newScore,
        uint256 timestamp
    );

    event StatsUpdated(
        address indexed player,
        uint256 timestamp
    );

    event AchievementConfigured(
        AchievementType indexed achievementType,
        string name,
        Rarity rarity,
        uint256 scoreRequired
    );

    event AuthorizedUpdaterChanged(
        address indexed updater,
        bool authorized
    );

    /**
     * @dev Constructor
     * @param initialOwner Address of the initial contract owner
     * @param trustedForwarder Address of the EIP-2771 trusted forwarder for gasless transactions
     */
    constructor(address initialOwner, address trustedForwarder)
        ERC721("Jump Game Achievement", "JGACH")
        Ownable(initialOwner)
        ERC2771Context(trustedForwarder)
    {
        _baseTokenURI = "https://api.jumpgame.com/metadata/achievements/";
        _initializeAchievements();
    }

    /**
     * @dev Initialize achievement configurations
     */
    function _initializeAchievements() private {
        _setAchievementConfig(AchievementType.FIRST_JUMP, "First Jump", "Complete your first jump!", Rarity.COMMON, 1);
        _setAchievementConfig(AchievementType.SCORE_100, "Century", "Reach a score of 100", Rarity.COMMON, 100);
        _setAchievementConfig(AchievementType.SCORE_500, "Rising Star", "Reach a score of 500", Rarity.RARE, 500);
        _setAchievementConfig(AchievementType.SCORE_1000, "Skilled Player", "Reach a score of 1000", Rarity.RARE, 1000);
        _setAchievementConfig(AchievementType.SCORE_5000, "Master Jumper", "Reach a score of 5000", Rarity.EPIC, 5000);
        _setAchievementConfig(AchievementType.CONSECUTIVE_10, "Combo Starter", "10 consecutive successful jumps", Rarity.RARE, 0);
        _setAchievementConfig(AchievementType.CONSECUTIVE_50, "Combo Master", "50 consecutive successful jumps", Rarity.EPIC, 0);
        _setAchievementConfig(AchievementType.POWER_UP_MASTER, "Power Collector", "Collect 100 power-ups", Rarity.RARE, 0);
        _setAchievementConfig(AchievementType.OBSTACLE_DODGER, "Untouchable", "Dodge 1000 obstacles", Rarity.EPIC, 0);
        _setAchievementConfig(AchievementType.SPEED_DEMON, "Speed Demon", "Complete level at maximum speed", Rarity.EPIC, 0);
        _setAchievementConfig(AchievementType.DAILY_PLAYER, "Dedicated", "Play 7 days in a row", Rarity.RARE, 0);
        _setAchievementConfig(AchievementType.WEEKLY_CHAMPION, "Weekly Champion", "Top 10 on weekly leaderboard", Rarity.EPIC, 0);
        _setAchievementConfig(AchievementType.MULTIPLAYER_WINNER, "PvP Champion", "Win 10 multiplayer matches", Rarity.EPIC, 0);
        _setAchievementConfig(AchievementType.TOKEN_EARNER, "Token Master", "Earn 1000 game tokens", Rarity.LEGENDARY, 0);
        _setAchievementConfig(AchievementType.EARLY_ADOPTER, "Early Adopter", "Join in the first month", Rarity.LEGENDARY, 0);
    }

    /**
     * @dev Set achievement configuration
     */
    function _setAchievementConfig(
        AchievementType achievementType,
        string memory name,
        string memory description,
        Rarity rarity,
        uint256 scoreRequired
    ) private {
        achievementConfigs[achievementType] = AchievementConfig({
            name: name,
            description: description,
            rarity: rarity,
            scoreRequired: scoreRequired,
            isActive: true,
            metadataURI: ""
        });
    }

    /**
     * @dev Update achievement configuration (only owner)
     */
    function updateAchievementConfig(
        AchievementType achievementType,
        string memory name,
        string memory description,
        Rarity rarity,
        uint256 scoreRequired,
        bool isActive,
        string memory metadataURI
    ) external onlyOwner {
        achievementConfigs[achievementType] = AchievementConfig({
            name: name,
            description: description,
            rarity: rarity,
            scoreRequired: scoreRequired,
            isActive: isActive,
            metadataURI: metadataURI
        });

        emit AchievementConfigured(achievementType, name, rarity, scoreRequired);
    }

    /**
     * @dev Set base URI for metadata
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Returns the base URI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Set GameRewards contract address
     */
    function setGameRewardsContract(address _gameRewardsContract) external onlyOwner {
        gameRewardsContract = _gameRewardsContract;
    }

    /**
     * @dev Set authorized updater (game backend)
     */
    function setAuthorizedUpdater(address updater, bool authorized) external onlyOwner {
        authorizedUpdaters[updater] = authorized;
        emit AuthorizedUpdaterChanged(updater, authorized);
    }

    /**
     * @dev Update player score (called by authorized updater or game server)
     */
    function updatePlayerScore(address player, uint256 newScore) external {
        require(
            authorizedUpdaters[_msgSender()] || _msgSender() == owner(),
            "Not authorized to update scores"
        );

        uint256 oldScore = playerScores[player];
        playerScores[player] = newScore;

        emit ScoreUpdated(player, oldScore, newScore, block.timestamp);
    }

    /**
     * @dev Update player stats (called by authorized updater)
     */
    function updatePlayerStats(
        address player,
        uint256 consecutiveJumps,
        uint256 powerUpsCollected,
        uint256 obstaclesDodged,
        uint256 multiplayerWins,
        uint256 tokensEarned,
        uint256 daysPlayed
    ) external {
        require(
            authorizedUpdaters[_msgSender()] || _msgSender() == owner(),
            "Not authorized to update stats"
        );

        playerStats[player] = PlayerStats({
            consecutiveJumps: consecutiveJumps,
            powerUpsCollected: powerUpsCollected,
            obstaclesDodged: obstaclesDodged,
            multiplayerWins: multiplayerWins,
            tokensEarned: tokensEarned,
            daysPlayed: daysPlayed,
            lastPlayedDay: block.timestamp / 1 days
        });

        emit StatsUpdated(player, block.timestamp);
    }

    /**
     * @dev Check if player is eligible for an achievement (VIEW FUNCTION - NO GAS)
     * @param player Address of the player
     * @param achievementType Type of achievement to check
     * @return bool indicating eligibility
     */
    function isEligible(address player, AchievementType achievementType)
        public
        view
        returns (bool)
    {
        // Already has achievement
        if (hasAchievement[player][achievementType]) {
            return false;
        }

        // Check if achievement is active
        if (!achievementConfigs[achievementType].isActive) {
            return false;
        }

        AchievementConfig memory config = achievementConfigs[achievementType];
        PlayerStats memory stats = playerStats[player];

        // Check eligibility based on achievement type
        if (achievementType == AchievementType.FIRST_JUMP) {
            return playerScores[player] >= 1;
        } else if (achievementType == AchievementType.SCORE_100) {
            return playerScores[player] >= 100;
        } else if (achievementType == AchievementType.SCORE_500) {
            return playerScores[player] >= 500;
        } else if (achievementType == AchievementType.SCORE_1000) {
            return playerScores[player] >= 1000;
        } else if (achievementType == AchievementType.SCORE_5000) {
            return playerScores[player] >= 5000;
        } else if (achievementType == AchievementType.CONSECUTIVE_10) {
            return stats.consecutiveJumps >= 10;
        } else if (achievementType == AchievementType.CONSECUTIVE_50) {
            return stats.consecutiveJumps >= 50;
        } else if (achievementType == AchievementType.POWER_UP_MASTER) {
            return stats.powerUpsCollected >= 100;
        } else if (achievementType == AchievementType.OBSTACLE_DODGER) {
            return stats.obstaclesDodged >= 1000;
        } else if (achievementType == AchievementType.DAILY_PLAYER) {
            return stats.daysPlayed >= 7;
        } else if (achievementType == AchievementType.MULTIPLAYER_WINNER) {
            return stats.multiplayerWins >= 10;
        } else if (achievementType == AchievementType.TOKEN_EARNER) {
            return stats.tokensEarned >= 1000;
        }

        // For other achievements, check score requirement
        return playerScores[player] >= config.scoreRequired;
    }

    /**
     * @dev Get all eligible achievements for a player (VIEW FUNCTION - NO GAS)
     * @param player Address of the player
     * @return Array of eligible achievement types
     */
    function getEligibleAchievements(address player)
        external
        view
        returns (AchievementType[] memory)
    {
        // Count eligible achievements
        uint256 count = 0;
        for (uint256 i = 0; i < 15; i++) {
            if (isEligible(player, AchievementType(i))) {
                count++;
            }
        }

        // Build array of eligible achievements
        AchievementType[] memory eligible = new AchievementType[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < 15; i++) {
            if (isEligible(player, AchievementType(i))) {
                eligible[index] = AchievementType(i);
                index++;
            }
        }

        return eligible;
    }

    /**
     * @dev Claim achievement NFT (GASLESS via meta-transaction)
     * @param achievementType Type of achievement to claim
     */
    function claimAchievement(AchievementType achievementType)
        public
        nonReentrant
        returns (uint256)
    {
        address player = _msgSender(); // ERC2771Context handles meta-tx sender

        require(isEligible(player, achievementType), "Not eligible for this achievement");

        AchievementConfig memory config = achievementConfigs[achievementType];
        uint256 currentScore = playerScores[player];

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(player, tokenId);

        // Set metadata URI
        string memory uri = bytes(config.metadataURI).length > 0
            ? config.metadataURI
            : string(abi.encodePacked(_baseTokenURI, _toString(uint256(achievementType))));
        _setTokenURI(tokenId, uri);

        achievements[tokenId] = Achievement({
            achievementType: achievementType,
            scoreAtUnlock: currentScore,
            timestamp: block.timestamp,
            player: player,
            rarity: config.rarity
        });

        hasAchievement[player][achievementType] = true;

        emit AchievementUnlocked(
            player,
            tokenId,
            achievementType,
            currentScore,
            config.rarity,
            block.timestamp
        );

        return tokenId;
    }

    /**
     * @dev Batch claim multiple achievements (GASLESS)
     * @param achievementTypes Array of achievement types to claim
     */
    function batchClaimAchievements(AchievementType[] memory achievementTypes)
        external
        nonReentrant
        returns (uint256[] memory)
    {
        uint256[] memory tokenIds = new uint256[](achievementTypes.length);

        for (uint256 i = 0; i < achievementTypes.length; i++) {
            tokenIds[i] = claimAchievement(achievementTypes[i]);
        }

        return tokenIds;
    }

    /**
     * @dev Get all achievements owned by a player (VIEW FUNCTION - NO GAS)
     * @param player Address of the player
     * @return Array of token IDs
     */
    function getPlayerAchievements(address player)
        external
        view
        returns (uint256[] memory)
    {
        uint256 tokenCount = balanceOf(player);
        uint256[] memory tokenIds = new uint256[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(player, i);
        }

        return tokenIds;
    }

    /**
     * @dev Get achievement details (VIEW FUNCTION - NO GAS)
     */
    function getAchievementDetails(uint256 tokenId)
        external
        view
        returns (Achievement memory)
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return achievements[tokenId];
    }

    /**
     * @dev Convert uint to string
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    // Override functions for ERC2771Context compatibility

    function _msgSender()
        internal
        view
        virtual
        override(Context, ERC2771Context)
        returns (address)
    {
        return ERC2771Context._msgSender();
    }

    function _msgData()
        internal
        view
        virtual
        override(Context, ERC2771Context)
        returns (bytes calldata)
    {
        return ERC2771Context._msgData();
    }

    function _contextSuffixLength()
        internal
        view
        virtual
        override(Context, ERC2771Context)
        returns (uint256)
    {
        return ERC2771Context._contextSuffixLength();
    }

    // Required overrides for ERC721

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

