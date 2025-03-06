export interface ExerciseWorkout {
	id: string | number;
	name: string;
	sets: number;
	reps: number;
	rest?: number;
}
