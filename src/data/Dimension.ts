// TODO AR 8 aug 2024 not needed anymore?
export const DimensionA = [
  "Familie", // 0
  "Wohnen", // 1
  "Bildung", // 2
  "Arbeit", // 3
  "Gesundheit", //4
  "Behandlung/Hilfe", //5
  "Sonstiges", //6
];

export interface ZBDimension {
  id: number;
  title: string;
  visible: boolean;
}

export function initDimension(): ZBDimension {
  return {
    id: -1,
    title: "",
    visible: true,
  };
}

export function translateDim(title: string, index: number, t: (key: string) => string): string {
  const translationKeys = ['family', 'living', 'education', 'work', 'health', 'treatment']

  if (index < 6) {
    return t(translationKeys[index])
  } else {
    return title
  }
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
