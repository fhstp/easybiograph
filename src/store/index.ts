// import type { ZBSettings } from "@/data/ZBSettings";
import type { Zeitbalken } from "@/data/Zeitbalken";
import type { InjectionKey } from "vue";
import {
  createStore,
  useStore as baseUseStore,
  Store,
  createLogger,
} from "vuex";
import { localStoragePlugin, type IUnReDoState } from "./localStoragePlugin";
import { zeitbalkenModule } from "./zeitbalkenModule";

export interface IStoreState {
  data: Zeitbalken;
  // settings: ZBSettings;
  unredo: IUnReDoState;
}

const plugins = import.meta.env.PROD
  ? [createLogger(), localStoragePlugin]
  : [localStoragePlugin];

export const store = createStore<IStoreState>({
  strict: import.meta.env.DEV,
  modules: {
    data: zeitbalkenModule,
    // view: viewOptionsModule,
  },
  // getters,
  // mutations,
  plugins,
});

// TypeScript support <https://next.vuex.vuejs.org/guide/typescript-support.html#typing-usestore-composition-function>
// define injection key
export const key: InjectionKey<Store<IStoreState>> = Symbol();

// define your own `useStore` composition function
export function useStore(): Store<IStoreState> {
  return baseUseStore(key);
}
