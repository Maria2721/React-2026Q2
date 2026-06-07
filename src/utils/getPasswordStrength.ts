export type PasswordStrength = 'Weak' | 'Medium' | 'Strong' | '';

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return '';

  let score = 0;

  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return 'Weak';
  if (score === 2 || score === 3) return 'Medium';
  return 'Strong';
}
