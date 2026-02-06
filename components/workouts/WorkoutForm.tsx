'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { createWorkout, updateWorkout } from '@/actions/workout';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Exercise } from '@/types/supabase';
import { ExerciseWorkout, WorkoutDetail } from '@/types/Workout';

type WorkoutFormProps = {
  userId?: string;
  existingWorkout?: WorkoutDetail;
  availableExercises: Exercise[];
};

export default function WorkoutForm({ userId, existingWorkout, availableExercises }: WorkoutFormProps) {
  const t = useTranslations('WorkoutForm');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const isEditing = !!existingWorkout;

  const [formState, setFormState] = useState({
    name: existingWorkout?.name || '',
    description: existingWorkout?.description || '',
    difficulty: existingWorkout?.difficulty || 'Beginner',
    tags: existingWorkout?.tags || [],
    exercises: existingWorkout?.exercises || [] as ExerciseWorkout[],
    isSubmitting: false,
    error: ''
  });

  const [newTag, setNewTag] = useState('');

  // Autocomplete state
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate muscle groups from exercises
  const calculatedMuscleGroups = useMemo(() => {
    const allMuscles = formState.exercises.flatMap(ex => ex.muscle_group || []);
    return [...new Set(allMuscles)];
  }, [formState.exercises]);

  // Calculate duration from exercises
  // Formula: (4 seconds per rep * reps * sets) + (rest * sets) for each exercise
  const calculatedDuration = useMemo(() => {
    const totalSeconds = formState.exercises.reduce((total, ex) => {
      const exerciseTime = (4 * ex.reps * ex.sets) + (ex.rest * ex.sets);
      return total + exerciseTime;
    }, 0);
    return Math.ceil(totalSeconds / 60); // Convert to minutes
  }, [formState.exercises]);

  // Filter exercises based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = availableExercises.filter(
        exercise =>
          exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !formState.exercises.some(e => e.exercise_id === exercise.id)
      );
      setFilteredExercises(filtered);
      setShowDropdown(true);
    } else {
      setFilteredExercises([]);
      setShowDropdown(false);
    }
  }, [searchQuery, availableExercises, formState.exercises]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
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

  const handleSelectExercise = (exercise: Exercise) => {
    const exerciseToAdd: ExerciseWorkout = {
      id: `new-${Date.now()}`,
      exercise_id: exercise.id,
      name: exercise.name,
      sets: 3,
      reps: 10,
      rest: 60,
      muscle_group: exercise.muscle_group || []
    };

    setFormState(prev => ({
      ...prev,
      exercises: [...prev.exercises, exerciseToAdd]
    }));

    setSearchQuery('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleRemoveExercise = (exerciseId: string | number) => {
    setFormState(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  };

  const handleExerciseFieldChange = (index: number, field: 'sets' | 'reps' | 'rest', value: number) => {
    setFormState(prev => {
      const updatedExercises = [...prev.exercises];
      updatedExercises[index] = {
        ...updatedExercises[index],
        [field]: value
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
        duration: calculatedDuration,
        muscleGroups: calculatedMuscleGroups,
        tags: formState.tags,
        exercises: formState.exercises.map(ex => ({
          id: ex.exercise_id || ex.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          rest: ex.rest
        }))
      };

      let result;
      if (isEditing && existingWorkout) {
        result = await updateWorkout(String(existingWorkout.id), workoutData);
        if (result) {
          router.push(`/${locale}/workouts/${existingWorkout.id}`);
          router.refresh();
        } else {
          throw new Error('Error updating workout');
        }
      } else {
        if (!userId) {
          throw new Error('User not authenticated');
        }
        result = await createWorkout(workoutData, userId);
        if (result) {
          router.push(`/${locale}/workouts`);
          router.refresh();
        } else {
          throw new Error('Error creating workout');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormState(prev => ({
        ...prev,
        error: t('submitError'),
        isSubmitting: false
      }));
    }
  };

  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formState.error && (
        <div className="p-4 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">
          {formState.error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-surface rounded-xl p-4 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">{t('basicInfo')}</h2>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-1">
            {t('name')} *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formState.name}
            onChange={handleChange}
            className="w-full p-2 border border-foreground/20 bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground/80 mb-1">
            {t('description')}
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formState.description}
            onChange={handleChange}
            className="w-full p-2 border border-foreground/20 bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-foreground/80 mb-1">
            {t('difficulty')} *
          </label>
          <select
            id="difficulty"
            name="difficulty"
            required
            value={formState.difficulty}
            onChange={handleChange}
            className="w-full p-2 border border-foreground/20 bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {difficultyLevels.map(level => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-surface rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-3 text-foreground">{t('tags')}</h2>

        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder={t('addTagPlaceholder')}
            className="flex-1 p-2 border border-foreground/20 bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-foreground/40"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            {t('add')}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {formState.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 bg-primary-500/20 text-primary-300 text-sm rounded-full border border-primary-500/30"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-primary-300 hover:text-red-400"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Exercises */}
      <div className="bg-surface rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-3 text-foreground">{t('exercises')}</h2>

        {/* Exercise Autocomplete */}
        <div className="relative mb-4" ref={dropdownRef}>
          <label htmlFor="exercise-search" className="block text-sm font-medium text-foreground/80 mb-1">
            {t('searchExercise')}
          </label>
          <input
            ref={inputRef}
            id="exercise-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery.trim()) setShowDropdown(true);
            }}
            placeholder={t('searchExercisePlaceholder')}
            className="w-full p-2 border border-foreground/20 bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-foreground/40"
          />

          {/* Dropdown */}
          {showDropdown && filteredExercises.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-surface border border-foreground/20 rounded-xl shadow-lg max-h-60 overflow-auto">
              {filteredExercises.map(exercise => (
                <button
                  key={exercise.id}
                  type="button"
                  onClick={() => handleSelectExercise(exercise)}
                  className="w-full px-4 py-2 text-left text-foreground hover:bg-primary-500/20 focus:bg-primary-500/20 focus:outline-none first:rounded-t-xl last:rounded-b-xl"
                >
                  <div className="font-medium">{exercise.name}</div>
                  {exercise.muscle_group && exercise.muscle_group.length > 0 && (
                    <div className="text-xs text-foreground/60 mt-0.5">
                      {exercise.muscle_group.join(', ')}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {showDropdown && searchQuery.trim() && filteredExercises.length === 0 && (
            <div className="absolute z-10 w-full mt-1 bg-surface border border-foreground/20 rounded-xl shadow-lg p-4 text-foreground/60 text-center">
              {t('noExercisesFound')}
            </div>
          )}
        </div>

        {/* Selected Exercises List */}
        {formState.exercises.length > 0 ? (
          <div className="space-y-3">
            {formState.exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="border border-foreground/10 bg-background rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium text-lg text-foreground">{exercise.name}</div>
                    {exercise.muscle_group && exercise.muscle_group.length > 0 && (
                      <div className="text-xs text-foreground/60 mt-0.5">
                        {exercise.muscle_group.join(', ')}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(exercise.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    {t('remove')}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground/60 mb-1">
                      {t('sets')}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={exercise.sets}
                      onChange={(e) => handleExerciseFieldChange(index, 'sets', Number(e.target.value))}
                      className="w-full p-2 border border-foreground/20 bg-surface text-foreground rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/60 mb-1">
                      {t('reps')}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={exercise.reps}
                      onChange={(e) => handleExerciseFieldChange(index, 'reps', Number(e.target.value))}
                      className="w-full p-2 border border-foreground/20 bg-surface text-foreground rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/60 mb-1">
                      {t('rest')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={exercise.rest}
                      onChange={(e) => handleExerciseFieldChange(index, 'rest', Number(e.target.value))}
                      className="w-full p-2 border border-foreground/20 bg-surface text-foreground rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-foreground/40 italic">
            {t('noExercises')}
          </p>
        )}
      </div>

      {/* Calculated Stats */}
      {formState.exercises.length > 0 && (
        <div className="p-4 bg-surface border border-foreground/10 rounded-xl">
          <h3 className="text-lg font-semibold mb-3 text-foreground">{t('calculatedStats')}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Duration */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-tertiary-500/20 rounded-lg">
                <svg className="w-5 h-5 text-tertiary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-foreground/60">{t('estimatedDuration')}</div>
                <div className="text-xl font-bold text-foreground">{calculatedDuration} min</div>
              </div>
            </div>

            {/* Muscle Groups */}
            <div>
              <div className="text-sm text-foreground/60 mb-2">{t('muscleGroups')}</div>
              {calculatedMuscleGroups.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {calculatedMuscleGroups.map(muscle => (
                    <span
                      key={muscle}
                      className="px-2 py-1 text-xs bg-primary-500/20 text-primary-300 rounded-full border border-primary-500/30"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-foreground/40 text-sm">{t('noMuscleGroups')}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4 border-t border-foreground/10">
        <button
          type="submit"
          disabled={formState.isSubmitting || formState.exercises.length === 0}
          className="w-full px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:bg-foreground/20 disabled:text-foreground/40 disabled:cursor-not-allowed"
        >
          {formState.isSubmitting ? (
            <span>{t('saving')}</span>
          ) : (
            <span>
              {isEditing ? t('updateWorkout') : t('createWorkout')}
            </span>
          )}
        </button>
        {formState.exercises.length === 0 && (
          <p className="text-center text-foreground/40 text-sm mt-2">
            {t('addExercisesToSave')}
          </p>
        )}
      </div>
    </form>
  );
}
