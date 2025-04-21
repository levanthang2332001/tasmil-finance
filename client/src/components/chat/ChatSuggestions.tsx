import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Suggestion {
  text: string;
  icon: LucideIcon;
}

interface ChatSuggestionsProps {
  onSendMessage: (message: string) => void;
  className?: string;
  suggestions: Suggestion[];
}

export const ChatSuggestions = ({
  onSendMessage,
  className,
  suggestions,
}: ChatSuggestionsProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-6",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-crypto-blue" />
        <h3 className="text-xl font-semibold bg-gradient-to-r from-crypto-blue to-crypto-blue bg-clip-text text-transparent">
          Start a conversation
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3 w-full">
        {suggestions?.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <button
              key={`${suggestion.text}-${index}`}
              onClick={() => onSendMessage(suggestion.text)}
              className={cn(
                "relative !bg-neutral-900/20 border-neutral-800 w-full cursor-pointer text-left text-sm  text-white rounded-lg p-6",
                "border border-card transition-all duration-300",
                "hover:bg-gradient-to-r hover:from-crypto-blue/20",
                "shadow-[0_0_5px_#1EAEDB80]"
              )}
            >
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-crypto-blue/10">
                  <Icon className="w-5 h-5 text-crypto-blue" />
                </div>
                <span className="relative z-10">{suggestion.text}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
