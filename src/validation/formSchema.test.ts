import { describe, expect, it } from 'vitest';

import { formSchema } from './formSchema';

const countries = ['Kazakhstan', 'Russia'];

const validFile = new File(['test'], 'avatar.png', {
  type: 'image/png',
});

const validData = {
  name: 'Maria',
  age: '25',
  email: 'maria@example.com',
  gender: 'female',
  country: 'Kazakhstan',
  password: 'Password1!',
  confirmPassword: 'Password1!',
  terms: true,
  image: validFile,
};

describe('formSchema', () => {
  const schema = formSchema(countries);

  it('passes validation with valid data', () => {
    const result = schema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it('validates uppercase first letter', () => {
    const result = schema.safeParse({
      ...validData,
      name: 'maria',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'First letter must be uppercase'
      );
    }
  });

  it('validates age as number', () => {
    const result = schema.safeParse({
      ...validData,
      age: 'abc',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Age must be a number');
    }
  });

  it('validates negative age', () => {
    const result = schema.safeParse({
      ...validData,
      age: '-5',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Age cannot be negative');
    }
  });

  it('validates email format', () => {
    const result = schema.safeParse({
      ...validData,
      email: 'invalid-email',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Invalid email');
    }
  });

  it('validates country exists in list', () => {
    const result = schema.safeParse({
      ...validData,
      country: 'Mars',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'Country must be selected from list'
      );
    }
  });

  it('validates password match', () => {
    const result = schema.safeParse({
      ...validData,
      password: 'Password1!',
      confirmPassword: 'AnotherPassword1!',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Passwords do not match');
    }
  });

  it('validates accepted terms', () => {
    const result = schema.safeParse({
      ...validData,
      terms: false,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('You must accept terms');
    }
  });

  it('requires image', () => {
    const result = schema.safeParse({
      ...validData,
      image: null,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Image is required');
    }
  });

  it('validates image size', () => {
    const largeFile = new File([new Uint8Array(3 * 1024 * 1024)], 'large.png', {
      type: 'image/png',
    });

    const result = schema.safeParse({
      ...validData,
      image: largeFile,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'Image must be less than 2MB'
      );
    }
  });

  it('validates image type', () => {
    const gifFile = new File(['test'], 'image.gif', {
      type: 'image/gif',
    });

    const result = schema.safeParse({
      ...validData,
      image: gifFile,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Only PNG or JPEG allowed');
    }
  });

  it('requires name', () => {
    const result = schema.safeParse({
      ...validData,
      name: '',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Name is required');
    }
  });

  it('requires age', () => {
    const result = schema.safeParse({
      ...validData,
      age: '',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Age is required');
    }
  });

  it('requires email', () => {
    const result = schema.safeParse({
      ...validData,
      email: '',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Email is required');
    }
  });

  it('requires country', () => {
    const result = schema.safeParse({
      ...validData,
      country: '',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Country is required');
    }
  });

  it('requires password', () => {
    const result = schema.safeParse({
      ...validData,
      password: '',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Password is required');
    }
  });

  it('requires confirm password', () => {
    const result = schema.safeParse({
      ...validData,
      confirmPassword: '',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'Confirm password is required'
      );
    }
  });
});
