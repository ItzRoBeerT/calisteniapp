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
  image?: string;
};

type ExerciseListProps = {
  exercises: Exercise[];
};

export default function ExerciseList({ exercises }: ExerciseListProps) {
  return (
    <div className="space-y-3">
      {exercises.map((exercise) => (
        <Link
          key={exercise.id}
          href={{ pathname: '/exercises/[slug]', params: { slug: createSlug(exercise.name) } }}
          className="flex items-center gap-4 border-l-4 border-primary-500 pl-4 pr-4 py-3 bg-background rounded-r-xl hover:bg-background/80 transition-colors group"
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-lg text-foreground group-hover:text-primary-400 transition-colors">
              {exercise.name}
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 text-xs bg-primary-500/20 text-primary-400 rounded-lg border border-primary-500/30">
                {exercise.sets} series
              </span>
              <span className="px-2 py-1 text-xs bg-secondary-500/20 text-secondary-400 rounded-lg border border-secondary-500/30">
                {exercise.reps} reps
              </span>
              {exercise.rest && (
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
      ))}
    </div>
  );
}
