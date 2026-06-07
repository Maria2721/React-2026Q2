import { z } from 'zod';

export const formSchema = (countries: string[]) =>
  z
    .object({
      name: z.string(),
      age: z.string(),
      email: z.string(),
      gender: z.string(),
      country: z.string(),
      password: z.string(),
      confirmPassword: z.string(),
      terms: z.boolean(),
      image: z.any(),
    })
    .superRefine((data, ctx) => {
      if (!data.name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['name'],
          message: 'Name is required',
        });
      } else if (data.name[0] !== data.name[0].toUpperCase()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['name'],
          message: 'First letter must be uppercase',
        });
      }

      if (!data.age) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['age'],
          message: 'Age is required',
        });
      } else if (Number.isNaN(Number(data.age))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['age'],
          message: 'Age must be a number',
        });
      } else if (Number(data.age) < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['age'],
          message: 'Age cannot be negative',
        });
      }

      if (!data.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['email'],
          message: 'Email is required',
        });
      } else {
        const [local, domain] = data.email.split('@');

        if (!local || !domain || !domain.includes('.')) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['email'],
            message: 'Invalid email',
          });
        }
      }

      if (!data.gender) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['gender'],
          message: 'Gender is required',
        });
      } else if (!['male', 'female', 'other'].includes(data.gender)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['gender'],
          message: 'Gender is required',
        });
      }

      if (!data.country) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['country'],
          message: 'Country is required',
        });
      } else if (
        !countries.some((c) => c.toLowerCase() === data.country.toLowerCase())
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['country'],
          message: 'Country must be selected from list',
        });
      }

      if (!data.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['password'],
          message: 'Password is required',
        });
      }

      if (!data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmPassword'],
          message: 'Confirm password is required',
        });
      }

      if (
        data.password &&
        data.confirmPassword &&
        data.password !== data.confirmPassword
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmPassword'],
          message: 'Passwords do not match',
        });
      }

      if (!data.terms) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['terms'],
          message: 'You must accept terms',
        });
      }

      const file = data.image;

      if (!(file instanceof File)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['image'],
          message: 'Image is required',
        });

        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['image'],
          message: 'Image must be less than 2MB',
        });
      }

      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['image'],
          message: 'Only PNG or JPEG allowed',
        });
      }
    });
