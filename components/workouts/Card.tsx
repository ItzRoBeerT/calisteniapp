'use client';

import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import TagList from './TagList';
import { difficultyColors } from '@/utils/difficultyColors';

type WorkoutCardProps = {
  workout: {
    id: string;
    name: string;
    description?: string;
    difficulty?: string;
    duration?: number;
    tags?: string[];
    user_id: string;
  };
  isOwner: boolean;
};

export default function WorkoutCard({ workout, isOwner }: WorkoutCardProps) {
  const t = useTranslations('WorkoutCard');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const difficultyClass = workout.difficulty
    ? difficultyColors[workout.difficulty] || 'bg-primary-500/20 text-primary-400 border-primary-500/30'
    : '';

  const handleCardClick = () => {
    router.push(`/${locale}/workouts/${workout.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/${locale}/workouts/${workout.id}/edit`);
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

        {isOwner && (
          <span className="shrink-0 px-2 py-0.5 text-xs bg-primary-500/20 text-primary-400 rounded-full border border-primary-500/30">
            {t('yours')}
          </span>
        )}
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
            <div className="flex flex-wrap-reverse gap-2">
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

      {/* Edit button - only for owners */}
      {isOwner && (
        <div className="mt-4 pt-4 border-t border-foreground/10">
          <button
            onClick={handleEditClick}
            className="w-full text-center py-2 px-3 text-sm font-medium text-tertiary-400 hover:text-tertiary-300 hover:bg-tertiary-500/10 rounded-lg transition-colors"
          >
            {t('edit')}
          </button>
        </div>
      )}
    </article>
  );
}
