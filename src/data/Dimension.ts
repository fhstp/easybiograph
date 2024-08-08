import { t } from "@/assets/util";

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

/** 7 dimensions are prepared for a new Zeitbalken (these are keys for the language file) */
const DEFAULT_DIMENSION_KEYS = ['family', 'living', 'education', 'work', 'health', 'treatment', 'dimother'];

/** first 6 dimensions are unmutable (ids 1..6) */
const FIXED_DIMENSION_COUNT = 6;

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

export function initDefaultDimensions(): ZBDimension[] {
  return DEFAULT_DIMENSION_KEYS.map((key, i) => {
    return { id: i + 1, title: t(key), visible: true }
  }).reverse()
  // n.b. dimensions array is reversely sorted (for unknown reasons)
}

export function translateDim(title: string, index: number): string {
  if (index < FIXED_DIMENSION_COUNT) {
    return t(DEFAULT_DIMENSION_KEYS[index])
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
