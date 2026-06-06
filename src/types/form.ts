export type FormType = 'uncontrolled' | 'rhf' | null;

export type Gender = 'male' | 'female' | 'other';

export interface Submission {
  id: string;
  formType: FormType;
  name: string;
  age: number;
  email: string;
  gender: Gender;
  country: string;
  image: string;
  password: string;
  acceptedTerms: boolean;
  createdAt: number;
}
