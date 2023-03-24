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
  compatibilityChecks(loaded);
  state.person = loaded.person;
  state.events = loaded.events;
  state.timeline = loaded.timeline;
}

export function compatibilityChecks(loaded: any): Zeitbalken {
  // backwards compatibility for datastructure change in March 2023
  if (!loaded.person.birthDate) {
    loaded.person.birthDate = loaded.person.birthMonth;
  }
  if (!loaded.person.creationDate) {
    loaded.person.creationDate = loaded.person.interviewMonth;
  }
  if (!loaded.person.interviewDate) {
    loaded.person.interviewDate = loaded.person.interviewMonth;
  }
  return loaded;
}
