export enum MessageType {
  USER = "user",
  BOT = "bot",
  SWAP_QUOTE = "swap_quote",
}

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  quote?: SwapQuote;
}

export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
}

export interface SwapQuote {
  amountIn: string;
  amountInUsd: string;
  amountOut: string;
  amountOutUsd: string;
  gasUsd: string;
  sourceToken: Token;
  destinationToken: Token;
}

export interface ChatProps {
  message: Message;
  isLoading?: boolean;
}

export interface SwapBoxProps extends ChatProps {
  onConfirm: (messageId: string) => Promise<void>;
  onCancel: (messageId: string) => void;
}
