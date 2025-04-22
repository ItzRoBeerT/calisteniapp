import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import WorkoutForm from '@/components/workouts/WorkoutForm';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import BackButton from '@/components/ui/BackButton';

export const metadata: Metadata = {
  title: 'Crear Nuevo Entrenamiento',
  description: 'Crea un nuevo entrenamiento personalizado para tu rutina',
};

export default async function NewWorkoutPage() {
  const t = await getTranslations('NewWorkout');
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user.id;
  

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton href="/workouts" label={t('backToWorkouts', 'Volver a Entrenamientos')} />
      
      <div className="bg-surface rounded-lg shadow-md p-6 mt-4">
        <h1 className="text-3xl font-bold mb-6">{t('title', 'Crear Nuevo Entrenamiento')}</h1>
        
        <WorkoutForm userId={userId} />
      </div>
    </div>
  );
}