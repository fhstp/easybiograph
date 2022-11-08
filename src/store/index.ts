import { createStore } from "vuex";

// simple store from <https://vuex.vuejs.org/guide/#the-simplest-store>
export const store = createStore({
  state() {
    return {
      count: 0,
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
});

// export const store = createStore<IStoreState>({
//     strict: process.env.NODE_ENV !== "production",
//     modules: {
//       nwk: nwkModule,
//       view: viewOptionsModule,
//     },
//     getters,
//     mutations,
//     plugins,
//   });
