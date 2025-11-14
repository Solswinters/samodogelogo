// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SimpleGameRewards
 * @dev Simplified reward system - players can claim based on score with basic protections
 * No signature verification needed - truly permissionless!
 */
contract SimpleGameRewards is Ownable, ReentrancyGuard {
    IERC20 public immutable gameToken;

    uint256 public baseReward = 10 * 10**18; // 10 JUMP tokens
    uint256 public scoreToTokenRate = 100; // 1 JUMP per 100 score points
    uint256 public maxRewardPerClaim = 1000 * 10**18; // Maximum 1000 JUMP per claim
    uint256 public cooldownPeriod = 1 hours; // 1 hour cooldown between claims
    uint256 public minScore = 10; // Minimum score to claim (prevents zero claims)

    mapping(address => uint256) public lastClaimTime;
    mapping(address => uint256) public gamesPlayed;
    mapping(address => uint256) public totalClaimed;
    mapping(address => uint256) public highestScore;

    event RewardClaimed(
        address indexed player,
        uint256 score,
        uint256 reward,
        uint256 timestamp
    );
    event BaseRewardUpdated(uint256 newBaseReward);
    event ScoreToTokenRateUpdated(uint256 newRate);
    event CooldownPeriodUpdated(uint256 newCooldownPeriod);
    event MaxRewardUpdated(uint256 newMaxReward);
    event TokensWithdrawn(address indexed to, uint256 amount);

    constructor(
        address _gameToken,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_gameToken != address(0), "Invalid token address");
        gameToken = IERC20(_gameToken);
    }

    /**
     * @dev Claims reward for a completed game - NO SIGNATURE NEEDED!
     * @param score The player's game score
     */
    function claimReward(uint256 score) external nonReentrant {
        address player = msg.sender;

        // Check cooldown
        require(
            block.timestamp >= lastClaimTime[player] + cooldownPeriod,
            "Cooldown period not elapsed"
        );

        // Check minimum score
        require(score >= minScore, "Score too low");

        // Calculate reward
        uint256 reward = calculateReward(score);

        require(reward > 0, "Reward must be greater than 0");
        require(reward <= maxRewardPerClaim, "Reward exceeds maximum");
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

        emit RewardClaimed(player, score, reward, block.timestamp);
    }

    /**
     * @dev Calculates reward based on score
     * @param score The player's score
     * @return The calculated reward amount
     */
    function calculateReward(uint256 score) public view returns (uint256) {
        // Base reward + bonus based on score
        uint256 reward = baseReward + ((score / scoreToTokenRate) * 10**18);
        
        // Cap at max reward
        if (reward > maxRewardPerClaim) {
            reward = maxRewardPerClaim;
        }
        
        return reward;
    }

    /**
     * @dev Get player statistics
     */
    function getPlayerStats(address player)
        public
        view
        returns (
            uint256 gamesPlayedCount,
            uint256 totalClaimedAmount,
            uint256 highestScoreAchieved,
            uint256 lastClaimTimestamp
        )
    {
        return (
            gamesPlayed[player],
            totalClaimed[player],
            highestScore[player],
            lastClaimTime[player]
        );
    }

    /**
     * @dev Get time until next claim is available
     */
    function getTimeUntilNextClaim(address player) public view returns (uint256) {
        uint256 timePassed = block.timestamp - lastClaimTime[player];
        if (timePassed >= cooldownPeriod) {
            return 0;
        } else {
            return cooldownPeriod - timePassed;
        }
    }

    // Owner functions to update parameters

    function setBaseReward(uint256 _baseReward) public onlyOwner {
        baseReward = _baseReward;
        emit BaseRewardUpdated(_baseReward);
    }

    function setScoreToTokenRate(uint256 _rate) public onlyOwner {
        require(_rate > 0, "Rate must be greater than 0");
        scoreToTokenRate = _rate;
        emit ScoreToTokenRateUpdated(_rate);
    }

    function setCooldownPeriod(uint256 _cooldownPeriod) public onlyOwner {
        cooldownPeriod = _cooldownPeriod;
        emit CooldownPeriodUpdated(_cooldownPeriod);
    }

    function setMaxRewardPerClaim(uint256 _maxReward) public onlyOwner {
        require(_maxReward > 0, "Max reward must be greater than 0");
        maxRewardPerClaim = _maxReward;
        emit MaxRewardUpdated(_maxReward);
    }

    function setMinScore(uint256 _minScore) public onlyOwner {
        minScore = _minScore;
    }

    /**
     * @dev Owner can withdraw tokens from the contract
     */
    function withdrawTokens(address to, uint256 amount) public onlyOwner nonReentrant {
        require(to != address(0), "Invalid recipient address");
        require(gameToken.balanceOf(address(this)) >= amount, "Insufficient balance");
        gameToken.transfer(to, amount);
        emit TokensWithdrawn(to, amount);
    }
}

