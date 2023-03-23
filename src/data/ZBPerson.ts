export interface ZBPerson {
  name: string;
  birthplace: string;
  interviewers: string;
  creationMonth: string;
  birthMonth: string;
  interviewMonth: string;
  notes: string;
}

export function initPerson(): ZBPerson {
  return {
    name: "",
    birthplace: "",
    interviewers: "",
    creationMonth: new Date().toISOString().substring(0, 10),
    birthMonth: "1980-01-01",
    interviewMonth: new Date().toISOString().substring(0, 10),
    notes: "",
  };
}
