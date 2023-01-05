import type { ZBEvent } from "./ZBEvent";
import { initPerson, type ZBPerson } from "./ZBPerson";

export interface Zeitbalken {
  person: ZBPerson;
  events: Array<ZBEvent>;
  timeline: Array<number>;
}

export function initZeitbalkenAsJSON(): string {
  return JSON.stringify({
    person: initPerson(),
    events: [],
    timeline: [],
  });
}

export function loadZeitbalken(state: Zeitbalken, loadedText: string): void {
  const loaded = JSON.parse(loadedText);
  state.person = loaded.person;
  state.events = loaded.events;
  state.timeline = loaded.timeline;
}
