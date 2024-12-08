import { create } from "zustand";
import { SelectedComponent } from "@/types";

const { CHAT, PDF } = SelectedComponent;

interface useAppStoreProps {
  selectedComponent: SelectedComponent;
  setSelectedComponent: (component: SelectedComponent) => void;
}

const useAppStore = create<useAppStoreProps>((set) => ({
  selectedComponent: CHAT,
  setSelectedComponent: (component: SelectedComponent) =>
    set({ selectedComponent: component }),
}));

export default useAppStore;
