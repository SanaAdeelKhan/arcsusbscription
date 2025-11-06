const { ethers } = require("ethers");
require('dotenv').config();
const fs = require("fs");
const path = require("path");

async function main() {
  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(process.env.ARC_TESTNET_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Read compiled contract json (ensure you have compiled with hardhat or foundry)
  const contractPath = path.join(__dirname, "../artifacts/contracts/Subscription.sol/Subscription.json");
  const contractJson = JSON.parse(fs.readFileSync(contractPath, "utf-8"));

  // Create a ContractFactory
  const factory = new ethers.ContractFactory(contractJson.abi, contractJson.bytecode, wallet);

  console.log("Deploying Subscription contract...");
  const subscriptionContract = await factory.deploy(
    process.env.USDC_CONTRACT_ADDRESS,              // _usdcToken address
    ethers.parseUnits("1.0", 6),                    // Initial subscription price (1 USDC with 6 decimals)
    30 * 24 * 3600                                  // Subscription duration: 30 days in seconds
  );

  await subscriptionContract.deployed();

  console.log(`Subscription contract deployed at: ${subscriptionContract.address}`);

  // Optionally save contract address to .env or config file
  // You can automate this saving step as per your project workflow
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
