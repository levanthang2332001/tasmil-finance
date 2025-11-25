export interface WalletAccount {
  address: string;
  publicKey: string;
}

export interface UserResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    tasmilAddress: string;
  };
}

export interface ConnectButtonProps {
  label?: string;
  className?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
}

declare global {
  interface Window {
    aptos?: any;
    okxwallet?: {
      aptos?: {
        account: () => Promise<{ address?: string; publicKey?: string }>;
        getAccount?: () => Promise<{ address?: string; publicKey?: string }>;
      };
    };
    pontem?: {
      account: () => Promise<string | { address?: string; publicKey?: string }>;
      publicKey: () => Promise<string>;
    };
  }
}
