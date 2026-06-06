import { useRef } from 'react';

import { useAppSelector } from '../../store/hooks';

type FormProps = {
  onSuccess: () => void;
};

export function UncontrolledForm({ onSuccess }: FormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const countries = useAppSelector((state) => state.countries.items);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(formRef.current!);
    const raw = Object.fromEntries(formData.entries());

    console.log('RAW DATA:', raw);
    onSuccess();
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-xl space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="Enter your name"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="age" className="text-sm font-medium text-gray-700">
          Age
        </label>
        <input
          id="age"
          name="age"
          type="number"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="18"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Gender</label>

        <div className="flex flex-wrap gap-2">
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
      </div>

      <div className="space-y-1">
        <label htmlFor="country" className="text-sm font-medium text-gray-700">
          Country
        </label>

        <input
          list="countries"
          id="country"
          name="country"
          placeholder="Start typing country..."
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        <datalist id="countries">
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      <div className="space-y-1">
        <label htmlFor="image" className="text-sm font-medium text-gray-700">
          Image
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/png, image/jpeg"
          className="w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="space-y-1">
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
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="terms" className="text-sm text-gray-700">
          Accept Terms
        </label>
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
