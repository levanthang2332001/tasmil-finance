import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { motion } from "framer-motion";

interface UserChatProps {
  message: Message;
  isLoading?: boolean;
}

export const UserChat = ({ message, isLoading }: UserChatProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-end mb-4 animate-in"
    >
      <div className="flex flex-col items-end gap-2">
        <motion.div
          layout
          className={cn(
            "rounded-2xl rounded-br-sm bg-secondary/80 text-secondary-foreground p-4",
            "shadow-sm transition-colors",
            isLoading && "opacity-50"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.message}
          </p>
        </motion.div>
        <span className="text-xs text-muted-foreground mt-1 block text-right">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </motion.div>
  );
};
