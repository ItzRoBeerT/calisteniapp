import { getWorkout } from '@/actions/workout';
import ExerciseList from '@/components/workouts/ExerciseList';
import TagList from '@/components/workouts/TagList';
import DeleteWorkoutButton from '@/components/workouts/DeleteWorkoutButton';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import BackButton from '@/components/ui/BackButton';
import { createClient } from '@/utils/supabase/server';
import { Link } from '@/i18n/navigation';
import { getDifficultyColor } from '@/utils/difficultyColors';

type Props = {
  params: Promise<{
    id: string;
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
    title: `${workout.name} | Entrenamiento`,
    description: workout.description || 'Detalles del entrenamiento',
  };
}

export default async function WorkoutDetailPage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations('WorkoutDetail');
  const workout = await getWorkout(id);
  const supabase = await createClient();
  let userId: string | undefined;

  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    userId = session?.user.id;
  }

  if (!workout) {
    notFound();
  }

  const isOwner = workout.user_id === userId;

  const difficultyClass = getDifficultyColor(workout.difficulty);

  return (
    <div className="max-w-4xl mx-auto">

      <div className="bg-surface rounded-xl p-6 mt-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">{workout.name}</h1>

          {isOwner && (
            <div className="flex gap-2">
              <Link
                href={`/workouts/${id}/edit`}
                className="bg-tertiary-500/20 hover:bg-tertiary-500/30 text-tertiary-400 px-4 py-2 rounded-lg border border-tertiary-500/30 transition-colors"
              >
                {t('edit')}
              </Link>
              <DeleteWorkoutButton workoutId={workout.id} workoutName={workout.name} />
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-foreground/70">{workout.description || t('noDescription')}</p>
        </div>

        <div className="mb-6 flex justify-between items-start gap-6">
          <div className="flex gap-4">
            <span className={`px-3 py-1 rounded-full border ${difficultyClass}`}>
              {workout.difficulty || t('notSpecified')}
            </span>
            {workout.duration && (
              <span className="px-3 py-1 bg-tertiary-500/20 text-tertiary-400 rounded-full border border-tertiary-500/30">
                {workout.duration} {t('minutes')}
              </span>
            )}
          </div>

          <div>
            {workout.tags && workout.tags.length > 0 ? (
              <TagList tags={workout.tags} />
            ) : (
              <p className="text-foreground/40">{t('noTags')}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          {workout.exercises && workout.exercises.length > 0 ? (
            <ExerciseList exercises={workout.exercises} />
          ) : (
            <p className="text-foreground/40">{t('noExercises')}</p>
          )}
        </div>
      <BackButton href="/workouts" label={t('backToWorkouts')} />
      </div>
    </div>
  );
}
