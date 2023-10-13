export const DimensionA = [
  "Familie", // 0
  "Wohnen", // 1
  "Bildung", // 2
  "Arbeit", // 3
  "Gesundheit", //4
  "Behandlung/Hilfe", //5
  "Sonstiges", //6
];

export interface Dim {
  id: number;
  title: string;
  position: number;
}

export function initDimension(): Dim {
  return {
    id: -1,
    title: "",
    position: -1,
  };
}

export enum Dimension {
  Familie,
  Wohnen,
  Bildung,
  Arbeit,
  Gesundheit,
  Behandlung,
  Sonstiges,
}
