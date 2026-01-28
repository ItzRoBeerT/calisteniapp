import React from 'react';

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest?: number;
};

type ExerciseListProps = {
  exercises: Exercise[];
};

export default function ExerciseList({ exercises }: ExerciseListProps) {
  return (
    <div className="space-y-3">
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className="border-l-4 border-primary-500 pl-4 py-3 bg-background rounded-r-xl"
        >
          <h3 className="font-medium text-lg text-foreground">{exercise.name}</h3>
          <div className="flex flex-wrap gap-3 mt-2">
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
      ))}
    </div>
  );
}