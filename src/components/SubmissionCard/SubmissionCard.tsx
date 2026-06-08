import clsx from 'clsx';

import type { Submission } from '../../types/form';

import './SubmissionCard.css';

type Props = {
  submission: Submission;
};

export function SubmissionCard({ submission }: Props) {
  return (
    <div
      className={clsx(
        'group rounded-xl border border-gray-800 bg-white p-5 shadow-sm transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-md',
        submission.isNew &&
          'border-purple-500 ring-4 ring-purple-300/70 animate-glow'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {submission.image ? (
            <img
              src={submission.image}
              alt={submission.name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-sm text-gray-400">
              ?
            </div>
          )}

          <div>
            <p className="font-medium text-gray-900">{submission.name}</p>
            <p className="text-xs text-gray-500">{submission.email}</p>
          </div>
        </div>

        <span
          className={clsx(
            'rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-wide',
            submission.formType === 'uncontrolled'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-emerald-100 text-emerald-700'
          )}
        >
          {submission.formType}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-gray-600">
        <div>
          <p className="text-xs text-gray-400">Country</p>
          <p className="font-medium text-gray-800">{submission.country}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Gender</p>
          <p className="font-medium text-gray-800">{submission.gender}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Age</p>
          <p className="font-medium text-gray-800">{submission.age}</p>
        </div>
      </div>
    </div>
  );
}
