import { ChatMessage, ACTION_TYPE } from "@/types/chat";
import { BotChat } from "./BotChat";
import BotError from "./BotError";
import { UserChat } from "./UserChat";
interface MessageTypeProps {
  message: ChatMessage;
  isLoading?: boolean;
}

export function MessageType({ message, isLoading }: MessageTypeProps) {
  const messageComponents = {
    [ACTION_TYPE.USER]: <UserChat message={message} isLoading={isLoading} />,
    [ACTION_TYPE.SWAP]: <BotChat message={message} isLoading={isLoading} />,
    [ACTION_TYPE.LIQUIDITY]: <BotChat message={message} isLoading={isLoading} />,
    [ACTION_TYPE.STAKING]: <BotChat message={message} isLoading={isLoading} />,
    [ACTION_TYPE.BORROW]: <BotChat message={message} isLoading={isLoading} />,
    [ACTION_TYPE.SUPPLY]: <BotChat message={message} isLoading={isLoading} />,
    [ACTION_TYPE.REPAY]: <BotChat message={message} isLoading={isLoading} />,
    [ACTION_TYPE.WITHDRAW]: <BotChat message={message} isLoading={isLoading} />,
    [ACTION_TYPE.CLAIM_REWARD]: <BotChat message={message} isLoading={isLoading} />,
    [ACTION_TYPE.PLACE_LIMIT_ORDER]: <BotChat message={message} isLoading={isLoading} />,
    [ACTION_TYPE.PLACE_MARKET_ORDER]: <BotChat message={message} isLoading={isLoading} />,
    [ACTION_TYPE.REMOVE_LIQUIDITY]: <BotChat message={message} isLoading={isLoading} />,
    [ACTION_TYPE.UNKNOWN]: <BotError />,
  };

  return messageComponents[message.actionType as keyof typeof messageComponents];
}
