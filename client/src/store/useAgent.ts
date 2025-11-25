import { create } from "zustand";

export const AGENT_TYPES = {
  THALA: "Thala",
  LIQUID_SWAP: "LiquidSwap",
  SHELBY: "Shelby",
} as const;

export type AgentType = (typeof AGENT_TYPES)[keyof typeof AGENT_TYPES];

interface AgentState {
  selectedAgent: AgentType;
  setSelectedAgent: (agent: AgentType) => void;
}

export const useAgent = create<AgentState>((set) => ({
  selectedAgent: AGENT_TYPES.LIQUID_SWAP,
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
}));
