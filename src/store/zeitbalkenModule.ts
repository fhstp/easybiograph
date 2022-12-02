import type {ZBEvent} from "@/data/ZBEvent";
import {initEvent} from "@/data/ZBEvent";
import type {ZBPerson} from "@/data/ZBPerson";
import type {Zeitbalken} from "@/data/Zeitbalken";
import {initZeitbalkenAsJSON, loadZeitbalken} from "@/data/Zeitbalken";

import {loadZeitbalkenFromStore} from "./localStoragePlugin";
//import type { IStoreState } from "@/store/index";

// module state object.
// each Vuex instance is just a single state tree.
const state = JSON.parse(loadZeitbalkenFromStore());

// mutations are operations that actually mutate the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
    newZeitbalken(state: Zeitbalken): void {
        loadZeitbalken(state, initZeitbalkenAsJSON());
    },

    loadZeitbalken(state: Zeitbalken, payload: string): void {
        loadZeitbalken(state, payload);
    },

    editPerson(state: Zeitbalken, payload: Partial<ZBPerson>): void {
        // using spread to merge objects <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals>
        state.person = {...state.person, ...payload};
    },

    addEvent(state: Zeitbalken, initialValues: Partial<ZBEvent> = {}): void {
        // initialize alter with default values and optionally with the passed values
        const newEvent = {
            ...initEvent(),
            ...initialValues,
        };
        //   applyAdaptiveNWKDefaults(newAlter, initialValues);

        // set id depending on events in list
        // bugfix: if any id is undefined, NaN, or null --> default to 1
        newEvent.eventId =
            state.events.length > 0
                ? Math.max(...state.events.map((v) => (v.eventId ? v.eventId : 1))) + 1
                : 1;

        // new alter is always added on top of list
        state.events.unshift(newEvent);
    },

    editEvent(
        state: Zeitbalken,
        payload: { index: number; changes: Partial<ZBEvent> }
    ): void {
        // based oen vuex\examples\composition\todomvc\store\mutations.js
        // const index = state.alteri.indexOf(payload.alter);

        // lookup does not work for 2 parallel mutations (form change & map click)
        if (
            payload.index != null &&
            payload.index >= 0 &&
            payload.index < state.events.length
        ) {
            // using spread to merge objects <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals>
            const changedEvent = {
                ...state.events[payload.index],
                ...payload.changes,
            };
            // applyAdaptiveNWKDefaults(changedAlter, payload.changes);
            state.events.splice(payload.index, 1, changedEvent);
        } else {
            console.warn("event index out of bounds: " + payload.index);
        }
    },

    editEventById(
        state: Zeitbalken,
        payload: { id: number; changes: Partial<ZBEvent> }
    ): void {
        const index = state.events.findIndex((a) => a.eventId === payload.id);
        // const index = state.alteri.map((a) => a.id).indexOf(payload.id);
        if (index >= 0) {
            const changedEvent = {
                ...state.events[index],
                ...payload.changes,
            };
            // applyAdaptiveNWKDefaults(changedAlter, payload.changes);
            state.events.splice(index, 1, changedEvent);
        } else {
            console.warn("event id not found: " + payload.id);
        }
    },

    removeEvent(state: Zeitbalken, eventIndex: number): void {
        // based on vuex\examples\composition\todomvc\store\mutations.js
        state.events.splice(eventIndex, 1);
    },
};
/*
    getters: {
      // @ts-ignore
      getEvents(state, getters) {
        //@ts-ignore
        return state.events
      },
    }; */

export const zeitbalkenModule = {
    namespaced: true,
    state,
    mutations,
    //getters,
};
