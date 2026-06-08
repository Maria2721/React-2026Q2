import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addSubmission, markAsOld } from '../../store/submissionsSlice';

import { formSchema } from '../../validation/formSchema';
import { toBase64 } from '../../utils/toBase64';
import { getPasswordStrength } from '../../utils/getPasswordStrength';

import type { Submission, Gender } from '../../types/form';

type FormProps = {
  onSuccess: () => void;
};

type RHFFormData = {
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

export function RHFForm({ onSuccess }: FormProps) {
  const countries = useAppSelector((state) => state.countries.items);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<RHFFormData>({
    resolver: zodResolver(formSchema(countries)),
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: '',
      email: '',
      gender: 'other',
      country: '',
      password: '',
      confirmPassword: '',
      terms: false,
      image: null,
    },
  });

  const passwordValue = useWatch({
    control,
    name: 'password',
  });

  const passwordStrength = getPasswordStrength(passwordValue ?? '');

  const getInputClassName = (hasError: boolean) =>
    clsx(
      'w-full rounded-lg border px-3 py-2 text-sm outline-none transition',
      hasError
        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
    );
  const errorClassName = 'min-h-5 text-xs text-red-500';

  const onSubmit = async (data: RHFFormData) => {
    const file = data.image;

    let imageBase64: string | null = null;

    if (file) {
      imageBase64 = await toBase64(file);
    }

    const createdAt = new Date().getTime();
    const id = crypto.randomUUID();

    const submission: Submission = {
      id,
      createdAt,
      formType: 'rhf',
      image: imageBase64,
      name: data.name,
      age: data.age,
      email: data.email,
      gender: data.gender,
      country: data.country,
      password: data.password,
      confirmPassword: data.confirmPassword,
      terms: data.terms,
      isNew: true,
    };

    dispatch(addSubmission(submission));

    setTimeout(() => {
      dispatch(markAsOld(submission.id));
    }, 3000);

    reset();
    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-xl space-y-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className={getInputClassName(!!errors.name)}
          placeholder="Enter your name"
        />
        <p className={errorClassName}>{errors.name?.message}</p>
      </div>

      <div>
        <label htmlFor="age" className="text-sm font-medium text-gray-700">
          Age
        </label>
        <input
          id="age"
          type="number"
          {...register('age')}
          className={getInputClassName(!!errors.age)}
          placeholder="18"
        />
        <p className={errorClassName}>{errors.age?.message}</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Gender</label>

        <div
          role="radiogroup"
          className={clsx(
            'flex flex-wrap gap-2 rounded-lg border',
            errors.gender ? 'border-red-500' : 'border-transparent'
          )}
        >
          <label className="inline-flex w-fit min-w-27.5 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 focus-within:border-blue-500">
            <input
              type="radio"
              value="male"
              {...register('gender')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            Male
          </label>

          <label className="inline-flex w-fit min-w-27.5 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 focus-within:border-blue-500">
            <input
              type="radio"
              value="female"
              {...register('gender')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            Female
          </label>

          <label className="inline-flex w-fit min-w-27.5 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 focus-within:border-blue-500">
            <input
              type="radio"
              value="other"
              {...register('gender')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            Other
          </label>
        </div>

        <p className={errorClassName}>{errors.gender?.message}</p>
      </div>

      <div>
        <label htmlFor="country" className="text-sm font-medium text-gray-700">
          Country
        </label>

        <input
          id="country"
          list="countries"
          {...register('country')}
          className={getInputClassName(!!errors.country)}
          placeholder="Start typing country..."
        />

        <datalist id="countries">
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>

        <p className={errorClassName}>{errors.country?.message}</p>
      </div>

      <div>
        <label htmlFor="image" className="text-sm font-medium text-gray-700">
          Image
        </label>

        <Controller
          name="image"
          control={control}
          render={({ field: { onChange } }) => (
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => {
                onChange(e.target.files?.[0] ?? null);
              }}
              className="w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
            />
          )}
        />

        <p className={errorClassName}>{errors.image?.message}</p>
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={getInputClassName(!!errors.email)}
          placeholder="you@example.com"
        />
        <p className={errorClassName}>{errors.email?.message}</p>
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>

        <input
          id="password"
          type="password"
          {...register('password')}
          className={getInputClassName(!!errors.password)}
        />

        <p className="text-xs text-gray-500">
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

        <p className={errorClassName}>{errors.password?.message}</p>
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
          type="password"
          {...register('confirmPassword')}
          className={getInputClassName(!!errors.confirmPassword)}
        />

        <p className={errorClassName}>{errors.confirmPassword?.message}</p>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="terms"
          type="checkbox"
          {...register('terms')}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />

        <label htmlFor="terms" className="text-sm font-medium text-gray-700">
          Accept Terms
        </label>
      </div>

      <p className={errorClassName}>{errors.terms?.message}</p>

      <button
        type="submit"
        disabled={!isValid}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
      >
        Submit
      </button>
    </form>
  );
}
