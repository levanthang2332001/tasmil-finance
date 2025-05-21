import { CETUS_ACTION_TYPE, Message, MESSAGE_TYPE, NAVI_ACTION_TYPE } from "@/types/chat";
import { BotBorrowMessage } from "./BotBorrowMessage";
import { BotChat } from "./BotChat";
import { BotRepayMessage } from "./BotRepayMessage";
import { BotSwapMessage } from "./BotSwapMessage";
import { BotWithdrawMessage } from "./BotWithdrawMessage";
import { UserChat } from "./UserChat";
import BotError from "./BotError";
import BotSupplyMessage from "./BotSupplyMessage";
interface MessageTypeProps {
  message: Message;
  isLoading?: boolean;
  onSwapConfirm?: (messageId: string) => Promise<void>;
  onSwapCancel?: (messageId: string) => void;
}

export function MessageType({ message, isLoading, onSwapConfirm, onSwapCancel }: MessageTypeProps) {
  switch (message.actionType) {
    case MESSAGE_TYPE.USER:
      return <UserChat message={message} isLoading={isLoading} />;
    case MESSAGE_TYPE.BOT:
      return <BotChat message={message} isLoading={isLoading} />;
    case CETUS_ACTION_TYPE.SWAP:
      if (!onSwapConfirm || !onSwapCancel) return null;
      return (
        <BotSwapMessage
          key={message.id}
          message={message}
          onConfirm={() => onSwapConfirm(message.id)}
          onCancel={() => onSwapCancel(message.id)}
          isLoading={isLoading}
        />
      );
    case NAVI_ACTION_TYPE.SUPPLY:
      return <BotSupplyMessage message={message} isLoading={isLoading} />;
    case NAVI_ACTION_TYPE.BORROW:
      return <BotBorrowMessage message={message} isLoading={isLoading} />;
    case NAVI_ACTION_TYPE.REPAY:
      return <BotRepayMessage message={message} isLoading={isLoading} />;
    case NAVI_ACTION_TYPE.WITHDRAW:
      return <BotWithdrawMessage message={message} isLoading={isLoading} />;
    default:
      return <BotError />;
  }
}
