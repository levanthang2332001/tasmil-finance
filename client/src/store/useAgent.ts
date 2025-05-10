import { create } from "zustand";

export enum AgentType {
  NAVI = "navi",
  CETUS = "cetus",
}

interface AgentState {
  selectedAgent: AgentType | null;
  setSelectedAgent: (agent: AgentType) => void;
}

export const useAgent = create<AgentState>((set) => ({
  selectedAgent: null,
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
}));
