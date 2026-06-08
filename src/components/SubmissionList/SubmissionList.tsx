import type { Submission } from '../../types/form';
import { SubmissionCard } from '../SubmissionCard/SubmissionCard';

type Props = {
  submissions: Submission[];
};

export function SubmissionList({ submissions }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {submissions.map((item) => (
        <SubmissionCard key={item.id} submission={item} />
      ))}
    </div>
  );
}
