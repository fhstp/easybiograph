export interface ZBPerson {
  name: string;
  birthplace: string;
  interviewers: string;
  creationDate: string;
  birthDate: string;
  endDate: string;
  notes: string;
}

export function initPerson(): ZBPerson {
  return {
    name: "",
    birthplace: "",
    interviewers: "",
    creationDate: new Date().toISOString().substring(0, 10),
    birthDate: "1980-01-01",
    endDate: new Date().toISOString().substring(0, 10),
    notes: "",
  };
}
