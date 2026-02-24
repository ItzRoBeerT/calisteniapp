'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Exercise } from '@/types/supabase';
import type { RecentWorkoutData, GeneratedWorkout } from '@/types/Workout';

type WorkoutType = 'push' | 'pull' | 'legs' | 'full_body';
type DifficultyAdjustment = 'easier' | 'same' | 'harder';

type Props = {
  availableExercises: Exercise[];
  recentWorkout?: RecentWorkoutData | null;
  locale: string;
  onGenerate: (workout: GeneratedWorkout) => void;
};

export default function AIWorkoutGenerator({ availableExercises, recentWorkout, locale, onGenerate }: Props) {
  const t = useTranslations('AIWorkoutGenerator');

  const [isOpen, setIsOpen] = useState(false);
  const [workoutType, setWorkoutType] = useState<WorkoutType>('push');
  const [difficultyAdjustment, setDifficultyAdjustment] = useState<DifficultyAdjustment>('same');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const workoutTypes: { value: WorkoutType; label: string }[] = [
    { value: 'push', label: t('push') },
    { value: 'pull', label: t('pull') },
    { value: 'legs', label: t('legs') },
    { value: 'full_body', label: t('fullBody') },
  ];

  const adjustments: { value: DifficultyAdjustment; label: string }[] = [
    { value: 'easier', label: t('easier') },
    { value: 'same', label: t('same') },
    { value: 'harder', label: t('harder') },
  ];

  async function handleGenerate() {
    setIsGenerating(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/ai-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercises: availableExercises.map((ex) => ({
            id: ex.id,
            name: ex.name,
            category: ex.category,
            muscle_group: ex.muscle_group,
            difficulty: ex.difficulty,
          })),
          recentWorkout,
          workoutType,
          difficultyAdjustment,
          locale,
        }),
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      const workout: GeneratedWorkout = await res.json();
      onGenerate(workout);
      setSuccessMessage(t('generatedInfo'));
      setIsOpen(false);
    } catch {
      setError(t('error'));
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="bg-surface rounded-xl border border-primary-500/30 overflow-hidden mb-6">
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-primary-500/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">✨</span>
          <span className="font-semibold text-foreground">{t('title')}</span>
          <span className="text-xs text-foreground/50 hidden sm:inline">{t('subtitle')}</span>
        </div>
        <svg
          className={`w-5 h-5 text-foreground/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Panel content */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-4 border-t border-foreground/10">
          {/* Recent workout info */}
          {recentWorkout && (
            <p className="text-xs text-foreground/50 pt-3">
              {t('basedOn', { name: recentWorkout.name })}
            </p>
          )}

          {/* Workout type selector */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              {t('workoutType')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {workoutTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setWorkoutType(type.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    workoutType === type.value
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-background text-foreground/70 border-foreground/20 hover:border-primary-500/50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty adjustment (only if history exists) */}
          {recentWorkout && (
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                {t('difficultyAdjustment')}
              </label>
              <div className="flex gap-2">
                {adjustments.map((adj) => (
                  <button
                    key={adj.value}
                    type="button"
                    onClick={() => setDifficultyAdjustment(adj.value)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      difficultyAdjustment === adj.value
                        ? adj.value === 'easier'
                          ? 'bg-blue-500 text-white border-blue-500'
                          : adj.value === 'harder'
                          ? 'bg-red-500 text-white border-red-500'
                          : 'bg-primary-500 text-white border-primary-500'
                        : 'bg-background text-foreground/70 border-foreground/20 hover:border-primary-500/50'
                    }`}
                  >
                    {adj.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          {/* Generate button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full px-4 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:bg-foreground/20 disabled:text-foreground/40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('generating')}
              </>
            ) : (
              <>
                <span>✨</span>
                {t('generate')}
              </>
            )}
          </button>
        </div>
      )}

      {/* Success banner (shown outside the open panel) */}
      {successMessage && !isOpen && (
        <div className="px-4 py-2 bg-green-500/10 border-t border-green-500/20 text-green-400 text-sm">
          {successMessage}
        </div>
      )}
    </div>
  );
}
