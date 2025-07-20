import { create } from "zustand";

export enum AgentType {
  Thala = "Thala",
  LiquidSwap = "LiquidSwap",
  Shelby = "Shelby",
}

interface AgentState {
  selectedAgent: AgentType 
  setSelectedAgent: (agent: AgentType) => void;
}

export const useAgent = create<AgentState>((set) => ({
  selectedAgent: AgentType.LiquidSwap,
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
}));
