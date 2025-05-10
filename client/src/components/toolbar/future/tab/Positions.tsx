import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Position {
  id: string;
  type: "long" | "short";
  leverage: number;
  symbol: string;
  currentPrice: number;
  liquidationPrice: number;
  margin: number;
  fundingFee: number;
  pnl: number;
  pnlPercentage: number;
  size: number;
}

const MOCK_POSITIONS: Position[] = [
  {
    id: "1",
    type: "long",
    leverage: 5,
    symbol: "ETH",
    currentPrice: 2100,
    liquidationPrice: 1900,
    size: 1.5,
    margin: 300,
    fundingFee: 0.0001,
    pnl: 300,
    pnlPercentage: 100,
  },
  {
    id: "2",
    type: "short",
    leverage: 3,
    symbol: "BTC",
    currentPrice: 39000,
    liquidationPrice: 42000,
    size: 0.5,
    margin: 500,
    fundingFee: 0.0002,
    pnl: -150,
    pnlPercentage: -30,
  },
  {
    id: "3",
    type: "long",
    leverage: 10,
    symbol: "SOL",
    currentPrice: 100,
    liquidationPrice: 90,
    size: 10,
    margin: 100,
    fundingFee: 0.0003,
    pnl: 100,
    pnlPercentage: 100,
  },
  {
    id: "3",
    type: "long",
    leverage: 10,
    symbol: "SOL",
    currentPrice: 100,
    liquidationPrice: 90,
    size: 10,
    margin: 100,
    fundingFee: 0.0003,
    pnl: 100,
    pnlPercentage: 100,
  },
];

const PositionItem = ({ position }: { position: Position }) => {
  const isLong = position.type === "long";

  const handleClosePosition = () => {
    // TODO: Implement position closing logic
    console.log(`Closing position ${position.id}`);
  };

  return (
    <div className="mb-4 py-4 px-3 text-xs rounded-lg hover:shadow-md transition-shadow border-b border-border">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Badge variant={isLong ? "success" : "destructive"} className="px-2 py-1">
              {position.type.toUpperCase()} {position.leverage}x
            </Badge>
            <span className="font-semibold text-xs">{position.symbol}</span>
            <span className="text-muted-foreground text-xs">|</span>
            <span className="text-muted-foreground text-sm">
              {position.currentPrice.toLocaleString()}
            </span>
          </div>
          <Button variant="outline" className="px-2 py-1 text-xs" onClick={handleClosePosition}>
            Close
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-muted-foreground text-xs">Size: </span>
          <span className="font-medium text-sm"> ${position.size.toLocaleString()} </span>
          <span className="text-muted-foreground text-xs">
            ( {position.margin.toLocaleString()} {position.symbol})
          </span>
        </div>

        <p className={`font-bold text-sm ${position.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
          ${position.pnl.toLocaleString()}{" "}
          <span className="text-xs">({position.pnlPercentage.toFixed(2)}%)</span>
        </p>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground text-xs">Funding Fee: </span>
          <span className="font-medium text-sm"> ${position.fundingFee.toFixed(4)} </span>
        </div>

        <div>
          <span className="text-muted-foreground text-xs">Liq Price: </span>
          <span className="font-medium text-sm">${position.liquidationPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

const Positions = () => {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-4">
        {MOCK_POSITIONS.map((position) => (
          <PositionItem key={position.id} position={position} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default Positions;
