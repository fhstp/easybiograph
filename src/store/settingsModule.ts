import type { ZBSettings, ZBSettingsFlags } from "@/data/ZBSettings";
import { loadSettingsFromStore } from "./localStoragePlugin";
import { changeColorMode } from "@/assets/ColorMode";

// module state object
const state = JSON.parse(loadSettingsFromStore());

const mutations = {
  enable(state: ZBSettings, flag: keyof ZBSettingsFlags): void {
    state[flag] = true;
  },

  disable(state: ZBSettings, flag: keyof ZBSettingsFlags): void {
    state[flag] = false;
  },

  toggle(state: ZBSettings, flag: keyof ZBSettingsFlags): void {
    state[flag] = !state[flag];
  },

  changeLanguage(state: ZBSettings, newLanguage: string): void {
    state.language = newLanguage;
  },
  changeGridState(state: ZBSettings, newGridState: boolean): void {
    state.showGrid = newGridState;
  },
  changeColorMode(state: ZBSettings, newColorMode: string): void {
    state.colorMode = newColorMode;
    changeColorMode(newColorMode);
  },
};

export const settingsModule = {
  namespaced: true,
  state,
  mutations,
};
