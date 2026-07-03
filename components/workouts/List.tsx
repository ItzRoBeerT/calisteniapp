'use client';

import { useEffect, useState } from 'react';
import WorkoutCard from './Card';
import Paginator from '@/components/pagination/Paginator';
import { getWorkoutsByPageWithLikes } from '@/actions/workout';
import Loader from '@/components/styles/Loader';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { WorkoutDetail } from '@/types/Workout';
import { useSearchParams } from 'next/navigation';

type WorkoutsListProps = {
  initialWorkouts: unknown[];
  totalPages: number;
  userId?: string;
  favoriteIds?: number[];
};

export default function WorkoutsList({ initialWorkouts, totalPages, userId, favoriteIds = [] }: WorkoutsListProps) {
  const t = useTranslations('WorkoutsPage');
  const searchParams = useSearchParams();
  const [workouts, setWorkouts] = useState<unknown[]>(initialWorkouts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPagesState, setTotalPagesState] = useState(totalPages);

  useEffect(() => {
    setWorkouts(initialWorkouts);
    setTotalPagesState(totalPages);
    setCurrentPage(1);
  }, [initialWorkouts, totalPages]);

  const getActiveFilters = () => ({
    difficulty: searchParams.get('difficulty') || undefined,
    muscleGroup: searchParams.get('muscleGroup') || undefined,
    duration: searchParams.get('duration') || undefined,
    tag: searchParams.get('tag') || undefined,
  });

  const loadWorkouts = async (page: number) => {
    setIsLoading(true);
    try {
      const data = await getWorkoutsByPageWithLikes(page, 12, getActiveFilters());
      if (data) {
        setWorkouts(data.workouts);
        setTotalPagesState(data.totalPages);
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadWorkouts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sort workouts: favorites first
  const sortedWorkouts = [...workouts].sort((a, b) => {
    const wA = a as unknown as WorkoutDetail;
    const wB = b as unknown as WorkoutDetail;
    const aIsFav = favoriteIds.includes(wA.id);
    const bIsFav = favoriteIds.includes(wB.id);
    if (aIsFav && !bIsFav) return -1;
    if (!aIsFav && bIsFav) return 1;
    return 0;
  });

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader />
        </div>
      ) : workouts.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface mb-4">
            <svg className="w-8 h-8 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-lg text-foreground/60 mb-4">{t('noWorkouts')}</p>
          {userId ? (
            <Link
              href="/workouts/new"
              className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('createNewWorkout')}
            </Link>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <p className="text-foreground/50">{t('loginRequired')}</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl transition-colors font-medium"
              >
                {t('login')}
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            {sortedWorkouts.map((workout) => {
              const w = workout as unknown as WorkoutDetail;
              return (
                <WorkoutCard
                  key={w.id}
                  workout={w}
                  isOwner={userId === (w as unknown as { user_id?: string }).user_id}
                  isFavorite={favoriteIds.includes(w.id)}
                  isAuthenticated={!!userId}
                />
              );
            })}
          </div>

          {totalPagesState > 1 && (
            <div className="mt-8">
              <Paginator
                currentPage={currentPage}
                totalPages={totalPagesState}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
