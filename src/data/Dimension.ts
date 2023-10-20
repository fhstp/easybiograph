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
  visible: boolean;
}

export function initDimension(): Dim {
  return {
    id: -1,
    title: "",
    visible: true,
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
