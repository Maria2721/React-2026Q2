import { useAppSelector } from '../../store/hooks';
import { SubmissionList } from '../SubmissionList/SubmissionList';

export function SubmissionSection() {
  const submissions = useAppSelector((state) => state.submissions.items);

  return (
    <section className="mt-10 rounded-xl border border-dashed border-gray-300 bg-white p-6">
      <h2 className="mb-4 text-lg font-medium text-gray-800">
        Submission Cards
      </h2>

      {submissions.length === 0 ? (
        <p className="text-sm text-gray-500">
          Submitted forms will appear here
        </p>
      ) : (
        <SubmissionList submissions={submissions} />
      )}
    </section>
  );
}