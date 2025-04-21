"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const ChatInput = ({
  onSendMessage,
  isLoading,
  className,
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className={cn("pt-2 px-2", className)}>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 items-end max-w-4xl mx-auto"
      >
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask Tasmil AI anything..."
            className="min-h-[52px] max-h-32 pe-12 !bg-neutral-900/20 border-neutral-800 shadow-[0_0_5px_#1EAEDB80] resize-none text-white placeholder:text-white/50 border-none focus-visible:ring-background focus-visible:ring-1 outline-background "
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute z-10 right-2 bottom-2 h-8 w-8 text-muted-foreground hover:text-crypto-blue cursor-pointer"
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? (
              <div className="h-8 w-8 flex items-center justify-center bg-white rounded-full">
                <div className="h-3 w-3 animate-pulse bg-black" />
              </div>
            ) : (
              <SendHorizontal className="h-5 w-5 transform -rotate-45" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
