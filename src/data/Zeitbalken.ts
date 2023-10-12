import type { ZBEvent } from "./ZBEvent";
import { initPerson, type ZBPerson } from "./ZBPerson";

export interface Zeitbalken {
  person: ZBPerson;
  events: Array<ZBEvent>;
  timeline: Array<number>;
  dimensions: Array<string>;
}

export function initZeitbalkenAsJSON(): string {
  return JSON.stringify({
    person: initPerson(),
    events: [],
    timeline: [],
    dimensions: [],
  });
}

export function loadZeitbalken(state: Zeitbalken, loadedText: string): void {
  const loaded = JSON.parse(loadedText);
  compatibilityChecks(loaded);
  state.person = loaded.person;
  state.events = loaded.events;
  state.timeline = loaded.timeline;
  state.dimensions = loaded.dimensions;
}

export function compatibilityChecks(loaded: any): Zeitbalken {
  // backwards compatibility for datastructure change in March 2023
  if (!loaded.person.birthDate && loaded.person.birthMonth) {
    loaded.person.birthDate = loaded.person.birthMonth;
    delete loaded.person.birthMonth;
  }
  if (!loaded.person.creationDate && loaded.person.interviewMonth) {
    loaded.person.creationDate = loaded.person.interviewMonth;
  }
  if (!loaded.person.endDate && loaded.person.interviewMonth) {
    loaded.person.endDate = loaded.person.interviewMonth;
    delete loaded.person.interviewMonth;
  }
  return loaded;
}
