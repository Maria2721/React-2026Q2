import { useRef, useState } from 'react';
import type { SyntheticEvent } from 'react';
import clsx from 'clsx';

import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addSubmission, markAsOld } from '../../store/submissionsSlice';

import { formSchema } from '../../validation/formSchema';
import { toBase64 } from '../../utils/toBase64';
import { getPasswordStrength } from '../../utils/getPasswordStrength';
import type { PasswordStrength } from '../../utils/getPasswordStrength';
import type { Submission, Gender } from '../../types/form';

type FormProps = {
  onSuccess: () => void;
};

type ValidFormData = {
  image: File | null;
  name: string;
  age: string;
  email: string;
  gender: Gender;
  country: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

export function UncontrolledForm({ onSuccess }: FormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const countries = useAppSelector((state) => state.countries.items);
  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrength>('');

  const getInputClassName = (hasError: boolean) =>
    clsx(
      'w-full rounded-lg border px-3 py-2 text-sm outline-none transition',
      hasError
        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
    );
  const errorClassName = 'min-h-5 text-xs text-red-500';

  const convertImage = async (data: ValidFormData) => {
    let imageBase64: string | null = null;

    if (data.image instanceof File && data.image.size > 0) {
      imageBase64 = await toBase64(data.image);
    }

    return {
      ...data,
      image: imageBase64,
    };
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(formRef.current!);
    const imageEntry = formData.get('image');

    const raw = {
      name: formData.get('name') ?? '',
      age: formData.get('age') ?? '',
      email: formData.get('email') ?? '',
      gender: formData.get('gender') ?? '',
      country: formData.get('country') ?? '',
      password: formData.get('password') ?? '',
      confirmPassword: formData.get('confirmPassword') ?? '',
      terms: formData.get('terms') === 'on',
      image:
        imageEntry instanceof File && imageEntry.size > 0 ? imageEntry : null,
    };

    const result = formSchema(countries).safeParse(raw);

    if (!result.success) {
      const newErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (typeof field === 'string') {
          newErrors[field] = issue.message;
        }
      });

      setErrors(newErrors);
      return;
    }

    const finalData = await convertImage(result.data);
    const genderRaw = formData.get('gender');

    const gender: Gender =
      genderRaw === 'male' || genderRaw === 'female' || genderRaw === 'other'
        ? genderRaw
        : 'other';

    const submission: Submission = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      formType: 'uncontrolled',
      image: finalData.image,
      name: finalData.name,
      age: finalData.age,
      email: finalData.email,
      gender: gender,
      country: finalData.country,
      password: finalData.password,
      confirmPassword: finalData.confirmPassword,
      terms: finalData.terms,
      isNew: true,
    };

    dispatch(addSubmission(submission));

    setTimeout(() => {
      dispatch(markAsOld(submission.id));
    }, 3000);

    setErrors({});
    formRef.current?.reset();
    setPasswordStrength('');
    onSuccess();
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-xl space-y-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          aria-invalid={Boolean(errors.name)}
          aria-describedby="name-error"
          className={getInputClassName(Boolean(errors.name))}
          placeholder="Enter your name"
        />

        <p id="name-error" className={errorClassName}>
          {errors.name}
        </p>
      </div>

      <div>
        <label htmlFor="age" className="text-sm font-medium text-gray-700">
          Age
        </label>
        <input
          id="age"
          name="age"
          type="number"
          aria-invalid={Boolean(errors.age)}
          aria-describedby="age-error"
          className={getInputClassName(Boolean(errors.age))}
          placeholder="18"
        />

        <p id="age-error" className={errorClassName}>
          {errors.age}
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Gender</label>

        <div
          role="radiogroup"
          aria-invalid={Boolean(errors.gender)}
          aria-describedby="gender-error"
          className={clsx(
            'flex flex-wrap gap-2 rounded-lg border',
            errors.gender ? 'border-red-500' : 'border-transparent'
          )}
        >
          <label className="inline-flex w-fit min-w-27.5 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 focus-within:border-blue-500">
            <input
              type="radio"
              name="gender"
              value="male"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            Male
          </label>

          <label className="inline-flex w-fit min-w-27.5 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 focus-within:border-blue-500">
            <input
              type="radio"
              name="gender"
              value="female"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            Female
          </label>

          <label className="inline-flex w-fit min-w-27.5 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 focus-within:border-blue-500">
            <input
              type="radio"
              name="gender"
              value="other"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            Other
          </label>
        </div>

        <p id="gender-error" className={errorClassName}>
          {errors.gender}
        </p>
      </div>

      <div>
        <label htmlFor="country" className="text-sm font-medium text-gray-700">
          Country
        </label>

        <input
          list="countries"
          id="country"
          name="country"
          aria-invalid={Boolean(errors.country)}
          aria-describedby="country-error"
          placeholder="Start typing country..."
          className={getInputClassName(Boolean(errors.country))}
        />

        <datalist id="countries">
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>

        <p id="country-error" className={errorClassName}>
          {errors.country}
        </p>
      </div>

      <div>
        <label htmlFor="image" className="text-sm font-medium text-gray-700">
          Image
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/png, image/jpeg"
          aria-invalid={Boolean(errors.image)}
          aria-describedby="image-error"
          className="w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
        />

        <p id="image-error" className={errorClassName}>
          {errors.image}
        </p>
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby="email-error"
          className={getInputClassName(Boolean(errors.email))}
          placeholder="you@example.com"
        />

        <p id="email-error" className={errorClassName}>
          {errors.email}
        </p>
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={(e) =>
            setPasswordStrength(getPasswordStrength(e.target.value))
          }
          aria-invalid={Boolean(errors.password)}
          aria-describedby="password-error"
          className={getInputClassName(Boolean(errors.password))}
        />
        <p className="mt-1 text-xs text-gray-500">
          {passwordStrength ? (
            <>
              Password strength:{' '}
              <span
                className={clsx(
                  passwordStrength === 'Weak' && 'text-red-500',
                  passwordStrength === 'Medium' && 'text-yellow-500',
                  passwordStrength === 'Strong' && 'text-green-600'
                )}
              >
                {passwordStrength}
              </span>
            </>
          ) : (
            'Start typing password...'
          )}
        </p>

        <p id="password-error" className={errorClassName}>
          {errors.password}
        </p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby="confirmPassword-error"
          className={getInputClassName(Boolean(errors.confirmPassword))}
        />

        <p id="confirmPassword-error" className={errorClassName}>
          {errors.confirmPassword}
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            aria-invalid={Boolean(errors.terms)}
            aria-describedby="terms-error"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />

          <label htmlFor="terms" className="text-sm font-medium text-gray-700">
            Accept Terms
          </label>
        </div>

        <p id="terms-error" className={errorClassName}>
          {errors.terms}
        </p>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99]"
      >
        Submit
      </button>
    </form>
  );
}
