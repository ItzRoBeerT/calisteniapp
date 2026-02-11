import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import WorkoutForm from '@/components/workouts/WorkoutForm';
import { createClient } from '@/utils/supabase/server';
import BackButton from '@/components/ui/BackButton';
import { getWorkout } from '@/actions/workout';
import { getExercises } from '@/actions/exercise';

type Props = {
  params: Promise<{
    id: string;
    locale: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const workout = await getWorkout(id);

  if (!workout) {
    return {
      title: 'Entrenamiento no encontrado',
    };
  }

  return {
    title: `Editar ${workout.name}`,
    description: 'Edita tu entrenamiento personalizado',
  };
}

export default async function EditWorkoutPage({ params }: Props) {
  const { id, locale } = await params;
  const t = await getTranslations('EditWorkout');
  const supabase = await createClient();
  let userId: string | undefined;

  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id;
  }

  const workout = await getWorkout(id);

  if (!workout) {
    notFound();
  }

  // Verify ownership
  if (workout.user_id !== userId) {
    redirect(`/${locale}/workouts/${id}`);
  }

  const exercises = await getExercises(locale) || [];

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton href={{ pathname: '/workouts/[id]', params: { id } }} label={t('backToWorkout')} />

      <div className="mt-4">
        <h1 className="text-3xl font-bold mb-6 text-foreground">{t('title')}</h1>

        <WorkoutForm
          userId={userId}
          existingWorkout={workout}
          availableExercises={exercises}
        />
      </div>
    </div>
  );
}
