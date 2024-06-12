import type { ZBDimension } from "./Dimension";
import type { ZBEvent } from "./ZBEvent";
import { initPerson, type ZBPerson } from "./ZBPerson";
import { initZoom, type ZBZoom } from "@/data/ZBZoom";

export interface Zeitbalken {
  person: ZBPerson;
  events: Array<ZBEvent>;
  timeline: Array<number>;
  dimensions: Array<ZBDimension>;
  zoom: ZBZoom;
}

export function initZeitbalkenAsJSON(): string {
  return JSON.stringify({
    person: initPerson(),
    events: [],
    timeline: [],
    dimensions: [],
    zoom: initZoom(),
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
  if (!loaded.dimensions) {
    loaded.dimensions = [
      { id: 7, title: "Sonstiges", visible: true },
      { id: 6, title: "Behandlung", visible: true },
      { id: 5, title: "Gesundheit", visible: true },
      { id: 4, title: "Arbeit", visible: true },
      { id: 3, title: "Bildung", visible: true },
      { id: 2, title: "Wohnen", visible: true },
      { id: 1, title: "Familie", visible: true },
    ];
  }
  return loaded;
}
