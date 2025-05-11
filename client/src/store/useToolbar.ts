import { create } from 'zustand'

export enum ToolbarType {
  CREATE = "create",
  EDIT = "edit",
  FUTURE = "future",
}

interface ToolbarState {
  isOpen: boolean
  type: ToolbarType
  setIsOpen: (isOpen: boolean) => void
  setType: (type: ToolbarType) => void
}

export const useToolbar = create<ToolbarState>((set) => ({
  isOpen: false,
  type: ToolbarType.CREATE,
  setIsOpen: (isOpen) => set({ isOpen }),
  setType: (type) => set({ type }),
}))
