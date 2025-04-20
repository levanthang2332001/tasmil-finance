export interface Trader {
  id: string;
  address: string;
  pnl30d: number;
  winRate: number;
  avatar?: string;
  isWhale?: boolean;
}

export const topTraders: Trader[] = [
  {
    id: "1",
    address: "0xabcd1234abcd1234abcd1234abcd1234abcd1234",
    pnl30d: 2140502,
    winRate: 67,
  },
  {
    id: "2",
    address: "0xdef45678def45678def45678def45678def45678",
    pnl30d: 1872345,
    winRate: 72,
  },
  {
    id: "3",
    address: "0xabc87654abc87654abc87654abc87654abc87654",
    pnl30d: 1456789,
    winRate: 58,
  },
  {
    id: "4",
    address: "0xdef98765def98765def98765def98765def98765",
    pnl30d: 2540123,
    winRate: 81,
  },
  {
    id: "5",
    address: "0x123abcde123abcde123abcde123abcde123abcde",
    pnl30d: 1925631,
    winRate: 64,
  },
  {
    id: "6",
    address: "0x456defgh456defgh456defgh456defgh456defgh",
    pnl30d: 3102458,
    winRate: 75,
  },
];

export const topWhales: Trader[] = [
  {
    id: "1",
    address: "0xffff1234ffff1234ffff1234ffff1234ffff1234",
    pnl30d: 15240502,
    winRate: 82,
    isWhale: true,
  },
  {
    id: "2",
    address: "0xeeee5678eeee5678eeee5678eeee5678eeee5678",
    pnl30d: 9872345,
    winRate: 77,
    isWhale: true,
  },
  {
    id: "3",
    address: "0xdddd7654dddd7654dddd7654dddd7654dddd7654",
    pnl30d: 7456789,
    winRate: 69,
    isWhale: true,
  },
];

export interface Module {
  id: string;
  title: string;
  type: "token" | "money" | "trader";
  data?: any;
}

export const modules: Module[] = [
  {
    id: "token-flow",
    title: "Token Flow",
    type: "token",
  },
  {
    id: "smart-money-flow",
    title: "Smart Money Flow",
    type: "money",
  },
  {
    id: "smart-trader",
    title: "Smart Trader",
    type: "trader",
  },
  {
    id: "smart-trader-2",
    title: "Smart Trader Insights",
    type: "trader",
  },
];

export interface WalletInfo {
  address: string;
  balance: number;
  tier: "Basic" | "Pro" | "Elite";
}

export const userWallet: WalletInfo = {
  address: "0xabcd1234ef5678abcd1234ef5678abcd1234ef56",
  balance: 3.45,
  tier: "Basic",
};
