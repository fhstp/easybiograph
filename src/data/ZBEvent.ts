export interface ZBEvent {
  eventId: number;
  dimensionId: number;
  description: string;
  notes: string;
  isInterval: boolean;
}

export function initEvent(): ZBEvent {
  return {
    eventId: -1,
    dimensionId: -1,
    description: "",
    notes: "",
    isInterval: true,
  };
}
