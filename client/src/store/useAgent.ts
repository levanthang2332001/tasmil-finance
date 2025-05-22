import { create } from "zustand";

export enum AgentType {
  NAVI = "navi",
  CETUS = "cetus",
  SUILEND = "suiLend",
}

interface AgentState {
  selectedAgent: AgentType 
  setSelectedAgent: (agent: AgentType) => void;
}

export const useAgent = create<AgentState>((set) => ({
  selectedAgent: AgentType.CETUS,
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
}));
