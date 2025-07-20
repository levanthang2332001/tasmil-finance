export const SUGGESTION_DEFI_AGENT = [
  {
    text: "How to stake?",
    linkImage: "/images/suggestion/stake.png",
  },
  {
    text: "How to unstake?",
    linkImage: "/images/suggestion/stake.png",
  },
  {
    text: "How to swap?",
    linkImage: "/images/suggestion/swap.png",
  },
  {
    text: "How to bridge tokens to other chains?",
    linkImage: "/images/suggestion/swap.png",
  },
];

// Suggestions hướng dẫn giáo dục
export const SUGGESTION_HELP_PROMPTS = [
  {
    text: "What information do I need for bridging?",
    linkImage: "/images/suggestion/swap.png",
  },
  {
    text: "What is staking and how does it work?",
    linkImage: "/images/suggestion/stake.png",
  },
  {
    text: "Show me examples of DeFi commands",
    linkImage: "/images/suggestion/swap.png",
  },
];

// Examples cụ thể từ server actions
export const SUGGESTION_EXAMPLES = {
  bridge: [
    "Bridge 1 USDC from Aptos to BSC for address 0x...",
    "Bridge 1 USDC from Aptos to Polygon for address 0x...",
    "Bridge 1 USDC from Aptos to Base for address 0x...",
  ],
  swap: ["Swap 1 APT for ALT"],
  stake: ["Stake 0.0001 APT"],
  unstake: ["Unstake 0.0001 APT"],
};

// Template prompts để hướng dẫn user
export const SUGGESTION_TEMPLATES = [
  {
    text: "💡 Tip: For bridging, you need to specify destination address",
    linkImage: "/images/suggestion/swap.png",
  },
  {
    text: "📚 Learn: Type 'show me bridge examples' for help",
    linkImage: "/images/suggestion/swap.png",
  },
  {
    text: "🔗 Bridge format: 'Bridge [amount] [token] from Aptos to [chain] for address [your_address]'",
    linkImage: "/images/suggestion/swap.png",
  },
  {
    text: "💰 Staking format: 'Stake [amount] [token]'",
    linkImage: "/images/suggestion/stake.png",
  },
];
