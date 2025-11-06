const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Subscription contract", function () {
  let Subscription;
  let subscription;
  let owner;
  let addr1;
  let usdcTokenMock;

  // A simple mock ERC20 token for USDC with 6 decimals
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    usdcTokenMock = await ERC20Mock.deploy("USDC Mock", "USDC", 6);
    await usdcTokenMock.deployed();

    // Mint some USDC to addr1
    await usdcTokenMock.mint(addr1.address, ethers.utils.parseUnits("1000", 6));

    Subscription = await ethers.getContractFactory("Subscription");
    subscription = await Subscription.deploy(
      usdcTokenMock.address,
      ethers.utils.parseUnits("10", 6), // subscription price = 10 USDC
      30 * 24 * 3600 // 30 days
    );
    await subscription.deployed();
  });

  it("Should set correct initial subscription price and duration", async function () {
    expect(await subscription.subscriptionPrice()).to.equal(ethers.utils.parseUnits("10", 6));
    expect(await subscription.subscriptionDuration()).to.equal(30 * 24 * 3600);
  });

  it("Should allow user to subscribe and extend subscription", async function () {
    // addr1 approves subscription contract to spend USDC
    await usdcTokenMock.connect(addr1).approve(subscription.address, ethers.utils.parseUnits("10", 6));

    // addr1 subscribes
    await subscription.connect(addr1).subscribe();

    const expiry1 = await subscription.expiry(addr1.address);
    expect(expiry1).to.be.gt(0);

    // Move time forward less than duration and extend subscription
    await ethers.provider.send("evm_increaseTime", [15 * 24 * 3600]);
    await ethers.provider.send("evm_mine");

    // Approve again and re-subscribe to extend
    await subscription.connect(addr1).subscribe();

    const expiry2 = await subscription.expiry(addr1.address);
    expect(expiry2).to.be.gt(expiry1);
  });

  it("Should only allow owner to withdraw collected USDC", async function () {
    await usdcTokenMock.connect(addr1).approve(subscription.address, ethers.utils.parseUnits("10", 6));
    await subscription.connect(addr1).subscribe();

    // Non-owner withdraw should fail
    await expect(subscription.connect(addr1).withdraw()).to.be.revertedWith("Not owner");

    // Owner withdraw should succeed and transfer tokens
    await usdcTokenMock.transfer(subscription.address, ethers.utils.parseUnits("10", 6));
    const balanceBefore = await usdcTokenMock.balanceOf(owner.address);
    await subscription.withdraw();
    const balanceAfter = await usdcTokenMock.balanceOf(owner.address);

    expect(balanceAfter).to.be.gt(balanceBefore);
  });

  it("Should allow owner to update subscription price and duration", async function () {
    await subscription.updateSubscriptionPrice(ethers.utils.parseUnits("20", 6));
    expect(await subscription.subscriptionPrice()).to.equal(ethers.utils.parseUnits("20", 6));

    await subscription.updateSubscriptionDuration(60 * 24 * 3600);
    expect(await subscription.subscriptionDuration()).to.equal(60 * 24 * 3600);
  });

  it("Should correctly return isActive status", async function () {
    await usdcTokenMock.connect(addr1).approve(subscription.address, ethers.utils.parseUnits("10", 6));
    await subscription.connect(addr1).subscribe();

    expect(await subscription.isActive(addr1.address)).to.be.true;

    // Increase time beyond subscription duration
    await ethers.provider.send("evm_increaseTime", [31 * 24 * 3600]);
    await ethers.provider.send("evm_mine");

    expect(await subscription.isActive(addr1.address)).to.be.false;
  });
});
