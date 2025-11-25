// Validation utilities

export function isValidAddress(address: string): boolean {
  return Boolean(address && address.length > 0);
}

export function isValidNonce(nonce: string): boolean {
  return Boolean(nonce && nonce.length > 0);
}

export function isAptosLink(href: string): boolean {
  return href.startsWith("https://aptos");
}
