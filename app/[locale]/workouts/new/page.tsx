import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import WorkoutForm from '@/components/workouts/WorkoutForm';
import { createClient } from '@/utils/supabase/server';
import BackButton from '@/components/ui/BackButton';
import { getExercises } from '@/actions/exercise';

export const metadata: Metadata = {
  title: 'Crear Nuevo Entrenamiento',
  description: 'Crea un nuevo entrenamiento personalizado para tu rutina',
};

export default async function NewWorkoutPage() {
  const t = await getTranslations('NewWorkout');
  const supabase = await createClient();
  let userId: string | undefined;

  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    userId = session?.user.id;
  }

  const exercises = await getExercises() || [];

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton href="/workouts" label={t('backToWorkouts')} />

      <div className="mt-4">
        <h1 className="text-3xl font-bold mb-6 text-foreground">{t('title')}</h1>

        <WorkoutForm userId={userId} availableExercises={exercises} />
      </div>
    </div>
  );
}