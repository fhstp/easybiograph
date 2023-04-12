export interface ZBEvent {
  eventId: number;
  dimensionId: number;
  description: string;
  notes: string;
  isInterval: boolean;
  startDate: string;
  endDate: string;
  isOpenEnd: boolean;
}

export function initEvent(): ZBEvent {
  return {
    eventId: -1,
    dimensionId: -1,
    description: "",
    notes: "",
    isInterval: true,
    startDate: "",
    endDate: "",
    isOpenEnd: false,
  };
}
