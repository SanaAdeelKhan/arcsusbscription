import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

//const ARC_TESTNET_RPC = process.env.REACT_APP_ARC_TESTNET_RPC_URL;
const SUBSCRIPTION_CONTRACT_ADDRESS = process.env.REACT_APP_SUBSCRIPTION_CONTRACT_ADDRESS;
const USDC_CONTRACT_ADDRESS = process.env.REACT_APP_USDC_CONTRACT_ADDRESS;

const erc20Abi = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function balanceOf(address) view returns (uint256)"
];

const subscriptionAbi = [
  "function subscribe() external"
];

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [usdcBalance, setUsdcBalance] = useState("0");
  const [status, setStatus] = useState("Not connected");

  useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);

      // Listen for account and chain changes
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
          setStatus(`Account changed: ${accounts[0].substring(0, 6)}...`);
          fetchUsdcBalance(accounts[0], web3Provider);
        } else {
          setUserAddress("");
          setStatus("Please connect wallet");
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    } else {
      setStatus("Please install MetaMask");
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected");
      return;
    }
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();
      const address = await signer.getAddress();
      setSigner(signer);
      setUserAddress(address);
      setStatus(`Connected: ${address.substring(0, 6)}...`);
      fetchUsdcBalance(address, web3Provider);
    } catch (error) {
      setStatus("Wallet connection failed: " + error.message);
      console.error(error);
    }
  };

  const fetchUsdcBalance = async (address, providerInstance) => {
    try {
      const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, erc20Abi, providerInstance);
      const balance = await usdcContract.balanceOf(address);
      setUsdcBalance(ethers.formatUnits(balance, 6));
    } catch (error) {
      setStatus("Failed to fetch USDC balance");
      console.error(error);
    }
  };

  const subscribe = async () => {
    if (!signer) {
      alert("Connect your wallet first");
      return;
    }
    setStatus("Approving tokens...");
    try {
      const subscriptionAmount = ethers.parseUnits("10", 6);
      const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, erc20Abi, signer);
      const approveTx = await usdcContract.approve(SUBSCRIPTION_CONTRACT_ADDRESS, subscriptionAmount);
      await approveTx.wait();

      setStatus("Approval confirmed. Subscribing...");

      const subscriptionContract = new ethers.Contract(SUBSCRIPTION_CONTRACT_ADDRESS, subscriptionAbi, signer);
      const subscribeTx = await subscriptionContract.subscribe();
      await subscribeTx.wait();

      setStatus("Subscription successful!");
      fetchUsdcBalance(userAddress, provider);
    } catch (error) {
      setStatus("Subscription failed: " + error.message);
      console.error(error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Subscription Payment Agent</h1>
      {!userAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Address: {userAddress}</p>
          <p>USDC Balance: {usdcBalance}</p>
          <button onClick={subscribe}>Subscribe</button>
        </>
      )}
      <p>Status: {status}</p>
    </div>
  );
}

export default App;
