import type { Submission } from '../../types/form';

export const mockSubmission: Submission = {
  id: '1',
  formType: 'uncontrolled',
  name: 'Maria',
  age: '25',
  gender: 'female',
  country: 'Kazakhstan',
  image: 'base64-image',
  email: 'maria@example.com',
  password: 'Password1!',
  confirmPassword: 'Password1!',
  terms: true,
  createdAt: 1740000000000,
  isNew: true,
};
