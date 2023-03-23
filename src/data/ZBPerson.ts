export interface ZBPerson {
  name: string;
  birthplace: string;
  interviewers: string;
  creationDate: string;
  birthDate: string;
  interviewDate: string;
  notes: string;
}

export function initPerson(): ZBPerson {
  return {
    name: "",
    birthplace: "",
    interviewers: "",
    creationDate: new Date().toISOString().substring(0, 10),
    birthDate: "1980-01-01",
    interviewDate: new Date().toISOString().substring(0, 10),
    notes: "",
  };
}
