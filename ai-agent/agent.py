import os
import json
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

# Blockchain setup (Arc RPC and account)
ARC_RPC_URL = os.getenv("ARC_RPC_URL")
PRIVATE_KEY = os.getenv("WALLET_PRIVATE_KEY")
ACCOUNT_ADDRESS = Web3.toChecksumAddress(os.getenv("WALLET_ADDRESS"))

# Contract & USDC token addresses (deployed on Arc)
SUBSCRIPTION_CONTRACT_ADDRESS = Web3.toChecksumAddress(os.getenv("SUBSCRIPTION_CONTRACT_ADDRESS"))
USDC_TOKEN_ADDRESS = Web3.toChecksumAddress(os.getenv("USDC_TOKEN_ADDRESS"))

# ABI files (should be compiled and saved as JSON files)
with open('SubscriptionABI.json') as f:
    SUBSCRIPTION_ABI = json.load(f)
with open('IERC20ABI.json') as f:
    IERC20_ABI = json.load(f)

# Connect to Arc node
web3 = Web3(Web3.HTTPProvider(ARC_RPC_URL))

# Contract instances
subscription_contract = web3.eth.contract(address=SUBSCRIPTION_CONTRACT_ADDRESS, abi=SUBSCRIPTION_ABI)
usdc_token = web3.eth.contract(address=USDC_TOKEN_ADDRESS, abi=IERC20_ABI)

def check_eth_balance():
    balance = web3.eth.get_balance(ACCOUNT_ADDRESS)
    print(f"Native balance: {web3.fromWei(balance, 'ether')} ARC")

def approve_usdc(amount):
    """Approve subscription contract to spend USDC on user's behalf"""
    nonce = web3.eth.get_transaction_count(ACCOUNT_ADDRESS)
    txn = usdc_token.functions.approve(SUBSCRIPTION_CONTRACT_ADDRESS, amount).buildTransaction({
        'from': ACCOUNT_ADDRESS,
        'nonce': nonce,
        'gas': 100000,
        'gasPrice': web3.toWei('0.5', 'gwei')
    })
    signed_txn = web3.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)
    tx_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
    receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"USDC approve tx completed: {tx_hash.hex()}")
    return receipt.status == 1

def subscribe():
    """Call subscribe() on the contract"""
    nonce = web3.eth.get_transaction_count(ACCOUNT_ADDRESS)
    txn = subscription_contract.functions.subscribe().buildTransaction({
        'from': ACCOUNT_ADDRESS,
        'nonce': nonce,
        'gas': 200000,
        'gasPrice': web3.toWei('1', 'gwei')
    })
    signed_txn = web3.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)
    tx_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
    receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Subscription tx completed: {tx_hash.hex()}")
    return receipt.status == 1

def get_subscription_price():
    return subscription_contract.functions.subscriptionPrice().call()

def analyze_engagement_and_adjust_price(engagement_score):
    current_price = get_subscription_price()
    if engagement_score > 80:
        new_price = int(current_price * 1.1)
    elif engagement_score < 30:
        new_price = int(current_price * 0.9)
    else:
        new_price = current_price

    if new_price != current_price:
        print(f"Adjusting subscription price from {current_price} to {new_price}")
        set_subscription_price(new_price)
    else:
        print("No price adjustment needed")

def set_subscription_price(new_price):
    nonce = web3.eth.get_transaction_count(ACCOUNT_ADDRESS)
    txn = subscription_contract.functions.updateSubscriptionPrice(new_price).buildTransaction({
        'from': ACCOUNT_ADDRESS,
        'nonce': nonce,
        'gas': 100000,
        'gasPrice': web3.toWei('1', 'gwei')
    })
    signed_txn = web3.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)
    tx_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
    receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Subscription price update tx completed: {tx_hash.hex()}")
    return receipt.status == 1

def analyze_payment_intent(user_message):
    # Simple ethical rules demo example - extend as needed
    blocked_keywords = ['gambling', 'scam', 'illegal']
    if any(word in user_message.lower() for word in blocked_keywords):
        return {
            "approved": False,
            "reason": "Payment to prohibited services",
            "risk_level": "high"
        }
    # Extract amount here (simple parsing demo, improve with NLP)
    amount = get_subscription_price()
    recipient = SUBSCRIPTION_CONTRACT_ADDRESS
    return {
        "approved": True,
        "amount": amount,
        "recipient": recipient,
        "reason": "Payment allowed",
        "risk_level": "low"
    }

def process_user_subscription(user_message, engagement_score):
    analysis = analyze_payment_intent(user_message)
    if not analysis['approved']:
        print(f"Payment blocked: {analysis['reason']}")
        return False

    # Adjust price based on user engagement
    analyze_engagement_and_adjust_price(engagement_score)

    # Approve and subscribe payment
    approved = approve_usdc(analysis['amount'])
    if not approved:
        print("USDC approve failed")
        return False
    subscribed = subscribe()
    print(f"Subscription status: {'Success' if subscribed else 'Failed'}")
    return subscribed

# Example usage
if __name__ == "__main__":
    check_eth_balance()
    user_msg = "Subscribe me to premium content"
    engagement = 75  # hypothetical engagement score
    process_user_subscription(user_msg, engagement)
