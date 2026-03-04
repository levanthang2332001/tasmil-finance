import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useTokenHistory } from "@/features/dashboard/hooks/useTokenHistory";

interface TokenCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export function TokenCard({ symbol, name, price, change, isSelected, onClick }: TokenCardProps) {
  const isPositive = change >= 0;
  const { data: historicalData, isLoading } = useTokenHistory(symbol, price, "1M");

  return (
    <Card
      className={`relative bg-gray-950 overflow-hidden border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer group ${
        isSelected ? "ring-2 ring-primary/30 border-primary/30" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="space-y-1">
            <h3 className="text-white font-semibold text-lg">{name}</h3>
            <p className="text-slate-400 text-sm font-medium">{symbol}</p>
          </div>
          <div
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
              isPositive
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {isPositive ? "↗" : "↘"} {Math.abs(change).toFixed(2)}%
          </div>
        </div>

        <div className="mb-4">
          <div className="text-3xl font-bold text-white mb-1">${formatNumber(price)}</div>
          <div
            className={`text-sm font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}
          >
            {isPositive ? "+" : "-"}${formatNumber(Math.abs((change * price) / 100))}
          </div>
        </div>

        <div className="h-16 -mx-2">
          {isLoading ? (
            <div className="h-full bg-slate-700/30 animate-pulse rounded-lg" />
          ) : historicalData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? "#10b981" : "#ef4444"}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              No chart data
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Card>
  );
}
