
# AI Subscription Payment Agent on Arc

Autonomous AI-powered subscription payment system built on the Arc blockchain using native USDC for stable, on-chain recurring payments. This project demonstrates the integration of Solidity smart contracts, AI automation, and Arc's deterministic fee structure for real-world content creator micropayments.

## Features

* Smart contract for user subscription registration and recurring payment scheduling
* Off-chain AI agent dynamically adjusts subscription pricing based on engagement signals
* Autonomous on-chain payment execution using Arc native USDC
* Simple web UI for managing subscriptions and viewing payments
* Deployable and testable on Arc Testnet with accessible USDC faucet

## Tech Stack

* Solidity smart contracts deployed on Arc blockchain testnet
* AI automation script in Python/JavaScript
* Arc blockchain tools including USDC faucet and wallet SDK
* Optional React or Vue frontend for subscription management

## Getting Started

## Prerequisites

* Node.js >= 16.x
* Foundry (for Solidity development and deployment)
* Python 3.8+ (if using Python AI script) or Node.js for JS agent
* Access to Arc Testnet and USDC testnet faucet

## Setup

1. Clone the repository:
   <pre class="not-prose w-full rounded font-mono text-sm font-extralight"><div class="codeWrapper text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded font-mono text-sm font-normal bg-subtler"><div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end md:sticky md:top-[100px]"><div class="overflow-hidden rounded-full border-subtlest ring-subtlest divide-subtlest bg-base"><div class="border-subtlest ring-subtlest divide-subtlest bg-subtler"></div></div></div><div class="-mt-xl"><div><div data-testid="code-language-indicator" class="text-quiet bg-subtle py-xs px-sm inline-block rounded-br rounded-tl-[3px] font-thin">bash</div></div><div><span><code><span class="token token">git</span><span> clone https://github.com/yourusername/arcsusbscription.git
   </span><span></span><span class="token token">cd</span><span> arcsusbscription
   </span></code></span></div></div></div></pre>
2. Install dependencies for AI agent and frontend:
   <pre class="not-prose w-full rounded font-mono text-sm font-extralight"><div class="codeWrapper text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded font-mono text-sm font-normal bg-subtler"><div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end md:sticky md:top-[100px]"><div class="overflow-hidden rounded-full border-subtlest ring-subtlest divide-subtlest bg-base"><div class="border-subtlest ring-subtlest divide-subtlest bg-subtler"></div></div></div><div class="-mt-xl"><div><div data-testid="code-language-indicator" class="text-quiet bg-subtle py-xs px-sm inline-block rounded-br rounded-tl-[3px] font-thin">bash</div></div><div><span><code><span class="token token">cd</span><span> ai-agent
   </span><span></span><span class="token token">npm</span><span></span><span class="token token">install</span><span>
   </span><span></span><span class="token token"># or for Python:</span><span>
   </span><span>pip </span><span class="token token">install</span><span> -r requirements.txt
   </span></code></span></div></div></div></pre>
3. Deploy smart contract using Foundry:
   <pre class="not-prose w-full rounded font-mono text-sm font-extralight"><div class="codeWrapper text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded font-mono text-sm font-normal bg-subtler"><div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end md:sticky md:top-[100px]"><div class="overflow-hidden rounded-full border-subtlest ring-subtlest divide-subtlest bg-base"><div class="border-subtlest ring-subtlest divide-subtlest bg-subtler"></div></div></div><div class="-mt-xl"><div><div data-testid="code-language-indicator" class="text-quiet bg-subtle py-xs px-sm inline-block rounded-br rounded-tl-[3px] font-thin">bash</div></div><div><span><code><span>forge </span><span class="token token">install</span><span>
   </span>forge build
   <span>forge deploy --rpc-url </span><span class="token token operator"><</span><span>arc-testnet-rpc</span><span class="token token operator">></span><span> --private-key </span><span class="token token operator"><</span><span>your-wallet-key</span><span class="token token operator">></span><span>
   </span></code></span></div></div></div></pre>
4. Configure and run AI agent:
   <pre class="not-prose w-full rounded font-mono text-sm font-extralight"><div class="codeWrapper text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded font-mono text-sm font-normal bg-subtler"><div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end md:sticky md:top-[100px]"><div class="overflow-hidden rounded-full border-subtlest ring-subtlest divide-subtlest bg-base"><div class="border-subtlest ring-subtlest divide-subtlest bg-subtler"></div></div></div><div class="-mt-xl"><div><div data-testid="code-language-indicator" class="text-quiet bg-subtle py-xs px-sm inline-block rounded-br rounded-tl-[3px] font-thin">bash</div></div><div><span><code><span class="token token">node</span><span> ai-agent/index.js
   </span><span></span><span class="token token"># or for Python agent:</span><span>
   </span>python ai-agent/agent.py
   </code></span></div></div></div></pre>
5. Start frontend development server:
   <pre class="not-prose w-full rounded font-mono text-sm font-extralight"><div class="codeWrapper text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded font-mono text-sm font-normal bg-subtler"><div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end md:sticky md:top-[100px]"><div class="overflow-hidden rounded-full border-subtlest ring-subtlest divide-subtlest bg-base"><div class="border-subtlest ring-subtlest divide-subtlest bg-subtler"></div></div></div><div class="-mt-xl"><div><div data-testid="code-language-indicator" class="text-quiet bg-subtle py-xs px-sm inline-block rounded-br rounded-tl-[3px] font-thin">bash</div></div><div><span><code><span class="token token">cd</span><span> frontend
   </span><span></span><span class="token token">npm</span><span> run dev
   </span></code></span></div></div></div></pre>

## Usage

* Use the web frontend to register subscriptions with content creators.
* AI agent automatically adjusts monthly pricing based on user engagement levels.
* Payments in USDC are executed autonomously on-chain.
* Monitor transactions using Arc blockchain explorer.

## Project Structure

<pre class="not-prose w-full rounded font-mono text-sm font-extralight"><div class="codeWrapper text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded font-mono text-sm font-normal bg-subtler"><div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end md:sticky md:top-[100px]"><div class="overflow-hidden rounded-full border-subtlest ring-subtlest divide-subtlest bg-base"><div class="border-subtlest ring-subtlest divide-subtlest bg-subtler"></div></div></div><div class="-mt-xl"><div><div data-testid="code-language-indicator" class="text-quiet bg-subtle py-xs px-sm inline-block rounded-br rounded-tl-[3px] font-thin">text</div></div><div><span><code><span><span>arcsusbscription/
</span></span><span>│
</span><span>├── contracts/                 # Solidity smart contracts
</span><span>│   └── Subscription.sol      # Main subscription payment contract
</span><span>│
</span><span>├── ai-agent/                 # Off-chain AI automation scripts
</span><span>│   ├── index.js              # Main entry point (JS)
</span><span>│   └── agent.py              # Alternative Python implementation
</span><span>│   └── utils/                # Helper functions (API calls, Arc wallet interaction)
</span><span>│
</span><span>├── frontend/                 # Web UI for subscription management
</span><span>│   ├── public/
</span><span>│   ├── src/
</span><span>│   │   ├── components/
</span><span>│   │   ├── pages/
</span><span>│   │   ├── App.js
</span><span>│   │   └── styles.css
</span><span>│   └── package.json
</span><span>│
</span><span>├── scripts/                  # Deployment and migration scripts
</span><span>│   └── deploy.js
</span><span>│
</span><span>├── tests/                    # Smart contract and backend tests
</span><span>│   └── subscription.test.js
</span><span>│
</span><span>├── README.md                 # Project overview and setup instructions
</span><span>├── foundry.toml              # Foundry config file for Solidity builds
</span><span>└── package.json              # For AI agent or frontend dependencies
</span><span></span></code></span></div></div></div></pre>

## Future Enhancements

* Advanced AI integration for personalized subscription pricing models
* Integration with social media APIs for real-time engagement signals
* Support for multiple subscription tiers and payment intervals
* Mobile app for subscription management and notifications

## License

MIT License © 2025 Your Name
