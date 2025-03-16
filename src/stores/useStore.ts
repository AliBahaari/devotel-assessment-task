import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DarkModeState {
  darkMode: boolean;
  toggleDarkMode: VoidFunction;
}

export const useDarkModeStore = create<DarkModeState>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: "dark-mode-storage",
    },
  ),
);
