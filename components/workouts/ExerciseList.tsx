'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { createSlug } from '@/utils/slugs';
import DefaultImage from '@/public/images/default_image.webp';

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest?: number;
  rir?: number | null;
  superset_group?: string | null;
  image?: string;
};

type ExerciseListProps = {
  exercises: Exercise[];
};

export default function ExerciseList({ exercises }: ExerciseListProps) {
  // Assign superset labels (A, B, C…) per group, in order of first appearance
  const supersetLabels: Record<string, string> = {};
  let labelCounter = 0;
  exercises.forEach((ex) => {
    if (ex.superset_group && !(ex.superset_group in supersetLabels)) {
      supersetLabels[ex.superset_group] = String.fromCharCode(65 + labelCounter++);
    }
  });

  return (
    <div className="space-y-3">
      {exercises.map((exercise) => {
        const supersetLabel = exercise.superset_group ? supersetLabels[exercise.superset_group] : null;
        return (
          <Link
            key={exercise.id}
            href={{ pathname: '/exercises/[slug]', params: { slug: createSlug(exercise.name) } }}
            className={`flex items-center gap-4 pl-4 pr-4 py-3 bg-background rounded-r-xl hover:bg-background/80 transition-colors group border-l-4 ${
              supersetLabel ? 'border-secondary-500' : 'border-primary-500'
            }`}
          >
            <div className="flex-1 min-w-0">
              {supersetLabel && (
                <span className="inline-block text-xs font-semibold text-secondary-400 bg-secondary-500/15 border border-secondary-500/30 px-2 py-0.5 rounded-full mb-1">
                  Superserie {supersetLabel}
                </span>
              )}
              <h3 className="font-medium text-lg text-foreground group-hover:text-primary-400 transition-colors">
                {exercise.name}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 text-xs bg-primary-500/20 text-primary-400 rounded-lg border border-primary-500/30">
                  {exercise.sets} series
                </span>
                {exercise.rir != null ? (
                  <span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-400 rounded-lg border border-orange-500/30">
                    RIR {exercise.rir === 0 ? 'al fallo' : exercise.rir}
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs bg-secondary-500/20 text-secondary-400 rounded-lg border border-secondary-500/30">
                    {exercise.reps} reps
                  </span>
                )}
                {exercise.rest != null && exercise.rest > 0 && (
                  <span className="px-2 py-1 text-xs bg-tertiary-500/20 text-tertiary-400 rounded-lg border border-tertiary-500/30">
                    {exercise.rest}s descanso
                  </span>
                )}
              </div>
            </div>
            <div className="shrink-0">
              <Image
                src={exercise.image || DefaultImage}
                alt={exercise.name}
                width={80}
                height={80}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
