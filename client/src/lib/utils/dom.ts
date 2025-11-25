export function isAptosLink(href: string): boolean {
  return href.startsWith("https://aptos");
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

