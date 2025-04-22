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
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user.id;
  
  const data = await getWorkoutsByPage(1);
  const filters = await getWorkoutFilters();
  
  const t = await getTranslations('WorkoutsPage');

  return (
    <>
      <h1 className="text-4xl text-center font-bold">
        {t('title')}
      </h1>
      <div className="flex justify-end my-4">
        <Link 
          href="/workouts/new" 
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          {t('createWorkout', 'Crear Entrenamiento')}
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