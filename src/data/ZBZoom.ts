export interface ZBZoom {
  birthDate: string;
  endDate: string;
}

export function initZoom(): ZBZoom {
  return {
    birthDate: "",
    endDate: "",
  };
}
