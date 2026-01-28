'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { deleteWorkout } from '@/actions/workout';
import { useTranslations } from 'next-intl';

type DeleteWorkoutButtonProps = {
  workoutId: number;
  workoutName: string;
};

export default function DeleteWorkoutButton({ workoutId, workoutName }: DeleteWorkoutButtonProps) {
  const t = useTranslations('WorkoutDetail');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteWorkout(String(workoutId));
      if (result) {
        router.push(`/${locale}/workouts`);
        router.refresh();
      } else {
        console.error('Error deleting workout');
        setIsDeleting(false);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
      setIsDeleting(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg border border-red-500/30 transition-colors"
      >
        {t('delete')}
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80"
            onClick={() => !isDeleting && setShowModal(false)}
          />

          {/* Modal content */}
          <div className="relative bg-surface rounded-xl shadow-xl p-6 max-w-md w-full mx-4 border border-foreground/10">
            <h3 className="text-xl font-bold mb-4 text-foreground">
              {t('confirmDelete')}
            </h3>
            <p className="text-foreground/60 mb-6">
              {t('confirmDeleteMessage', { name: workoutName })}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 border border-foreground/20 text-foreground rounded-lg hover:bg-foreground/10 transition-colors disabled:opacity-50"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-red-500/50"
              >
                {isDeleting ? t('deleting') : t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
