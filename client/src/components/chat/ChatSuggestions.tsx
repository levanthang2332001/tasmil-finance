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
    <div className={cn("flex flex-col items-center justify-center gap-6 p-8", className)}>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          What strategy are you looking for?
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {suggestions?.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <button
              key={`${suggestion.text}-${index}`}
              onClick={() => onSendMessage(suggestion.text)}
              className={cn(
                "group relative w-full cursor-pointer text-left p-6 rounded-xl",
                "bg-gradient-to-br from-neutral-900/40 to-neutral-800/30",
                "border border-neutral-700/50 backdrop-blur-sm",
                "transition-all duration-300 ease-out",
                "hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20",
                "hover:border-primary/30 hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5",
                "active:scale-[0.98] active:duration-150",
                "shadow-[0_4px_20px_rgba(30,174,219,0.15)]"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-white/90 font-medium group-hover:text-white transition-colors duration-300">
                  {suggestion.text}
                </span>
              </div>

              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
