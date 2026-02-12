export interface ExerciseWorkout {
	id: string | number;
	exercise_id?: number;
	name: string;
	sets: number;
	reps: number;
	rest: number;
	muscle_group?: string[];
	image?: string;
}

export interface WorkoutFormData {
	name: string;
	description: string;
	difficulty: string;
	duration: number;
	muscleGroups: string[];
	tags: string[];
	exercises: ExerciseWorkout[];
	is_public: boolean;
}

export interface WorkoutDetail {
	id: number;
	name: string;
	description?: string;
	difficulty?: string;
	duration?: number;
	muscle_groups?: string[];
	user_id?: string;
	is_public?: boolean;
	exercises: ExerciseWorkout[];
	tags: string[];
}
