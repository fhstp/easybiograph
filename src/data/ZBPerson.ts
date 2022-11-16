export interface ZBPerson {
  name: string;
  birthplace: string;
  interviewers: string;
  notes: string;
}

export function initPerson(): ZBPerson {
  return {
    name: "",
    birthplace: "",
    interviewers: "",
    notes: "",
  };
}
