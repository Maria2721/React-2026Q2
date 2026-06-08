import { useState } from 'react';

import { Modal } from './components/Modal/Modal';
import { UncontrolledForm } from './components/UncontrolledForm/UncontrolledForm';
import { SubmissionSection } from './components/SubmissionSection/SubmissionSection';

import type { FormType } from './types/form';

export default function App() {
  const [modalType, setModalType] = useState<FormType>(null);

  const isOpen = modalType !== null;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setModalType('uncontrolled')}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
          >
            Open Uncontrolled Form
          </button>

          <button
            type="button"
            onClick={() => setModalType('rhf')}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
          >
            Open React Hook Form
          </button>
        </div>

        <SubmissionSection />

        <Modal
          isOpen={isOpen}
          title={modalType === 'rhf' ? 'React Hook Form' : 'Uncontrolled Form'}
          onClose={() => setModalType(null)}
        >
          <div className="text-sm text-gray-600">
            {modalType === 'uncontrolled' && (
              <UncontrolledForm onSuccess={() => setModalType(null)} />
            )}

            {modalType === 'rhf' && <p>React Hook Form goes here</p>}
          </div>
        </Modal>
      </div>
    </main>
  );
}
