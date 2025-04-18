import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Order {
  id: string;
  type: "limit" | "market";
  side: "buy" | "sell";
  symbol: string;
  size: number;
  price: number;
  status: "open" | "filled" | "cancelled";
  time: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    type: "limit",
    side: "buy",
    symbol: "ETH",
    size: 1.5,
    price: 2000,
    status: "open",
    time: "10:30:45",
  },
  {
    id: "2",
    type: "market",
    side: "sell",
    symbol: "BTC",
    size: 0.5,
    price: 40000,
    status: "filled",
    time: "10:31:20",
  },
  {
    id: "3",
    type: "limit",
    side: "buy",
    symbol: "SOL",
    size: 10,
    price: 100,
    status: "cancelled",
    time: "10:32:15",
  },
];

const OrderItem = ({ order }: { order: Order }) => {
  const isBuy = order.side === "buy";
  const statusColor = {
    open: "text-yellow-500",
    filled: "text-green-500",
    cancelled: "text-red-500",
  }[order.status];

  const handleCancelOrder = () => {
    // TODO: Implement order cancellation logic
    console.log(`Cancelling order ${order.id}`);
  };

  return (
    <div className="mb-4 py-4 px-3 text-sm rounded-lg hover:shadow-md transition-shadow border-b border-border">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Badge variant={isBuy ? "success" : "destructive"} className="px-2 py-1">
              {order.side.toUpperCase()}
            </Badge>
            <span className="font-semibold text-sm">{order.symbol}</span>
            <span className="text-muted-foreground text-sm">|</span>
            <span className="text-muted-foreground text-base">
              {order.price.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">Size: </span>
            <span className="font-medium text-base">{order.size}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-muted-foreground text-sm">Type: </span>
          <span className="font-medium text-base">{order.type}</span>
        </div>

        <p className={`font-bold text-base ${statusColor}`}>{order.status}</p>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground text-sm">Time: </span>
          <span className="font-medium text-base">{order.time}</span>
        </div>

        {order.status === "open" && (
          <Button variant="outline" className="px-2 py-1" onClick={handleCancelOrder}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

const Orders = () => {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-4">
        {MOCK_ORDERS.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default Orders;