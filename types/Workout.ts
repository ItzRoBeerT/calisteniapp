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

export interface RecentWorkoutData {
	name: string;
	difficulty?: string;
	exercises: Array<{
		name: string;
		sets: number;
		reps: number;
		rest: number;
		muscle_group?: string[];
		category?: string;
	}>;
}

export interface GeneratedWorkout {
	name: string;
	description: string;
	difficulty: string;
	exercises: Array<{
		exercise_id: number;
		name: string;
		sets: number;
		reps: number;
		rest: number;
	}>;
}

export interface WorkoutDetail {
	id: number;
	name: string;
	description?: string;
	difficulty?: string;
	duration?: number;
	muscle_groups?: string[];
	user_id?: string;
	username?: string;
	is_public?: boolean;
	exercises: ExerciseWorkout[];
	tags: string[];
	likes_count?: number;
	favorited_at?: string; // ISO timestamp when user favorited this workout
	created_at?: string; // ISO timestamp when workout was created
}
