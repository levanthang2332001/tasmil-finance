import React from "react";
import { Button } from "../../ui/button";
import { FaChevronDown, FaGasPump } from "react-icons/fa";
import { FaEthereum } from "react-icons/fa";
import { SiTether } from "react-icons/si";

interface TokenInfo {
  symbol: string;
  name: string;
  icon: React.ReactNode;
}

const TOKENS: Record<string, TokenInfo> = {
  ETH: { symbol: "ETH", name: "Ethereum", icon: <FaEthereum className="text-indigo-500" /> },
  USDT: { symbol: "USDT", name: "Tether", icon: <SiTether className="text-green-500" /> },
};

function TokenSelector({ token }: { token: TokenInfo }) {
  return (
    <button className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition">
      {token.icon}
      <span className="font-medium text-gray-800">{token.symbol}</span>
    </button>
  );
}

function AmountPanel({
  label,
  amount,
  fiat,
  token,
}: {
  label: string;
  amount: string;
  fiat: string;
  token: TokenInfo;
}) {
  return (
    <div className="flex flex-col gap-1 p-4 bg-white rounded-2xl shadow border border-gray-100">
      <span className="text-sm text-gray-500 mb-1">{label}</span>
      <div className="flex items-center justify-between">
        <span className="text-3xl font-semibold text-gray-900">{amount}</span>
        <TokenSelector token={token} />
      </div>
      <span className="text-xs text-gray-400 mt-1">{fiat}</span>
    </div>
  );
}

const BotSwap = () => {
  // Placeholder data
  const sellAmount = "1";
  const sellFiat = "$2,456.56";
  const buyAmount = "2440.93";
  const buyFiat = "$2,441.49";
  const rate = "1 USDT = 0.00040968 ETH ($1.00)";

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-lg p-2 flex flex-col gap-2">
      <div className="relative space-y-1">
        <AmountPanel label="Sell" amount={sellAmount} fiat={sellFiat} token={TOKENS.ETH} />
        <div className="flex justify-center absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transform z-[1]">
          <div className="bg-white border border-gray-200 rounded-full p-2 shadow flex items-center justify-center">
            <FaChevronDown className="text-gray-400 text-lg" />
          </div>
        </div>
        <AmountPanel label="Buy" amount={buyAmount} fiat={buyFiat} token={TOKENS.USDT} />
      </div>
      <div className="mt-2">
        <Button
          className="w-full bg-primary/20 text-primary font-semibold py-3 rounded-2xl hover:bg-primary/30 transition"
          disabled
        >
          Confirm Swap
        </Button>
      </div>
      <div className="text-xs text-gray-500 text-center mt-2 flex items-center justify-between gap-2 px-2">
        <span>
          {rate.split("=")[0]} = <span className="font-semibold">{rate.split("=")[1]}</span>
        </span>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <FaGasPump className="text-gray-500" />
          <span className="font-semibold">$0.01</span>
        </span>
      </div>
    </div>
  );
};

export default BotSwap;
