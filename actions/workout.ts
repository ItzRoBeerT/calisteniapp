'use server';
import { createClient } from '@/utils/supabase/server';
import { mockWorkoutDetails, mockWorkoutFilters, mockExercises } from '@/utils/mock-data';

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
