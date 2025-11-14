// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GameRewards
 * @dev Manages token distribution to players based on verified game scores
 */
contract GameRewards is Ownable, ReentrancyGuard {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;
    
    /// @dev The game token contract
    IERC20 public gameToken;
    
    /// @dev Address authorized to sign score verifications
    address public verifier;
    
    /// @dev Base reward amount (with 18 decimals)
    uint256 public baseReward = 10 * 10**18; // 10 tokens
    
    /// @dev Cooldown period between claims (in seconds)
    uint256 public cooldownPeriod = 1 hours;
    
    /// @dev Bonus multiplier for multiplayer winners (basis points, 10000 = 100%)
    uint256 public winnerMultiplier = 15000; // 150% (1.5x)
    
    /// @dev Score to token conversion rate (score points per token)
    uint256 public scoreToTokenRate = 100;
    
    /// @dev Mapping of player address to last claim timestamp
    mapping(address => uint256) public lastClaimTime;
    
    /// @dev Mapping of player address to total tokens claimed
    mapping(address => uint256) public totalClaimed;
    
    /// @dev Mapping of used signatures to prevent replay attacks
    mapping(bytes32 => bool) public usedSignatures;
    
    /// @dev Mapping of player address to total games played
    mapping(address => uint256) public gamesPlayed;
    
    /// @dev Mapping of player address to highest score
    mapping(address => uint256) public highestScore;
    
    event RewardClaimed(
        address indexed player,
        uint256 score,
        uint256 reward,
        bool isWinner,
        uint256 timestamp
    );
    event VerifierUpdated(address indexed newVerifier);
    event BaseRewardUpdated(uint256 newBaseReward);
    event CooldownPeriodUpdated(uint256 newCooldownPeriod);
    event TokensWithdrawn(address indexed to, uint256 amount);
    
    constructor(
        address _gameToken,
        address _verifier,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_gameToken != address(0), "Invalid token address");
        require(_verifier != address(0), "Invalid verifier address");
        
        gameToken = IERC20(_gameToken);
        verifier = _verifier;
    }
    
    /**
     * @dev Claims reward for a completed game
     * @param score The player's game score
     * @param isWinner Whether the player won the multiplayer match
     * @param nonce Unique nonce for this claim
     * @param signature Signature from the verifier
     */
    function claimReward(
        uint256 score,
        bool isWinner,
        uint256 nonce,
        bytes memory signature
    ) external nonReentrant {
        address player = msg.sender;
        
        // Check cooldown
        require(
            block.timestamp >= lastClaimTime[player] + cooldownPeriod,
            "Cooldown period not elapsed"
        );
        
        // Verify signature
        bytes32 messageHash = keccak256(
            abi.encodePacked(player, score, isWinner, nonce)
        );
        
        require(!usedSignatures[messageHash], "Signature already used");
        
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address recoveredSigner = ethSignedMessageHash.recover(signature);
        
        require(recoveredSigner == verifier, "Invalid signature");
        
        // Mark signature as used
        usedSignatures[messageHash] = true;
        
        // Calculate reward
        uint256 reward = calculateReward(score, isWinner);
        
        require(reward > 0, "Reward must be greater than 0");
        require(
            gameToken.balanceOf(address(this)) >= reward,
            "Insufficient contract balance"
        );
        
        // Update player stats
        lastClaimTime[player] = block.timestamp;
        totalClaimed[player] += reward;
        gamesPlayed[player] += 1;
        
        if (score > highestScore[player]) {
            highestScore[player] = score;
        }
        
        // Transfer reward
        require(gameToken.transfer(player, reward), "Token transfer failed");
        
        emit RewardClaimed(player, score, reward, isWinner, block.timestamp);
    }
    
    /**
     * @dev Calculates reward based on score and winner status
     * @param score The player's score
     * @param isWinner Whether the player won
     * @return The calculated reward amount
     */
    function calculateReward(uint256 score, bool isWinner) public view returns (uint256) {
        // Base reward + bonus based on score
        uint256 reward = baseReward + ((score * 10**18) / scoreToTokenRate);
        
        // Apply winner multiplier
        if (isWinner) {
            reward = (reward * winnerMultiplier) / 10000;
        }
        
        return reward;
    }
    
    /**
     * @dev Updates the verifier address
     * @param _verifier New verifier address
     */
    function setVerifier(address _verifier) external onlyOwner {
        require(_verifier != address(0), "Invalid address");
        verifier = _verifier;
        emit VerifierUpdated(_verifier);
    }
    
    /**
     * @dev Updates the base reward amount
     * @param _baseReward New base reward amount
     */
    function setBaseReward(uint256 _baseReward) external onlyOwner {
        baseReward = _baseReward;
        emit BaseRewardUpdated(_baseReward);
    }
    
    /**
     * @dev Updates the cooldown period
     * @param _cooldownPeriod New cooldown period in seconds
     */
    function setCooldownPeriod(uint256 _cooldownPeriod) external onlyOwner {
        cooldownPeriod = _cooldownPeriod;
        emit CooldownPeriodUpdated(_cooldownPeriod);
    }
    
    /**
     * @dev Updates the winner multiplier
     * @param _winnerMultiplier New multiplier in basis points
     */
    function setWinnerMultiplier(uint256 _winnerMultiplier) external onlyOwner {
        require(_winnerMultiplier >= 10000, "Multiplier must be >= 100%");
        winnerMultiplier = _winnerMultiplier;
    }
    
    /**
     * @dev Updates the score to token conversion rate
     * @param _scoreToTokenRate New conversion rate
     */
    function setScoreToTokenRate(uint256 _scoreToTokenRate) external onlyOwner {
        require(_scoreToTokenRate > 0, "Rate must be greater than 0");
        scoreToTokenRate = _scoreToTokenRate;
    }
    
    /**
     * @dev Allows owner to withdraw tokens from the contract
     * @param to Address to receive the tokens
     * @param amount Amount of tokens to withdraw
     */
    function withdrawTokens(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid address");
        require(
            gameToken.balanceOf(address(this)) >= amount,
            "Insufficient balance"
        );
        require(gameToken.transfer(to, amount), "Token transfer failed");
        emit TokensWithdrawn(to, amount);
    }
    
    /**
     * @dev Gets the time remaining until next claim is available
     * @param player The player's address
     * @return Time remaining in seconds, or 0 if claim is available
     */
    function getTimeUntilNextClaim(address player) external view returns (uint256) {
        uint256 nextClaimTime = lastClaimTime[player] + cooldownPeriod;
        if (block.timestamp >= nextClaimTime) {
            return 0;
        }
        return nextClaimTime - block.timestamp;
    }
    
    /**
     * @dev Gets player statistics
     * @param player The player's address
     * @return gamesPlayedCount Number of games played
     * @return totalClaimedAmount Total tokens claimed
     * @return highestScoreAchieved Highest score achieved
     * @return lastClaimTimestamp Last claim timestamp
     */
    function getPlayerStats(address player) external view returns (
        uint256 gamesPlayedCount,
        uint256 totalClaimedAmount,
        uint256 highestScoreAchieved,
        uint256 lastClaimTimestamp
    ) {
        return (
            gamesPlayed[player],
            totalClaimed[player],
            highestScore[player],
            lastClaimTime[player]
        );
    }
}

