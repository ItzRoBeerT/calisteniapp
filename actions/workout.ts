'use server';
import { createClient } from '@/utils/supabase/server';

export async function getWorkout(id: string) {
	const supabase = await createClient();

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

	// Obtener los ejercicios del workout
	const { data: exercises, error: exercisesError } = await supabase
		.from('WorkoutExercise')
		.select('*')
		.eq('workout_id', id);

	if (exercisesError) {
		console.error('Error fetching exercises:', exercisesError.message);
	}

	// Obtener los tags del workout
	const { data: tags, error: tagsError } = await supabase
		.from('WorkoutTags')
		.select('*')
		.eq('workout_id', id);

	if (tagsError) {
		console.error('Error fetching tags:', tagsError.message);
	}

	// Formatear los ejercicios
	console.log(exercises);
	const formattedExercises =
		exercises?.map((item) => ({
			id: item.id,
			name: item.exercise_name,
			sets: item.sets,
			reps: item.reps,
			rest: item.rest,
		})) || [];

	// Formatear los tags
	const formattedTags = tags?.map((tag) => tag.tag) || [];

	return {
		...workout,
		exercises: formattedExercises,
		tags: formattedTags,
	};
}

export async function getWorkoutsByPage(page = 1, limit = 12, filters?: any) {
	const supabase = await createClient();
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
			query = query.containsAny('muscle_groups', [filters.muscleGroups]);
		}
	}

	const { data, count, error } = await query;

	if (error) {
		console.error('Error fetching workouts:', error.message);
		return null;
	}

	// Calcular total de páginas
	const totalPages = count ? Math.ceil(count / limit) : 0;

	// Para cada workout, obtener los tags
	const workoutsWithTags = await Promise.all(
		data.map(async (workout) => {
			const { data: tags } = await supabase
				.from('workout_tags')
				.select('tag')
				.eq('workout_id', workout.id);

			return {
				...workout,
				tags: tags?.map((t) => t.tag) || [],
			};
		})
	);

	return {
		workouts: workoutsWithTags,
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

	// Obtener diferentes dificultades
	const { data: difficulties } = await supabase
		.from('workouts')
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
		.from('workouts')
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
		.from('workouts')
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
		.from('workout_tags')
		.select('tag');

	const uniqueTags = tagsData
		? [...new Set(tagsData.map((item) => item.tag))]
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

	// Insertar el workout
	const { data: workout, error } = await supabase
		.from('workouts')
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
				sets: exercise.sets,
				reps: exercise.reps,
				rest: exercise.rest || 60,
				order: index,
			})
		);

		const { error: exercisesError } = await supabase
			.from('workout_exercises')
			.insert(exercisesData);

		if (exercisesError) {
			console.error('Error inserting exercises:', exercisesError.message);
		}
	}

	// Insertar los tags
	if (workoutData.tags && workoutData.tags.length > 0) {
		const tagsData = workoutData.tags.map((tag: string) => ({
			workout_id: workout.id,
			tag,
		}));

		const { error: tagsError } = await supabase
			.from('workout_tags')
			.insert(tagsData);

		if (tagsError) {
			console.error('Error inserting tags:', tagsError.message);
		}
	}

	return workout;
}

export async function updateWorkout(id: string, workoutData: any) {
	const supabase = await createClient();

	// Actualizar el workout
	const { error } = await supabase
		.from('workouts')
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
		.from('workout_exercises')
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
				sets: exercise.sets,
				reps: exercise.reps,
				rest: exercise.rest || 60,
				order: index,
			})
		);

		const { error: exercisesError } = await supabase
			.from('workout_exercises')
			.insert(exercisesData);

		if (exercisesError) {
			console.error('Error inserting exercises:', exercisesError.message);
		}
	}

	// Eliminar los tags anteriores
	const { error: deleteTagsError } = await supabase
		.from('workout_tags')
		.delete()
		.eq('workout_id', id);

	if (deleteTagsError) {
		console.error('Error deleting tags:', deleteTagsError.message);
	}

	// Insertar los nuevos tags
	if (workoutData.tags && workoutData.tags.length > 0) {
		const tagsData = workoutData.tags.map((tag: string) => ({
			workout_id: id,
			tag,
		}));

		const { error: tagsError } = await supabase
			.from('workout_tags')
			.insert(tagsData);

		if (tagsError) {
			console.error('Error inserting tags:', tagsError.message);
		}
	}

	return true;
}

export async function deleteWorkout(id: string) {
	const supabase = await createClient();

	// Eliminar los ejercicios relacionados
	await supabase.from('workout_exercises').delete().eq('workout_id', id);

	// Eliminar los tags relacionados
	await supabase.from('workout_tags').delete().eq('workout_id', id);

	// Eliminar el workout
	const { error } = await supabase.from('workouts').delete().eq('id', id);

	if (error) {
		console.error('Error deleting workout:', error.message);
		return false;
	}

	return true;
}
