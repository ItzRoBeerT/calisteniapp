'use server';
import { createClient } from '@/utils/supabase/server';
import { mockWorkoutDetails, mockWorkoutFilters, mockExercises } from '@/utils/mock-data';
import type { RecentWorkoutData } from '@/types/Workout';

export async function getWorkout(id: string) {
	const supabase = await createClient();

	if (!supabase) {
		const workout = mockWorkoutDetails.find((w) => w.id === Number(id));
		if (!workout) return null;

		// Enrich exercises with images from mockExercises
		const exercisesWithImages = workout.exercises.map((ex) => {
			const exerciseData = mockExercises.find((e) => e.id === ex.exercise_id);
			return {
				...ex,
				image: exerciseData?.image,
			};
		});

		return {
			...workout,
			exercises: exercisesWithImages,
		};
	}

	// Obtener el workout
	const { data: workout, error: workoutError } = await supabase
		.from('Workout')
		.select('*')
		.eq('id', id)
		.single();

	if (workoutError) {
		console.error('Error fetching workout:', workoutError.message);
		return null;
	}

	// Obtener el username del creador
	let username: string | undefined;
	if (workout.user_id) {
		const { data: profile } = await supabase
			.from('profiles')
			.select('username')
			.eq('user_id', workout.user_id)
			.single();
		username = profile?.username ?? undefined;
	}

	// Obtener los ejercicios del workout con imagen del ejercicio
	const { data: exercises, error: exercisesError } = await supabase
		.from('WorkoutExercise')
		.select('*, Exercise(image)')
		.eq('workout_id', id);

	if (exercisesError) {
		console.error('Error fetching exercises:', exercisesError.message);
	}

	// Obtener los tags del workout
	let { data: tags, error: tagsError } = await supabase
		.from('WorkoutTags')
		.select('*')
		.eq('workout_id', id);

	if (tagsError) {
		console.error('Error fetching tags:', tagsError.message);
	}

	// Formatear los ejercicios
	const formattedExercises =
		exercises?.map((item: any) => ({
			id: item.id,
			name: item.exercise_name,
			sets: item.sets,
			reps: item.reps,
			rest: item.rest,
			image: item.Exercise?.image,
		})) || [];

	// Formatear los tags
	const formattedTags = tags?.map((tag) => tag.name) || [];

	return {
		...workout,
		username,
		exercises: formattedExercises,
		tags: formattedTags,
	};
}

export async function getWorkoutsByPage(page = 1, limit = 12, filters?: any) {
	const supabase = await createClient();

	if (!supabase) {
		let filteredWorkouts = [...mockWorkoutDetails];

		// Apply filters if provided
		if (filters) {
			if (filters.difficulty) {
				filteredWorkouts = filteredWorkouts.filter(
					(w) => w.difficulty === filters.difficulty
				);
			}
			if (filters.muscleGroup) {
				filteredWorkouts = filteredWorkouts.filter(
					(w) => w.muscle_groups?.includes(filters.muscleGroup)
				);
			}
			if (filters.duration) {
				filteredWorkouts = filteredWorkouts.filter(
					(w) => w.duration === Number(filters.duration)
				);
			}
			if (filters.tag) {
				filteredWorkouts = filteredWorkouts.filter(
					(w) => w.tags?.includes(filters.tag)
				);
			}
		}

		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;
		const paginatedWorkouts = filteredWorkouts.slice(startIndex, endIndex);
		const totalPages = Math.ceil(filteredWorkouts.length / limit);

		// Enrich exercises with images
		const workoutsWithImages = paginatedWorkouts.map((workout) => ({
			...workout,
			exercises: workout.exercises.map((ex) => {
				const exerciseData = mockExercises.find((e) => e.id === ex.exercise_id);
				return {
					...ex,
					image: exerciseData?.image,
				};
			}),
		}));

		return {
			workouts: workoutsWithImages,
			totalPages,
		};
	}

	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit - 1;

	let query = supabase
		.from('Workout')
		.select('*')
		.range(startIndex, endIndex);

	// Aplicar filtros si existen
	if (filters) {
		if (filters.difficulty) {
			query = query.eq('difficulty', filters.difficulty);
		}
		if (filters.muscleGroups) {
			query = query.contains('muscle_groups', [filters.muscleGroups]);
		}
	}

	const { data, count, error } = await query;

	if (error) {
		console.error('Error fetching workouts:', error.message);
		return null;
	}

	// Calcular total de páginas
	const totalPages = count ? Math.ceil(count / limit) : 0;

	// Para cada workout, obtener los tags y exercises
	const workoutsWithDetails = await Promise.all(
		data.map(async (workout) => {
			const [{ data: tags }, { data: exercises }] = await Promise.all([
				supabase
					.from('WorkoutTags')
					.select('name')
					.eq('workout_id', workout.id),
				supabase
					.from('WorkoutExercise')
					.select('*, Exercise(image)')
					.eq('workout_id', workout.id)
					.order('order'),
			]);

			const formattedExercises =
				exercises?.map((item: any) => ({
					id: item.id,
					name: item.exercise_name,
					sets: item.sets,
					reps: item.reps,
					rest: item.rest,
					image: item.Exercise?.image,
				})) || [];

			return {
				...workout,
				tags: tags?.map((t) => t.name) || [],
				exercises: formattedExercises,
			};
		})
	);

	return {
		workouts: workoutsWithDetails,
		totalPages,
	};
}

export async function getFilteredWorkouts(filters: any, page = 1, limit = 12) {
	// Esta es esencialmente la misma función que getWorkoutsByPage pero con un nombre diferente
	// para mantener compatibilidad con el código existente
	return getWorkoutsByPage(page, limit, filters);
}

export async function getWorkoutFilters() {
	const supabase = await createClient();

	if (!supabase) {
		return mockWorkoutFilters;
	}

	// Obtener diferentes dificultades
	const { data: difficulties } = await supabase
		.from('Workout')
		.select('difficulty')
		.order('difficulty');

	const uniqueDifficulties = difficulties
		? [
				...new Set(
					difficulties.map((item) => item.difficulty).filter(Boolean)
				),
		  ]
		: [];

	// Obtener grupos musculares únicos (asumiendo que están en un array)
	const { data: muscleGroupsData } = await supabase
		.from('Workout')
		.select('muscle_groups');

	// Extraer y aplanar todos los grupos musculares de todos los workouts
	const allMuscleGroups =
		muscleGroupsData
			?.flatMap((item) => item.muscle_groups || [])
			.filter(Boolean) || [];

	// Crear un Set para obtener valores únicos
	const uniqueMuscleGroups = [...new Set(allMuscleGroups)];

	// Obtener duraciones únicas
	const { data: durationsData } = await supabase
		.from('Workout')
		.select('duration')
		.order('duration');

	const uniqueDurations = durationsData
		? [
				...new Set(
					durationsData.map((item) => item.duration).filter(Boolean)
				),
		  ]
		: [];

	// Obtener tags únicos
	const { data: tagsData } = await supabase
		.from('WorkoutTags')
		.select('name');

	const uniqueTags = tagsData
		? [...new Set(tagsData.map((item) => item.name))]
		: [];

	return {
		difficulties: uniqueDifficulties,
		muscleGroups: uniqueMuscleGroups,
		durations: uniqueDurations,
		tags: uniqueTags,
	};
}

export async function getUniqueTags(): Promise<string[]> {
	const supabase = await createClient();
	if (!supabase) return [];

	const { data } = await supabase.from('WorkoutTags').select('name');
	return data ? [...new Set(data.map((item) => item.name))] : [];
}

export async function createWorkout(workoutData: any, userId: string) {
	const supabase = await createClient();

	if (!supabase) {
		console.warn('Supabase not configured. Cannot create workout.');
		return null;
	}

	// Insertar el workout
	const { data: workout, error } = await supabase
		.from('Workout')
		.insert({
			name: workoutData.name,
			description: workoutData.description,
			difficulty: workoutData.difficulty,
			duration: workoutData.duration,
			muscle_groups: workoutData.muscleGroups,
			user_id: userId,
			is_public: workoutData.is_public ?? true,
		})
		.select()
		.single();

	if (error) {
		console.error('Error creating workout:', error.message);
		return null;
	}

	// Insertar los ejercicios
	if (workoutData.exercises && workoutData.exercises.length > 0) {
		const exercisesData = workoutData.exercises.map(
			(exercise: any, index: number) => ({
				workout_id: workout.id,
				exercise_id: exercise.id,
				exercise_name: exercise.name,
				sets: exercise.sets,
				reps: exercise.reps,
				rest: exercise.rest || 60,
				order: index,
			})
		);

		const { error: exercisesError } = await supabase
			.from('WorkoutExercise')
			.insert(exercisesData);

		if (exercisesError) {
			console.error('Error inserting exercises:', exercisesError.message);
		}
	}

	// Insertar los tags
	if (workoutData.tags && workoutData.tags.length > 0) {
		const tagsData = workoutData.tags.map((tag: string) => ({
			workout_id: workout.id,
			name: tag,
		}));

		const { error: tagsError } = await supabase
			.from('WorkoutTags')
			.insert(tagsData);

		if (tagsError) {
			console.error('Error inserting tags:', tagsError.message);
		}
	}

	return workout;
}

export async function updateWorkout(id: string, workoutData: any) {
	const supabase = await createClient();

	if (!supabase) {
		console.warn('Supabase not configured. Cannot update workout.');
		return false;
	}

	// Actualizar el workout
	const { error } = await supabase
		.from('Workout')
		.update({
			name: workoutData.name,
			description: workoutData.description,
			difficulty: workoutData.difficulty,
			duration: workoutData.duration,
			muscle_groups: workoutData.muscleGroups,
			is_public: workoutData.is_public ?? true,
		})
		.eq('id', id);

	if (error) {
		console.error('Error updating workout:', error.message);
		return false;
	}

	// Eliminar los ejercicios anteriores
	const { error: deleteExercisesError } = await supabase
		.from('WorkoutExercise')
		.delete()
		.eq('workout_id', id);

	if (deleteExercisesError) {
		console.error(
			'Error deleting exercises:',
			deleteExercisesError.message
		);
	}

	// Insertar los nuevos ejercicios
	if (workoutData.exercises && workoutData.exercises.length > 0) {
		const exercisesData = workoutData.exercises.map(
			(exercise: any, index: number) => ({
				workout_id: id,
				exercise_id: exercise.id,
				exercise_name: exercise.name,
				sets: exercise.sets,
				reps: exercise.reps,
				rest: exercise.rest || 60,
				order: index,
			})
		);

		const { error: exercisesError } = await supabase
			.from('WorkoutExercise')
			.insert(exercisesData);

		if (exercisesError) {
			console.error('Error inserting exercises:', exercisesError.message);
		}
	}

	// Eliminar los tags anteriores
	const { error: deleteTagsError } = await supabase
		.from('WorkoutTags')
		.delete()
		.eq('workout_id', id);

	if (deleteTagsError) {
		console.error('Error deleting tags:', deleteTagsError.message);
	}

	// Insertar los nuevos tags
	if (workoutData.tags && workoutData.tags.length > 0) {
		const tagsData = workoutData.tags.map((tag: string) => ({
			workout_id: id,
			name: tag,
		}));

		const { error: tagsError } = await supabase
			.from('WorkoutTags')
			.insert(tagsData);

		if (tagsError) {
			console.error('Error inserting tags:', tagsError.message);
		}
	}

	return true;
}

export async function getFavoriteWorkoutIds() {
	const supabase = await createClient();

	if (!supabase) {
		return [];
	}

	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return [];

	const { data, error } = await supabase
		.from('workout_favorites')
		.select('workout_id')
		.eq('user_id', user.id);

	if (error) {
		console.error('Error fetching favorite workouts:', error.message);
		return [];
	}

	return data?.map((f) => f.workout_id) || [];
}

export async function toggleFavoriteWorkout(workoutId: number) {
	const supabase = await createClient();

	if (!supabase) {
		return false;
	}

	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return false;

	// Check if already favorited
	const { data: existing } = await supabase
		.from('workout_favorites')
		.select('id')
		.eq('user_id', user.id)
		.eq('workout_id', workoutId)
		.single();

	if (existing) {
		// Remove favorite
		const { error } = await supabase
			.from('workout_favorites')
			.delete()
			.eq('user_id', user.id)
			.eq('workout_id', workoutId);

		if (error) {
			console.error('Error removing favorite:', error.message);
			return false;
		}
	} else {
		// Add favorite
		const { error } = await supabase
			.from('workout_favorites')
			.insert({ user_id: user.id, workout_id: workoutId });

		if (error) {
			console.error('Error adding favorite:', error.message);
			return false;
		}
	}

	return true;
}

export async function saveWorkoutCompletion(data: {
	workoutId: number;
	workoutName: string;
	durationSeconds: number;
	exercisesCount: number;
}) {
	const supabase = await createClient();

	if (!supabase) {
		return false;
	}

	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return false;

	const { error } = await supabase
		.from('workout_completions')
		.insert({
			user_id: user.id,
			workout_id: data.workoutId,
			workout_name: data.workoutName,
			duration_seconds: data.durationSeconds,
			exercises_count: data.exercisesCount,
		});

	if (error) {
		console.error('Error saving workout completion:', error.message);
		return false;
	}

	return true;
}

export async function getWorkoutCompletions() {
	const supabase = await createClient();

	if (!supabase) {
		return [];
	}

	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return [];

	const { data, error } = await supabase
		.from('workout_completions')
		.select('completed_at, workout_name, workout_id, duration_seconds, exercises_count')
		.eq('user_id', user.id)
		.order('completed_at', { ascending: false });

	if (error) {
		console.error('Error fetching workout completions:', error.message);
		return [];
	}

	return data || [];
}

// Lightweight: returns only completed_at for all completions (for heatmap grid)
export async function getCompletionDates(): Promise<{ completed_at: string }[]> {
	const supabase = await createClient();
	if (!supabase) return [];
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return [];
	const { data, error } = await supabase
		.from('workout_completions')
		.select('completed_at')
		.eq('user_id', user.id)
		.order('completed_at', { ascending: false });
	if (error) {
		console.error('Error fetching completion dates:', error.message);
		return [];
	}
	return data || [];
}

type CompletionDetail = {
	completed_at: string;
	workout_name: string;
	workout_id: number | null;
	duration_seconds: number | null;
	exercises_count: number | null;
};

// Returns full details for the next N unique calendar days before beforeCursor
export async function getCompletionDetailsPaginated(
	beforeCursor?: string,
	limit: number = 5,
): Promise<{ completions: CompletionDetail[]; hasMore: boolean }> {
	const supabase = await createClient();
	if (!supabase) return { completions: [], hasMore: false };
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return { completions: [], hasMore: false };

	const maxRows = limit * 20 + 1;
	let query = supabase
		.from('workout_completions')
		.select('completed_at, workout_name, workout_id, duration_seconds, exercises_count')
		.eq('user_id', user.id)
		.order('completed_at', { ascending: false })
		.limit(maxRows);

	if (beforeCursor) {
		query = query.lt('completed_at', beforeCursor);
	}

	const { data, error } = await query;
	if (error || !data) return { completions: [], hasMore: false };

	// Stop once we've accumulated `limit` unique UTC days
	const seenDays = new Set<string>();
	const result: CompletionDetail[] = [];
	for (const c of data) {
		seenDays.add(c.completed_at.slice(0, 10));
		if (seenDays.size > limit) {
			return { completions: result, hasMore: true };
		}
		result.push(c);
	}
	return { completions: result, hasMore: false };
}

// Returns full details for the UTC range [startISO, endISO) – caller provides range for local day
export async function getCompletionDetailsBetween(
	startISO: string,
	endISO: string,
): Promise<CompletionDetail[]> {
	const supabase = await createClient();
	if (!supabase) return [];
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return [];
	const { data, error } = await supabase
		.from('workout_completions')
		.select('completed_at, workout_name, workout_id, duration_seconds, exercises_count')
		.eq('user_id', user.id)
		.gte('completed_at', startISO)
		.lt('completed_at', endISO)
		.order('completed_at', { ascending: false });
	if (error) return [];
	return data || [];
}

export async function deleteWorkout(id: string) {
	const supabase = await createClient();

	if (!supabase) {
		console.warn('Supabase not configured. Cannot delete workout.');
		return false;
	}

	// Eliminar los ejercicios relacionados
	await supabase.from('WorkoutExercise').delete().eq('workout_id', id);

	// Eliminar los tags relacionados
	await supabase.from('WorkoutTags').delete().eq('workout_id', id);

	// Eliminar el workout
	const { error } = await supabase.from('Workout').delete().eq('id', id);

	if (error) {
		console.error('Error deleting workout:', error.message);
		return false;
	}

	return true;
}

export async function getWorkoutLikesCount(workoutId: number) {
	const supabase = await createClient();

	if (!supabase) {
		return 0;
	}

	const { count, error } = await supabase
		.from('workout_favorites')
		.select('*', { count: 'exact', head: true })
		.eq('workout_id', workoutId);

	if (error) {
		console.error('Error fetching workout likes count:', error.message);
		return 0;
	}

	return count || 0;
}

export async function getUserWorkouts() {
	const supabase = await createClient();

	if (!supabase) {
		return [];
	}

	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return [];

	// Get user's workouts ordered by creation date (newest first)
	const { data: workouts, error } = await supabase
		.from('Workout')
		.select('*')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching user workouts:', error.message);
		return [];
	}

	// Para cada workout, obtener los tags, exercises y likes count
	const workoutsWithDetails = await Promise.all(
		(workouts || []).map(async (workout) => {
			const [{ data: tags }, { data: exercises }, likesCount] = await Promise.all([
				supabase
					.from('WorkoutTags')
					.select('name')
					.eq('workout_id', workout.id),
				supabase
					.from('WorkoutExercise')
					.select('*, Exercise(image)')
					.eq('workout_id', workout.id)
					.order('order'),
				getWorkoutLikesCount(workout.id),
			]);

			const formattedExercises =
				exercises?.map((item: any) => ({
					id: item.id,
					name: item.exercise_name,
					sets: item.sets,
					reps: item.reps,
					rest: item.rest,
					image: item.Exercise?.image,
				})) || [];

			return {
				...workout,
				tags: tags?.map((t) => t.name) || [],
				exercises: formattedExercises,
				likes_count: likesCount,
			};
		})
	);

	return workoutsWithDetails;
}

export async function getFavoriteWorkoutsWithDetails() {
	const supabase = await createClient();

	if (!supabase) {
		return [];
	}

	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return [];

	// Get user's favorite workouts with the date they favorited it, ordered by favorited_at (newest first)
	const { data: favorites, error } = await supabase
		.from('workout_favorites')
		.select('workout_id, created_at')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching favorite workouts:', error.message);
		return [];
	}

	if (!favorites || favorites.length === 0) return [];

	// Get the workout details for each favorite
	const workoutsWithDetails = await Promise.all(
		favorites.map(async (fav) => {
			const { data: workout } = await supabase
				.from('Workout')
				.select('*')
				.eq('id', fav.workout_id)
				.single();

			if (!workout) return null;

			// Get tags, exercises, and likes count
			const [{ data: tags }, { data: exercises }, likesCount] = await Promise.all([
				supabase
					.from('WorkoutTags')
					.select('name')
					.eq('workout_id', workout.id),
				supabase
					.from('WorkoutExercise')
					.select('*, Exercise(image)')
					.eq('workout_id', workout.id)
					.order('order'),
				getWorkoutLikesCount(workout.id),
			]);

			const formattedExercises =
				exercises?.map((item: any) => ({
					id: item.id,
					name: item.exercise_name,
					sets: item.sets,
					reps: item.reps,
					rest: item.rest,
					image: item.Exercise?.image,
				})) || [];

			return {
				...workout,
				tags: tags?.map((t) => t.name) || [],
				exercises: formattedExercises,
				likes_count: likesCount,
				favorited_at: fav.created_at,
			};
		})
	);

	return workoutsWithDetails.filter((w) => w !== null);
}

export async function getRecentWorkoutForAI(): Promise<RecentWorkoutData | null> {
	const supabase = await createClient();
	if (!supabase) return null;

	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return null;

	// Get the most recent completed workout
	const { data: completions, error } = await supabase
		.from('workout_completions')
		.select('workout_id, workout_name')
		.eq('user_id', user.id)
		.order('completed_at', { ascending: false })
		.limit(1);

	if (error || !completions || completions.length === 0) return null;

	const recentCompletion = completions[0];

	// Fetch the full workout with exercises
	const { data: exercises } = await supabase
		.from('WorkoutExercise')
		.select('exercise_name, sets, reps, rest, exercise_id')
		.eq('workout_id', recentCompletion.workout_id);

	const { data: workout } = await supabase
		.from('Workout')
		.select('difficulty')
		.eq('id', recentCompletion.workout_id)
		.single();

	// Enrich with exercise category/muscle_group
	const exercisesWithDetails = await Promise.all(
		(exercises || []).map(async (ex) => {
			if (!ex.exercise_id) return { name: ex.exercise_name, sets: ex.sets, reps: ex.reps, rest: ex.rest };
			const { data: exerciseData } = await supabase
				.from('Exercise')
				.select('muscle_group, category')
				.eq('id', ex.exercise_id)
				.single();
			return {
				name: ex.exercise_name,
				sets: ex.sets,
				reps: ex.reps,
				rest: ex.rest,
				muscle_group: exerciseData?.muscle_group || [],
				category: exerciseData?.category,
			};
		})
	);

	return {
		name: recentCompletion.workout_name,
		difficulty: workout?.difficulty,
		exercises: exercisesWithDetails,
	};
}

export async function getWorkoutsByPageWithLikes(page = 1, limit = 12, filters?: any) {
	const supabase = await createClient();

	if (!supabase) {
		let filteredWorkouts = [...mockWorkoutDetails];

		// Apply filters if provided
		if (filters) {
			if (filters.difficulty) {
				filteredWorkouts = filteredWorkouts.filter(
					(w) => w.difficulty === filters.difficulty
				);
			}
			if (filters.muscleGroup) {
				filteredWorkouts = filteredWorkouts.filter(
					(w) => w.muscle_groups?.includes(filters.muscleGroup)
				);
			}
			if (filters.duration) {
				filteredWorkouts = filteredWorkouts.filter(
					(w) => w.duration === Number(filters.duration)
				);
			}
			if (filters.tag) {
				filteredWorkouts = filteredWorkouts.filter(
					(w) => w.tags?.includes(filters.tag)
				);
			}
		}

		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;
		const paginatedWorkouts = filteredWorkouts.slice(startIndex, endIndex);
		const totalPages = Math.ceil(filteredWorkouts.length / limit);

		// Enrich exercises with images
		const workoutsWithImages = paginatedWorkouts.map((workout) => ({
			...workout,
			exercise: workout.exercises.map((ex) => {
				const exerciseData = mockExercises.find((e) => e.id === ex.exercise_id);
				return {
					...ex,
					image: exerciseData?.image,
				};
			}),
			likes_count: 0,
		}));

		return {
			workouts: workoutsWithImages,
			totalPages,
		};
	}

	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit - 1;

	let query = supabase
		.from('Workout')
		.select('*')
		.range(startIndex, endIndex);

	// Aplicar filtros si existen
	if (filters) {
		if (filters.difficulty) {
			query = query.eq('difficulty', filters.difficulty);
		}
		if (filters.muscleGroups) {
			query = query.contains('muscle_groups', [filters.muscleGroups]);
		}
	}

	const { data, count, error } = await query;

	if (error) {
		console.error('Error fetching workouts:', error.message);
		return null;
	}

	// Calcular total de páginas
	const totalPages = count ? Math.ceil(count / limit) : 0;

	// Para cada workout, obtener los tags, exercises y likes count
	const workoutsWithDetails = await Promise.all(
		(data || []).map(async (workout) => {
			const [{ data: tags }, { data: exercises }, likesCount] = await Promise.all([
				supabase
					.from('WorkoutTags')
					.select('name')
					.eq('workout_id', workout.id),
				supabase
					.from('WorkoutExercise')
					.select('*, Exercise(image)')
					.eq('workout_id', workout.id)
					.order('order'),
				getWorkoutLikesCount(workout.id),
			]);

			const formattedExercises =
				exercises?.map((item: any) => ({
					id: item.id,
					name: item.exercise_name,
					sets: item.sets,
					reps: item.reps,
					rest: item.rest,
					image: item.Exercise?.image,
				})) || [];

			return {
				...workout,
				tags: tags?.map((t) => t.name) || [],
				exercises: formattedExercises,
				likes_count: likesCount,
			};
		})
	);

	return {
		workouts: workoutsWithDetails,
		totalPages,
	};
}
