export type FormType = 'uncontrolled' | 'rhf' | null;

export type Gender = 'male' | 'female' | 'other';

export interface Submission {
  id: string;
  formType: FormType;
  name: string;
  age: number;
  gender: Gender;
  country: string;
  image: string;
  email: string;
  password: string;
  terms: boolean;
  createdAt: number;
}
