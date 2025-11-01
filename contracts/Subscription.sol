// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Subscription {
    address public owner;
    IERC20 public usdcToken;
    uint256 public subscriptionPrice;      // in USDC smallest unit, e.g. 6 decimals
    uint256 public subscriptionDuration;   // in seconds

    mapping(address => uint256) public expiry;

    event Subscribed(address indexed subscriber, uint256 expiryTimestamp, uint256 amount);
    event Withdrawn(address indexed owner, uint256 amount);
    event SubscriptionPriceUpdated(uint256 oldPrice, uint256 newPrice);
    event SubscriptionDurationUpdated(uint256 oldDuration, uint256 newDuration);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _usdcToken, uint256 _price, uint256 _duration) {
        owner = msg.sender;
        usdcToken = IERC20(_usdcToken);
        subscriptionPrice = _price;
        subscriptionDuration = _duration;
    }

    function subscribe() external {
        require(
            usdcToken.transferFrom(msg.sender, address(this), subscriptionPrice),
            "Payment failed"
        );

        if (expiry[msg.sender] > block.timestamp) {
            expiry[msg.sender] += subscriptionDuration;  // extend
        } else {
            expiry[msg.sender] = block.timestamp + subscriptionDuration;  // new subscription
        }

        emit Subscribed(msg.sender, expiry[msg.sender], subscriptionPrice);
    }

    function isActive(address user) external view returns (bool) {
        return expiry[user] > block.timestamp;
    }

    // Owner can withdraw USDC collected
    function withdraw() external onlyOwner {
        uint256 balance = usdcToken.balanceOf(address(this));
        require(balance > 0, "No balance");
        require(usdcToken.transfer(owner, balance), "Withdraw transfer failed");

        emit Withdrawn(owner, balance);
    }

    // Owner can update subscription price
    function updateSubscriptionPrice(uint256 newPrice) external onlyOwner {
        uint256 oldPrice = subscriptionPrice;
        subscriptionPrice = newPrice;
        emit SubscriptionPriceUpdated(oldPrice, newPrice);
    }

    // Owner can update subscription duration
    function updateSubscriptionDuration(uint256 newDuration) external onlyOwner {
        uint256 oldDuration = subscriptionDuration;
        subscriptionDuration = newDuration;
        emit SubscriptionDurationUpdated(oldDuration, newDuration);
    }
}
