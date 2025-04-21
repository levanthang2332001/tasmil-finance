import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount));
}

export function formatAmount(amount: number | string) {
  const num = Number(amount);
  if (num < 0.01) {
    return num.toString(); // Show full precision for small numbers
  }
  return num.toFixed(2);
}

export function truncateAddress(address: string, length = 4): string {
  if (!address) return "";
  if (address.length <= length * 2) return address;
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

export function formatPercentage(value: number): string {
  return `${value}%`;
}
