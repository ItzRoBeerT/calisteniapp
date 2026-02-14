import { getWorkoutsByPage, getWorkoutFilters, getFavoriteWorkoutIds } from '@/actions/workout';
import WorkoutsList from '@/components/workouts/List';
import WorkoutFilter from '@/components/workouts/Filter';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';
import { Link } from '@/i18n/navigation';

export const metadata: Metadata = {
  title: 'Entrenamientos',
  description: 'Gestiona tus entrenamientos personalizados para mejorar tu fuerza y rendimiento',
};

export default async function WorkoutsPage() {
  const supabase = await createClient();
  let userId: string | undefined;

  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id;
  }

  const [data, filters, favoriteIds] = await Promise.all([
    getWorkoutsByPage(1),
    getWorkoutFilters(),
    userId ? getFavoriteWorkoutIds() : Promise.resolve([]),
  ]);

  const t = await getTranslations('WorkoutsPage');

  return (
    <>
      <div className="flex justify-end items-center gap-4 my-4">
        {userId ? (
          <Link
            href="/workouts/new"
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl transition-colors"
          >
            {t('createWorkout')}
          </Link>
        ) : (
          <>
            <span className="text-foreground/50 text-sm">{t('loginRequired')}</span>
            <Link
              href="/login"
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl transition-colors"
            >
              {t('login')}
            </Link>
          </>
        )}
      </div>
      <section>
        <WorkoutFilter allFilters={filters} />
      </section>
      <section>
        <WorkoutsList
          totalPages={data?.totalPages || 0}
          initialWorkouts={data?.workouts || []}
          userId={userId}
          favoriteIds={favoriteIds}
        />
      </section>
    </>
  );
}
