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

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatError = (
  error: unknown = "Sorry, there was an error processing your message. Please try again."
) => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

export const isAptosLink = (href: string) => {
  return href.startsWith("https://aptos");
};
