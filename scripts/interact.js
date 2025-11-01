const { ethers } = require("ethers");
require('dotenv').config();

// Setup provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.ARC_TESTNET_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Addresses and ABIs
const walletAddress = process.env.WALLET_ADDRESS;
const contractAddress = process.env.SUBSCRIPTION_CONTRACT_ADDRESS;
const usdcAddress = process.env.USDC_CONTRACT_ADDRESS;

const subscriptionAbi = [
  "function subscribe() external"
];

const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address) view returns (uint256)"
];

// Check the USDC balance of your wallet
async function checkUSDCBalance() {
  const usdcContract = new ethers.Contract(usdcAddress, erc20Abi, provider);
  const balance = await usdcContract.balanceOf(walletAddress);
  console.log(`USDC balance: ${ethers.formatUnits(balance, 6)} USDC`);
  return balance;
}

// Approve and subscribe flow
async function approveAndSubscribe() {
  // Check balance first
  const balance = await checkUSDCBalance();
  const subscriptionAmount = ethers.parseUnits("1.0", 6); // 1 USDC with 6 decimals

  // Compare balances with BigInt
  if (balance < subscriptionAmount) {
    console.error("Insufficient USDC balance to subscribe.");
    return;
  }

  // Create USDC contract instance connected to wallet
  const usdcContract = new ethers.Contract(usdcAddress, erc20Abi, wallet);

  // Approve the subscription contract to spend tokens
  const approveTx = await usdcContract.approve(contractAddress, subscriptionAmount);
  console.log(`Approval TX hash: ${approveTx.hash}`);
  await approveTx.wait();
  console.log("Approval confirmed");

  // Create subscription contract instance connected to wallet
  const subscriptionContract = new ethers.Contract(contractAddress, subscriptionAbi, wallet);

  // Call subscribe()
  const subscribeTx = await subscriptionContract.subscribe();
  console.log(`Subscribe TX hash: ${subscribeTx.hash}`);
  await subscribeTx.wait();
  console.log("Subscription successful!");
}

// Run the approve and subscribe flow
approveAndSubscribe().catch(console.error);
