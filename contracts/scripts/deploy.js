const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  
  // Deploy GameToken
  console.log("\nDeploying GameToken...");
  const GameToken = await hre.ethers.getContractFactory("GameToken");
  const gameToken = await GameToken.deploy(deployer.address);
  await gameToken.waitForDeployment();
  const gameTokenAddress = await gameToken.getAddress();
  console.log("GameToken deployed to:", gameTokenAddress);
  
  // Deploy GameRewards
  console.log("\nDeploying GameRewards...");
  const GameRewards = await hre.ethers.getContractFactory("GameRewards");
  
  // Use deployer address as initial verifier (you should change this to your backend signer address)
  const verifierAddress = deployer.address;
  console.log("Using verifier address:", verifierAddress);
  
  const gameRewards = await GameRewards.deploy(
    gameTokenAddress,
    verifierAddress,
    deployer.address
  );
  await gameRewards.waitForDeployment();
  const gameRewardsAddress = await gameRewards.getAddress();
  console.log("GameRewards deployed to:", gameRewardsAddress);
  
  // Set GameRewards contract address in GameToken
  console.log("\nSetting GameRewards contract in GameToken...");
  const tx1 = await gameToken.setGameRewardsContract(gameRewardsAddress);
  await tx1.wait();
  console.log("GameRewards contract set in GameToken");
  
  // Transfer tokens to GameRewards contract for distribution
  console.log("\nTransferring tokens to GameRewards contract...");
  const transferAmount = hre.ethers.parseEther("5000000"); // 5 million tokens
  const tx2 = await gameToken.transfer(gameRewardsAddress, transferAmount);
  await tx2.wait();
  console.log("Transferred", hre.ethers.formatEther(transferAmount), "tokens to GameRewards");
  
  // Save deployment addresses
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    contracts: {
      GameToken: gameTokenAddress,
      GameRewards: gameRewardsAddress,
    },
    timestamp: new Date().toISOString(),
  };
  
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const deploymentFile = path.join(
    deploymentsDir,
    `${hre.network.name}-${Date.now()}.json`
  );
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("\nDeployment info saved to:", deploymentFile);
  
  // Save latest deployment for easy reference
  const latestFile = path.join(deploymentsDir, `${hre.network.name}-latest.json`);
  fs.writeFileSync(latestFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("Latest deployment saved to:", latestFile);
  
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", hre.network.name);
  console.log("GameToken:", gameTokenAddress);
  console.log("GameRewards:", gameRewardsAddress);
  console.log("Verifier:", verifierAddress);
  console.log("\nIMPORTANT: Update your .env file with these addresses!");
  console.log("NEXT_PUBLIC_GAME_TOKEN_ADDRESS=" + gameTokenAddress);
  console.log("NEXT_PUBLIC_GAME_REWARDS_ADDRESS=" + gameRewardsAddress);
  
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\nWaiting for block confirmations before verification...");
    await gameToken.deploymentTransaction().wait(5);
    
    console.log("\nVerifying contracts on Basescan...");
    try {
      await hre.run("verify:verify", {
        address: gameTokenAddress,
        constructorArguments: [deployer.address],
      });
      console.log("GameToken verified");
    } catch (error) {
      console.log("GameToken verification error:", error.message);
    }
    
    try {
      await hre.run("verify:verify", {
        address: gameRewardsAddress,
        constructorArguments: [gameTokenAddress, verifierAddress, deployer.address],
      });
      console.log("GameRewards verified");
    } catch (error) {
      console.log("GameRewards verification error:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

