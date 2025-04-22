import { getWorkout } from '@/actions/workout';
import ExerciseList from '@/components/workouts/ExerciseList';
import TagList from '@/components/workouts/TagList';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import BackButton from '@/components/ui/BackButton';
import { createClient } from '@/utils/supabase/server';

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const workout = await getWorkout(params.id);
  
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
  const t = await getTranslations('WorkoutDetail');
  const workout = await getWorkout(params.id);
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user.id;
  
  if (!workout) {
    notFound();
  }
  
  const isOwner = workout.user_id === userId;

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton href="/workouts" label={t('backToWorkouts', 'Volver a Entrenamientos')} />
      
      <div className="bg-surface rounded-lg shadow-md p-6 mt-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{workout.name}</h1>
          
          {isOwner && (
            <div className="flex gap-2">
              <a 
                href={`/workouts/${params.id}/edit`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                {t('edit', 'Editar')}
              </a>
              <button 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                {t('delete', 'Eliminar')}
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('description', 'Descripción')}</h2>
          <p className="text-gray-700">{workout.description || t('noDescription', 'Sin descripción')}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('difficulty', 'Dificultad')}</h2>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
            {workout.difficulty || t('notSpecified', 'No especificada')}
          </span>
        </div>
        
        {workout.duration && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{t('duration', 'Duración')}</h2>
            <p>{workout.duration} {t('minutes', 'minutos')}</p>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('exercises', 'Ejercicios')}</h2>
          {workout.exercises && workout.exercises.length > 0 ? (
            <ExerciseList exercises={workout.exercises} />
          ) : (
            <p className="text-gray-500">{t('noExercises', 'No hay ejercicios en este entrenamiento')}</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">{t('tags', 'Etiquetas')}</h2>
          {workout.tags && workout.tags.length > 0 ? (
            <TagList tags={workout.tags} />
          ) : (
            <p className="text-gray-500">{t('noTags', 'No hay etiquetas')}</p>
          )}
        </div>
      </div>
    </div>
  );
}