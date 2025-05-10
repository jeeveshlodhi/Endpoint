import { create } from "zustand";

interface UIState {
    isModalOpen: boolean;
    isSidePanelOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    openSidePanel: () => void;
    closeSidePanel: () => void;
}

const useUIStore = create<UIState>((set) => ({
    isModalOpen: false,
    isSidePanelOpen: false,

    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),

    openSidePanel: () => set({ isSidePanelOpen: true }),
    closeSidePanel: () => set({ isSidePanelOpen: false }),
}));

export default useUIStore;
