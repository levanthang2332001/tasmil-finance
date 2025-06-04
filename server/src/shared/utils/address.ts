interface Token {
  address: string;
  symbol: string;
}

export const Tokens: Token[] = [
  {
    address: "0x2::sui::SUI",
    symbol: "SUI"
  },
  {
    address: "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
    symbol: "USDC"
  },
  {
    address: "0x8993129d72e733985f7f1a00396cbd055bad6f817fee36576ce483c8bbb8b87b::sudeng::SUDENG",
    symbol: "HIPPO"
  },
  {
    address: "0xd0e89b2af5e4910726fbcd8b8dd37bb79b29e5f83f7491bca830e94f7f226d29::eth::ETH",
    symbol: "ETH"
  }
]