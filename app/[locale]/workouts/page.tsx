import { getWorkoutsByPage, getWorkoutFilters } from '@/actions/workout';
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
    const { data: { session } } = await supabase.auth.getSession();
    userId = session?.user.id;
  }
  
  const data = await getWorkoutsByPage(1);
  const filters = await getWorkoutFilters();
  
  const t = await getTranslations('WorkoutsPage');

  return (
    <>
      <div className="flex justify-end my-4">
        <Link
          href="/workouts/new"
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl transition-colors"
        >
          {t('createWorkout')}
        </Link>
      </div>
      <section>
        <WorkoutFilter allFilters={filters} />
      </section>
      <section>
        <WorkoutsList
          totalPages={data?.totalPages || 0}
          initialWorkouts={data?.workouts || []}
          userId={userId}
        />
      </section>
    </>
  );
}