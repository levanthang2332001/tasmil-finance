import React from "react";
import { TokenData } from "./constant";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

export type SortField =
  | "rank"
  | "name"
  | "price"
  | "age"
  | "change1h"
  | "change6h"
  | "change24h"
  | "volume24h"
  | "txns24h"
  | "marketCap"
  | "liquidity"
  | "makers24h";

export type SortDirection = "asc" | "desc";

// Extract numeric value from string
export function extractNumericValue(value: string): number {
  const match = value.match(/[\d,]+\.?\d*/);
  return match ? parseFloat(match[0].replace(/,/g, "")) : 0;
}

// Get sortable value for a token
export function getSortableValue(token: TokenData, field: SortField): number | string {
  const fieldMappers: Record<SortField, (token: TokenData) => number | string> = {
    rank: (token) => token.rank,
    name: (token) => token.symbol.toLowerCase(),
    price: (token) => extractNumericValue(token.price as string),
    age: (token) => extractNumericValue(token.age),
    change1h: (token) => token.change1h,
    change6h: (token) => token.change6h,
    change24h: (token) => token.change24h,
    volume24h: (token) => extractNumericValue(token.volume24h),
    txns24h: (token) => token.txns24h,
    marketCap: (token) => extractNumericValue(token.marketCap),
    liquidity: (token) => extractNumericValue(token.liquidity),
    makers24h: (token) => token.makers24h,
  };

  return fieldMappers[field]?.(token) ?? 0;
}

// Get color for change value
export function getChangeColor(change: number): string {
  if (change > 0) return "text-green-500";
  if (change < 0) return "text-red-500";
  return "text-gray-500";
}

// Format change value
export function formatChange(change: number): string {
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}

// Get sort icon for table headers
export function getSortIcon(
  field: SortField,
  sortField: SortField,
  sortDirection: SortDirection
): React.ReactNode {
  if (sortField !== field) {
    return;
  }
  if (sortDirection === "asc") {
    return <ArrowUpIcon className="w-4 h-4" />;
  }
  return <ArrowDownIcon className="w-4 h-4" />;
}
