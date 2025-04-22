'use client';

import { useState } from 'react';
import { createWorkout } from '@/actions/workout';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type WorkoutFormProps = {
  userId: string;
  existingWorkout?: any;
};

export default function WorkoutForm({ userId, existingWorkout }: WorkoutFormProps) {
  const t = useTranslations('WorkoutForm');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const isEditing = !!existingWorkout;
  
  const [formState, setFormState] = useState({
    name: existingWorkout?.name || '',
    description: existingWorkout?.description || '',
    difficulty: existingWorkout?.difficulty || 'Principiante',
    duration: existingWorkout?.duration || 30,
    muscleGroups: existingWorkout?.muscle_groups || [],
    tags: existingWorkout?.tags || [],
    exercises: existingWorkout?.exercises || [],
    isSubmitting: false,
    error: ''
  });
  
  const [newTag, setNewTag] = useState('');
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: 3,
    reps: 10,
    rest: 60
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleMuscleGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    setFormState(prev => {
      const updatedGroups = checked
        ? [...prev.muscleGroups, value]
        : prev.muscleGroups.filter(group => group !== value);
      
      return { ...prev, muscleGroups: updatedGroups };
    });
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (formState.tags.includes(newTag.trim())) {
      setNewTag('');
      return;
    }
    
    setFormState(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }));
    
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormState(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddExercise = () => {
    if (!newExercise.name.trim()) return;
    
    const exerciseToAdd = {
      ...newExercise,
      id: `temp-${Date.now()}`, // Temporal ID for new exercises
    };
    
    setFormState(prev => ({
      ...prev,
      exercises: [...prev.exercises, exerciseToAdd]
    }));
    
    setNewExercise({
      name: '',
      sets: 3,
      reps: 10,
      rest: 60
    });
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setFormState(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  };

  const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    
    setFormState(prev => {
      const updatedExercises = [...prev.exercises];
      updatedExercises[index] = {
        ...updatedExercises[index],
        [name]: name === 'name' ? value : Number(value)
      };
      
      return { ...prev, exercises: updatedExercises };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, isSubmitting: true, error: '' }));
    
    try {
      const workoutData = {
        name: formState.name,
        description: formState.description,
        difficulty: formState.difficulty,
        duration: Number(formState.duration),
        muscleGroups: formState.muscleGroups,
        tags: formState.tags,
        exercises: formState.exercises
      };
      
      const result = await createWorkout(workoutData, userId);
      console.log(result)
      
      if (result) {
        // Use the correct path that includes the locale
        router.push(`/${locale}/workouts`);
        router.refresh();
      } else {
        throw new Error('Error creating workout');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormState(prev => ({ 
        ...prev, 
        error: t('submitError', 'Error al guardar el entrenamiento. Inténtalo de nuevo.'),
        isSubmitting: false
      }));
    }
  };

  const muscleGroups = [
    'Pecho', 'Espalda', 'Hombros', 'Bíceps', 'Tríceps', 
    'Cuádriceps', 'Isquiotibiales', 'Glúteos', 'Abdominales', 'Core'
  ];
  
  const difficultyLevels = ['Principiante', 'Intermedio', 'Avanzado', 'Experto'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formState.error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {formState.error}
        </div>
      )}
      
      {/* Basic Info */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('basicInfo', 'Información Básica')}</h2>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {t('name', 'Nombre')} *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formState.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            {t('description', 'Descripción')}
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formState.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              {t('difficulty', 'Dificultad')} *
            </label>
            <select
              id="difficulty"
              name="difficulty"
              required
              value={formState.difficulty}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {difficultyLevels.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              {t('duration', 'Duración (minutos)')} *
            </label>
            <input
              id="duration"
              name="duration"
              type="number"
              min="1"
              required
              value={formState.duration}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      {/* Muscle Groups */}
      <div>
        <h2 className="text-xl font-semibold mb-2">{t('muscleGroups', 'Grupos Musculares')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {muscleGroups.map(group => (
            <div key={group} className="flex items-center">
              <input
                id={`group-${group}`}
                type="checkbox"
                value={group}
                checked={formState.muscleGroups.includes(group)}
                onChange={handleMuscleGroupChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor={`group-${group}`} className="ml-2 text-sm text-gray-700">
                {group}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Tags */}
      <div>
        <h2 className="text-xl font-semibold mb-2">{t('tags', 'Etiquetas')}</h2>
        
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder={t('addTagPlaceholder', 'Añadir etiqueta...')}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            {t('add', 'Añadir')}
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {formState.tags.map(tag => (
            <span 
              key={tag} 
              className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-gray-500 hover:text-red-500"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>
      
      {/* Exercises */}
      <div>
        <h2 className="text-xl font-semibold mb-2">{t('exercises', 'Ejercicios')}</h2>
        
        <div className="p-4 border border-gray-200 rounded-md mb-4">
          <h3 className="font-medium mb-2">{t('addExercise', 'Añadir Ejercicio')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-4">
              <label htmlFor="exercise-name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('exerciseName', 'Nombre del Ejercicio')}
              </label>
              <input
                id="exercise-name"
                type="text"
                value={newExercise.name}
                onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="exercise-sets" className="block text-sm font-medium text-gray-700 mb-1">
                {t('sets', 'Series')}
              </label>
              <input
                id="exercise-sets"
                type="number"
                min="1"
                value={newExercise.sets}
                onChange={(e) => setNewExercise(prev => ({ ...prev, sets: Number(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="exercise-reps" className="block text-sm font-medium text-gray-700 mb-1">
                {t('reps', 'Repeticiones')}
              </label>
              <input
                id="exercise-reps"
                type="number"
                min="1"
                value={newExercise.reps}
                onChange={(e) => setNewExercise(prev => ({ ...prev, reps: Number(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="exercise-rest" className="block text-sm font-medium text-gray-700 mb-1">
                {t('rest', 'Descanso (segundos)')}
              </label>
              <input
                id="exercise-rest"
                type="number"
                min="0"
                value={newExercise.rest}
                onChange={(e) => setNewExercise(prev => ({ ...prev, rest: Number(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddExercise}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                {t('addExercise', 'Añadir Ejercicio')}
              </button>
            </div>
          </div>
        </div>
        
        {formState.exercises.length > 0 ? (
          <div className="space-y-3 mt-4">
            {formState.exercises.map((exercise, index) => (
              <div 
                key={exercise.id} 
                className="border border-gray-200 rounded-md p-3 flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="font-medium">{exercise.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {exercise.sets} series &times; {exercise.reps} repeticiones | {exercise.rest}s descanso
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveExercise(exercise.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  {t('remove', 'Eliminar')}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            {t('noExercises', 'No hay ejercicios agregados aún')}
          </p>
        )}
      </div>
      
      {/* Submit Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="w-full px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:bg-purple-300"
        >
          {formState.isSubmitting ? (
            <span>{t('saving', 'Guardando...')}</span>
          ) : (
            <span>
              {isEditing ? t('updateWorkout', 'Actualizar Entrenamiento') : t('createWorkout', 'Crear Entrenamiento')}
            </span>
          )}
        </button>
      </div>
    </form>
  );
}