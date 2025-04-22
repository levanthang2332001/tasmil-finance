import { AgentType } from "@/types/chat";
import { Bot, Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

// Implement a simpler dropdown since we don't have the dropdown-menu component
interface AgentOption {
  type: AgentType;
  label: string;
  description: string;
  icon: JSX.Element;
}

const agentOptions: AgentOption[] = [
  {
    type: AgentType.DEFAULT,
    label: "DeFi Assistant",
    description: "General DeFi assistant for swaps and market info",
    icon: <Bot className="h-5 w-5" />,
  },
  {
    type: AgentType.NAVI,
    label: "Navi Agent",
    description: "Specialized agent for Navi protocol interactions",
    icon: <Bot className="h-5 w-5 text-indigo-400" />,
  },
];

interface AgentSelectorProps {
  selectedAgent: AgentType;
  onSelectAgent: (agent: AgentType) => void;
}

export const AgentSelector = ({
  selectedAgent,
  onSelectAgent,
}: AgentSelectorProps) => {
  const [open, setOpen] = useState(false);

  const selectedOption =
    agentOptions.find((option) => option.type === selectedAgent) ||
    agentOptions[0];

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="flex items-center gap-2 bg-background/10 backdrop-blur-sm border-background/20"
        onClick={() => setOpen(!open)}
      >
        {selectedOption.icon}
        <span>{selectedOption.label}</span>
        <ChevronDown className="h-4 w-4 ml-2" />
      </Button>

      {open && (
        <div className="absolute z-50 mt-2 w-[220px] rounded-md bg-background border border-border shadow-lg">
          {agentOptions.map((option) => (
            <div
              key={option.type}
              className="flex items-start gap-2 p-3 cursor-pointer hover:bg-accent"
              onClick={() => {
                onSelectAgent(option.type);
                setOpen(false);
              }}
            >
              <div className="flex-shrink-0 mt-0.5">{option.icon}</div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{option.label}</span>
                  {option.type === selectedAgent && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
