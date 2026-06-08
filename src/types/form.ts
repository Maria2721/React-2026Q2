export type FormType = 'uncontrolled' | 'rhf' | null;

export type Gender = 'male' | 'female' | 'other';

export interface Submission {
  id: string;
  formType: FormType;
  name: string;
  age: string;
  gender: Gender;
  country: string;
  image: string | null;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  createdAt: number;
  isNew?: boolean;
}
