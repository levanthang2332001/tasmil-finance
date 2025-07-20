import { ChatMessage, ACTION_TYPE } from "@/types/chat";
import { BotChat } from "./BotChat";
import BotError from "./BotError";
import { UserChat } from "./UserChat";
import BotPreSwap from "./BotPreSwap";
import BotBridge from "./BotBridge";
import { BotHelp } from "./BotHelp";

interface MessageTypeProps {
  message: ChatMessage;
  isLoading?: boolean;
  isLatestMessage?: boolean;
}

export function MessageType({
  message,
  isLoading,
  isLatestMessage,
}: MessageTypeProps) {
  console.log("MessageType actionType:", message.actionType);

  const messageComponents = {
    [ACTION_TYPE.USER]: <UserChat message={message} isLoading={isLoading} />,
    [ACTION_TYPE.PRE_SWAP]: (
      <BotPreSwap
        message={message}
        isLoading={isLoading}
        isLatestMessage={isLatestMessage}
      />
    ),
    [ACTION_TYPE.BRIDGE]: (
      <BotBridge
        message={message}
        isLoading={isLoading}
        isLatestMessage={isLatestMessage}
      />
    ),
    [ACTION_TYPE.SWAP]: <BotChat message={message} isLoading={isLoading} />,
    [ACTION_TYPE.LIQUIDITY]: (
      <BotChat message={message} isLoading={isLoading} />
    ),
    [ACTION_TYPE.STAKING]: <BotChat message={message} isLoading={isLoading} />,
    [ACTION_TYPE.UNSTAKING]: (
      <BotChat message={message} isLoading={isLoading} />
    ),
    [ACTION_TYPE.BORROW]: <BotChat message={message} isLoading={isLoading} />,
    [ACTION_TYPE.SUPPLY]: <BotChat message={message} isLoading={isLoading} />,
    [ACTION_TYPE.REPAY]: <BotChat message={message} isLoading={isLoading} />,
    [ACTION_TYPE.WITHDRAW]: <BotChat message={message} isLoading={isLoading} />,
    [ACTION_TYPE.CLAIM_REWARD]: (
      <BotChat message={message} isLoading={isLoading} />
    ),
    [ACTION_TYPE.PLACE_LIMIT_ORDER]: (
      <BotChat message={message} isLoading={isLoading} />
    ),
    [ACTION_TYPE.PLACE_MARKET_ORDER]: (
      <BotChat message={message} isLoading={isLoading} />
    ),
    [ACTION_TYPE.REMOVE_LIQUIDITY]: (
      <BotChat message={message} isLoading={isLoading} />
    ),
    [ACTION_TYPE.HELP]: <BotHelp message={message} isLoading={isLoading} />,
    [ACTION_TYPE.UNKNOWN]: <BotError message={message} isLoading={isLoading} />,
  };

  return messageComponents[
    message.actionType as keyof typeof messageComponents
  ];
}
