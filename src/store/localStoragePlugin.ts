/* vuex 4 module handling persistance in localStorage and undo/redo.

adapted from <https://github.com/fhstp/easynwk-web/blob/56a7d996527cbe71cf333893b8e4867407a48e27/src/store/localStoragePlugin.ts#L1>
undo/redo inspired by <https://github.com/factorial-io/undo-redo-vuex>
and <https://github.com/anthonygore/vuex-undo-redo> */

import { initSettingsAsJSON, loadSettings } from "@/data/ZBSettings";
import { initZeitbalkenAsJSON } from "@/data/Zeitbalken";
import type { MutationPayload, Store } from "vuex";
import type { IStoreState } from ".";
import { initSessionState } from "./sessionModule";
// import { initViewOptionsState } from "./viewOptionsModule";

const STORAGE_DATA = "eb_zeitbalken";
const STORAGE_STNG = "eb_settings";
const UNREDO_MODULE = "unredo";

export interface IUnReDoState {
  undoCount: number;
  redoCount: number;
}

export function loadZeitbalkenFromStore(): string {
  const storedZeitbalken = localStorage.getItem(STORAGE_DATA);
  if (storedZeitbalken != null && storedZeitbalken != "undefined") {
    return storedZeitbalken;
  } else {
    return initZeitbalkenAsJSON();
  }
}

export function loadSettingsFromStore(): string {
  const storedSettings = localStorage.getItem(STORAGE_STNG);
  if (storedSettings != null && storedSettings != "undefined") {
    return storedSettings;
  } else {
    return initSettingsAsJSON();
  }
}

export const localStoragePlugin = (store: Store<IStoreState>): void => {
  // keep track of undo history as local (non-reactive) vars
  const history = {
    initialData: loadZeitbalkenFromStore(),
    initialSettings: loadSettingsFromStore(),
    done: [] as Array<MutationPayload>,
    undone: [] as Array<MutationPayload>,
    replaying: false,
  };

  store.registerModule(UNREDO_MODULE, {
    namespaced: true,
    state: {
      undoCount: 0,
      redoCount: 0,
    },
    mutations: {
      undo(state: IUnReDoState) {
        // console.log("undo, done length is " + history.done.length);

        // move last mutation to undone list
        const last = history.done.pop();
        if (last) {
          state.undoCount--;
          history.undone.push(last);
          state.redoCount++;
        }

        // make subscribers aware that we are replaying
        history.replaying = true;

        // reset to initial state
        store.commit("data/loadZeitbalken", history.initialData);
        loadSettings(store.state.settings, history.initialSettings);
        store.state.session = initSessionState();

        // replay all mutations (but last)
        for (const c of history.done) {
          store.commit(c.type, c.payload);
        }

        // replaying finished (now the undo is a normal mutation)
        history.replaying = false;

        // console.log("ok,   done length is " + history.done.length);
      },

      redo(state: IUnReDoState) {
        // handle state modified by user before redo
        if (state.redoCount == 0) {
          history.undone = [];
        }

        // simply commit most recently undone mutation
        const last = history.undone.pop();
        if (last) {
          state.redoCount--;
          history.done.push(last);
          state.undoCount++;

          history.replaying = true;
          store.commit(last.type, last.payload);
          history.replaying = false;
        }
      },
      usermutation(state: IUnReDoState) {
        state.undoCount = history.done.length;
        state.redoCount = 0;
      },
    },
  });

  // track mutation in undo history
  store.subscribe((mutation) => {
    if (!mutation.type.startsWith(UNREDO_MODULE)) {
      if (!history.replaying) {
        history.done.push(mutation);
        store.commit(UNREDO_MODULE + "/usermutation");
      }
    }
  });

  // persist change to Zeitbalken in localStorage
  store.subscribe((mutation, stateAfter: IStoreState) => {
    // skip replayed mutations, but persist after undo mutation itself
    // skip internal update counts mutation
    if (
      !(
        history.replaying ||
        mutation.type === UNREDO_MODULE + "/usermutation" ||
        mutation.type.startsWith("session/")
      )
    ) {
      localStorage.setItem(STORAGE_DATA, JSON.stringify(stateAfter.data));
      localStorage.setItem(STORAGE_STNG, JSON.stringify(stateAfter.settings));
    }
  });
};
