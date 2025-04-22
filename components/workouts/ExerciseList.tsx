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
    <div className="space-y-4">
      {exercises.map((exercise) => (
        <div 
          key={exercise.id} 
          className="border-l-4 border-purple-500 pl-4 py-2 bg-surface rounded-r-md"
        >
          <h3 className="font-medium text-lg">{exercise.name}</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1 text-sm text-gray-600">
            <div>
              <span className="font-semibold">Series:</span> {exercise.sets}
            </div>
            <div>
              <span className="font-semibold">Repeticiones:</span> {exercise.reps}
            </div>
            {exercise.rest && (
              <div>
                <span className="font-semibold">Descanso:</span> {exercise.rest}s
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}