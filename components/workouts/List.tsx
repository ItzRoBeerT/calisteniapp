'use client';

import { useState, useEffect } from 'react';
import WorkoutCard from './Card';
import Paginator from '@/components/pagination/Paginator';
import { getWorkoutsByPage } from '@/actions/workout';
import Loader from '@/components/styles/Loader';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

type WorkoutsListProps = {
  initialWorkouts: any[];
  totalPages: number;
  userId?: string;
};

export default function WorkoutsList({ initialWorkouts, totalPages, userId }: WorkoutsListProps) {
  const t = useTranslations('WorkoutsPage');
  const [workouts, setWorkouts] = useState<any[]>(initialWorkouts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPagesState, setTotalPagesState] = useState(totalPages);

  const loadWorkouts = async (page: number) => {
    setIsLoading(true);
    try {
      const data = await getWorkoutsByPage(page);
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

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader />
        </div>
      ) : workouts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">{t('noWorkouts')}</p>
          <Link 
            href="/workouts/new" 
            className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            {t('createNewWorkout')}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {workouts.map((workout) => (
              <WorkoutCard 
                key={workout.id} 
                workout={workout} 
                isOwner={userId === workout.user_id}
              />
            ))}
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