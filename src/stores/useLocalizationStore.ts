import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LocalizationState {
  language: "en" | "ge";
  changeLanguage: (param: LocalizationState["language"]) => void;
}

export const useLocalizationStore = create<LocalizationState>()(
  persist(
    (set) => ({
      language: "en",
      changeLanguage: (param) => set(() => ({ language: param })),
    }),
    {
      name: "localization-storage",
    },
  ),
);
