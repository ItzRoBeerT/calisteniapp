export interface ExerciseWorkout {
	id: string | number;
	exercise_id?: number;
	name: string;
	sets: number;
	reps: number;
	rest: number;
	muscle_group?: string[];
}

export interface WorkoutFormData {
	name: string;
	description: string;
	difficulty: string;
	duration: number;
	muscleGroups: string[];
	tags: string[];
	exercises: ExerciseWorkout[];
}

export interface WorkoutDetail {
	id: number;
	name: string;
	description?: string;
	difficulty?: string;
	duration?: number;
	muscle_groups?: string[];
	user_id?: string;
	exercises: ExerciseWorkout[];
	tags: string[];
}
