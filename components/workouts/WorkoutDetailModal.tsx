'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import ExerciseList from './ExerciseList';
import DeleteWorkoutButton from './DeleteWorkoutButton';
import { getDifficultyColor } from '@/utils/difficultyColors';
import { WorkoutDetail } from '@/types/Workout';

type WorkoutDetailModalProps = {
  workout: WorkoutDetail;
  isOpen: boolean;
  onClose: () => void;
  isOwner: boolean;
};

export default function WorkoutDetailModal({
  workout,
  isOpen,
  onClose,
  isOwner,
}: WorkoutDetailModalProps) {
  const t = useTranslations('WorkoutDetail');

  const difficultyClass = getDifficultyColor(workout.difficulty);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-xl p-4 sm:p-6 max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start gap-2 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{workout.name}</h1>
          
          <button
            onClick={onClose}
            className="text-foreground/60 hover:text-foreground transition-colors shrink-0"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Actions */}
        {isOwner && (
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            <Link
              href={`/workouts/${workout.id}/edit`}
              className="bg-tertiary-500/20 hover:bg-tertiary-500/30 text-tertiary-400 px-3 sm:px-4 py-2 rounded-lg border border-tertiary-500/30 transition-colors text-sm"
            >
              {t('edit')}
            </Link>
            <DeleteWorkoutButton workoutId={workout.id} workoutName={workout.name} />
          </div>
        )}

        {/* Description */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">{t('description')}</h2>
          <p className="text-foreground/70 text-sm sm:text-base">{workout.description || t('noDescription')}</p>
        </div>

        {/* Stats and Tags */}
        <div className="mb-4 sm:mb-6 flex justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 text-xs rounded-full border ${difficultyClass}`}>
              {workout.difficulty || t('notSpecified')}
            </span>
            {workout.duration && (
              <span className="px-3 py-1 text-xs bg-tertiary-500/20 text-tertiary-400 rounded-full border border-tertiary-500/30">
                {workout.duration} {t('minutes')}
              </span>
            )}
          </div>

          {/* Right: Tags */}
          {workout.tags && workout.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-end">
              {workout.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-primary-500/10 text-primary-400 text-xs rounded-full border border-primary-500/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Exercises */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">{t('exercises')}</h2>
          {workout.exercises && workout.exercises.length > 0 ? (
            <ExerciseList exercises={workout.exercises.map(ex => ({
              id: String(ex.id),
              name: ex.name,
              sets: ex.sets,
              reps: ex.reps,
              rest: ex.rest,
              muscle_group: ex.muscle_group,
              exercise_id: ex.exercise_id,
            }))} />
          ) : (
            <p className="text-foreground/40 text-sm">{t('noExercises')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
