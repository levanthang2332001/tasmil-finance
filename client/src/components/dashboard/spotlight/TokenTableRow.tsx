import { cn } from "@/lib/utils";
import { TokenData } from "@/types/spotlight";
import { getChangeColor, formatChange } from "./helpers";

export interface TokenTableRowProps {
  token: TokenData;
  sortField: string;
}

const StartIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

export function TokenTableRow({ token }: TokenTableRowProps) {
  return (
    <tr className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
      <td className="py-3 px-2">
        <div className="flex items-center gap-1">
          <span className="text-gray-400">{token.rank}</span>
          <button className="text-gray-500 hover:text-yellow-500 transition-colors">
            <StartIcon />
          </button>
        </div>
      </td>
      <td className="py-3 px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            <span className="text-xs font-bold">{token.symbol.slice(0, 2)}</span>
          </div>
          <span className="font-medium">{token.symbol}</span>
        </div>
      </td>
      <td className="py-3 px-2 text-right font-mono">{token.price}</td>
      <td className="py-3 px-2 text-right text-gray-400">{token.age}</td>
      <td className={cn("py-3 px-2 text-right font-mono", getChangeColor(token.change1h))}>
        {formatChange(token.change1h)}
      </td>
      <td className={cn("py-3 px-2 text-right font-mono", getChangeColor(token.change6h))}>
        {formatChange(token.change6h)}
      </td>
      <td className={cn("py-3 px-2 text-right font-mono", getChangeColor(token.change24h))}>
        {formatChange(token.change24h)}
      </td>
      <td className="py-3 px-2 text-right font-mono">{token.volume24h}</td>
      <td className="py-3 px-2 text-right">{token.txns24h}</td>
      <td className="py-3 px-2 text-right">
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono">{token.marketCap}</span>
          <div className="w-16 h-4 relative">
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gray-800 rounded" />
            <div
              className="absolute bottom-0 left-0 bg-orange-500 h-1 rounded"
              style={{ width: "60%" }}
            />
          </div>
        </div>
      </td>
      <td className="py-3 px-2 text-right">
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono">{token.liquidity}</span>
          <div className="w-16 h-4 relative">
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gray-800 rounded" />
            <div
              className="absolute bottom-0 left-0 bg-orange-500 h-1 rounded"
              style={{ width: "40%" }}
            />
          </div>
        </div>
      </td>
      <td className="py-3 px-2 text-right">{token.makers24h}</td>
    </tr>
  );
}
