import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Trade {
  id: string;
  type: "buy" | "sell";
  symbol: string;
  size: number;
  price: number;
  fee: number;
  time: string;
  pnl?: number;
  pnlPercentage?: number;
}

const MOCK_TRADES: Trade[] = [
  {
    id: "1",
    type: "buy",
    symbol: "ETH",
    size: 1.5,
    price: 2000,
    fee: 0.1,
    time: "10:30:45",
    pnl: 300,
    pnlPercentage: 10,
  },
  {
    id: "2",
    type: "sell",
    symbol: "BTC",
    size: 0.5,
    price: 40000,
    fee: 0.2,
    time: "10:31:20",
    pnl: -150,
    pnlPercentage: -5,
  },
  {
    id: "3",
    type: "buy",
    symbol: "SOL",
    size: 10,
    price: 100,
    fee: 0.15,
    time: "10:32:15",
    pnl: 200,
    pnlPercentage: 20,
  },
];

const TradeItem = ({ trade }: { trade: Trade }) => {
  const isBuy = trade.type === "buy";
  const hasProfit = trade.pnl && trade.pnl > 0;

  return (
    <div className="mb-4 py-4 px-3 text-sm rounded-lg hover:shadow-md transition-shadow border-b border-border">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Badge
              variant={isBuy ? "success" : "destructive"}
              className="px-2 py-1"
            >
              {trade.type.toUpperCase()}
            </Badge>
            <span className="font-semibold text-sm">{trade.symbol}</span>
            <span className="text-muted-foreground text-sm">|</span>
            <span className="text-muted-foreground text-base">
              ${trade.price.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">Size: </span>
            <span className="font-medium text-base">{trade.size}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-muted-foreground text-sm">Fee: </span>
          <span className="font-medium text-base">${trade.fee.toFixed(4)}</span>
        </div>

        {trade.pnl !== undefined && (
          <p
            className={`font-bold text-base ${
              hasProfit ? "text-crypto-positive" : "text-crypto-negative"
            }`}
          >
            ${trade.pnl.toLocaleString()}{" "}
            <span className="text-sm">
              ({trade.pnlPercentage?.toFixed(2)}%)
            </span>
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground text-sm">Time: </span>
          <span className="font-medium text-base">{trade.time}</span>
        </div>
      </div>
    </div>
  );
};

const History = () => {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-4">
        {MOCK_TRADES.map((trade) => (
          <TradeItem key={trade.id} trade={trade} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default History;
