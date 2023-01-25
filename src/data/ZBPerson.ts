export interface ZBPerson {
  name: string;
  birthplace: string;
  interviewers: string;
  birthMonth: string;
  interviewMonth: string;
  notes: string;
}

export function initPerson(): ZBPerson {
  return {
    name: "",
    birthplace: "",
    interviewers: "",
    birthMonth: "1980-01",
    interviewMonth: new Date().toISOString().substring(0, 7),
    notes: "",
  };
}
