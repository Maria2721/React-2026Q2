export type Gender = 'male' | 'female' | 'other';

export interface Submission {
  id: string;
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
