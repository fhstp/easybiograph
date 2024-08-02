import type { ZBSettings, ZBSettingsFlags } from "@/data/ZBSettings";
import { loadSettingsFromStore } from "./localStoragePlugin";

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
};

export const settingsModule = {
  namespaced: true,
  state,
  mutations,
};
