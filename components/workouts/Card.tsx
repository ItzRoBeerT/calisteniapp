'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import WorkoutDetailModal from './WorkoutDetailModal';
import { getDifficultyColor } from '@/utils/difficultyColors';
import { WorkoutDetail } from '@/types/Workout';
import { toggleFavoriteWorkout } from '@/actions/workout';

type WorkoutCardProps = {
  workout: WorkoutDetail;
  isOwner: boolean;
  isFavorite?: boolean;
  isAuthenticated?: boolean;
};

export default function WorkoutCard({ workout, isOwner, isFavorite: initialFavorite = false, isAuthenticated = false }: WorkoutCardProps) {
  const t = useTranslations('WorkoutCard');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const difficultyClass = getDifficultyColor(workout.difficulty);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/${locale}/workouts/${workout.id}/edit`);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/${locale}/workouts/start?id=${workout.id}`);
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTogglingFavorite) return;

    setIsTogglingFavorite(true);
    setIsFavorite((prev) => !prev);

    const success = await toggleFavoriteWorkout(workout.id);
    if (!success) {
      setIsFavorite((prev) => !prev);
    }
    setIsTogglingFavorite(false);
  };

  return (
    <article
      onClick={handleCardClick}
      className="flex flex-col gap-2 rounded-xl p-4 bg-surface hover:bg-surface/80 transition-colors cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-bold text-foreground group-hover:text-primary-500 transition-colors line-clamp-2">
          {workout.name}
        </h2>

        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated && (
            <button
              onClick={handleFavoriteClick}
              disabled={isTogglingFavorite}
              className="p-1 transition-colors"
              title={isFavorite ? t('unfavorite') : t('favorite')}
            >
              <svg
                className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-foreground/30 hover:text-red-400'}`}
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}

          {isOwner && (
            <span className="px-2 py-0.5 text-xs bg-primary-500/20 text-primary-400 rounded-full border border-primary-500/30">
              {t('yours')}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {workout.description && (
        <p className="text-foreground/60 text-sm line-clamp-1">
          {workout.description}
        </p>
      )}

      {/* Stats and Tags */}
      <div className="flex justify-between items-start gap-2 mt-3">
        <div className="flex flex-wrap gap-2">
          {workout.difficulty && (
            <span className={`px-3 py-1 text-xs font-medium rounded-lg border ${difficultyClass}`}>
              {workout.difficulty}
            </span>
          )}

          {workout.duration && (
            <span className="px-3 py-1 text-xs font-medium rounded-lg bg-tertiary-500/20 text-tertiary-400 border border-tertiary-500/30">
              <svg className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {workout.duration} min
            </span>
          )}
        </div>

        {workout.tags && workout.tags.length > 0 && (
          <div className="flex-1 flex justify-end">
            <div className="flex flex-wrap-reverse gap-2 justify-end">
              {workout.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-primary-500/10 text-primary-400 text-xs rounded-full border border-primary-500/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-4 pt-4 border-t border-foreground/10 flex gap-2">
        <button
          onClick={handlePlayClick}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          {t('play')}
        </button>

        {isOwner && (
          <button
            onClick={handleEditClick}
            className="flex-1 text-center py-2 px-3 text-sm font-medium text-tertiary-400 hover:text-tertiary-300 hover:bg-tertiary-500/10 rounded-lg transition-colors"
          >
            {t('edit')}
          </button>
        )}
      </div>

      {/* Modal */}
      <WorkoutDetailModal
        workout={workout}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isOwner={isOwner}
      />
    </article>
  );
}
