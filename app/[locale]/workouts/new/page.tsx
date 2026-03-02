import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import WorkoutForm from '@/components/workouts/WorkoutForm';
import { createClient } from '@/utils/supabase/server';
import BackButton from '@/components/ui/BackButton';
import { getExercises } from '@/actions/exercise';
import { getRecentWorkoutForAI, getUniqueTags } from '@/actions/workout';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('NewWorkout');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NewWorkoutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('NewWorkout');
  const supabase = await createClient();
  let userId: string | undefined;

  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id;
  }

  const isAiEnabled = !!process.env.OPENAI_API_KEY;

  const [exercises, recentWorkout, availableTags] = await Promise.all([
    getExercises(locale).then((r) => r || []),
    isAiEnabled ? getRecentWorkoutForAI() : Promise.resolve(null),
    getUniqueTags(),
  ]);

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton href="/workouts" label={t('backToWorkouts')} />

      <div className="mt-4">
        <h1 className="text-3xl font-bold mb-6 text-foreground">{t('title')}</h1>

        <WorkoutForm userId={userId} availableExercises={exercises} recentWorkout={recentWorkout} isAiEnabled={isAiEnabled} availableTags={availableTags} />
      </div>
    </div>
  );
}