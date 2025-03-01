'use server';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Tipo para el workout
type Exercise = {
	id?: string;
	name: string;
	sets: number;
	reps: number;
	rest: number;
};

type Workout = {
	name: string;
	difficulty: string;
	duration: number;
	description: string;
	exercises: Exercise[];
	tags: string[];
};

/**
 * Guarda un nuevo workout en Supabase
 */
export async function createWorkout(workout: Workout) {
	const supabase = await createClient();

	try {
		// 1. Insertar el workout principal
		const { data: workoutData, error: workoutError } = await supabase
			.from('Workout')
			.insert({
				name: workout.name,
				difficulty: workout.difficulty,
				duration: workout.duration,
				description: workout.description,
				tags: workout.tags,
			})
			.select()
			.single();

		if (workoutError) throw workoutError;

		// 2. Verificar que todos los ejercicios existen en la tabla Exercise
		const exerciseNames = workout.exercises.map((ex) => ex.name);
		const { data: existingExercises, error: exerciseCheckError } =
			await supabase
				.from('Exercise')
				.select('name')
				.in('name', exerciseNames);

		if (exerciseCheckError) throw exerciseCheckError;

		// Comprobar si hay algún ejercicio que no existe
		const existingNames = existingExercises.map((ex) => ex.name);
		const missingExercises = exerciseNames.filter(
			(name) => !existingNames.includes(name)
		);

		if (missingExercises.length > 0) {
			throw new Error(
				`Los siguientes ejercicios no existen en la base de datos: ${missingExercises.join(
					', '
				)}`
			);
		}

		// 3. Insertar cada ejercicio relacionado con el workout
		if (workoutData && workout.exercises.length > 0) {
			const workoutId = workoutData.id;

			// Preparar ejercicios para inserción con el ID del workout y posición
			const exercisesToInsert = workout.exercises.map(
				(exercise, index) => ({
					workout_id: workoutId,
					exercise_name: exercise.name, // Referencia a la tabla Exercise
					sets: exercise.sets,
					reps: exercise.reps,
					rest: exercise.rest || 60, // Valor predeterminado de 60 segundos si no se especifica
					position: index + 1, // Guardar la posición para mantener el orden
				})
			);

			const { error: exerciseError } = await supabase
				.from('WorkoutExercise')
				.insert(exercisesToInsert);

			if (exerciseError) throw exerciseError;
		}

		// Revalidar datos y redirigir
		revalidatePath('/workouts');
		return { success: true, workoutId: workoutData.id };
	} catch (error) {
		console.error('Error al guardar el workout:', error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'Error al guardar el workout',
		};
	}
}

/**
 * Obtiene todos los workouts con sus ejercicios
 */
export async function getWorkouts() {
	const supabase = await createClient();

	// 1. Obtener todos los workouts
	const { data: workouts, error: workoutsError } = await supabase
		.from('Workout')
		.select('*')
		.order('created_at', { ascending: false });

	if (workoutsError) {
		console.error('Error al obtener workouts:', workoutsError);
		return [];
	}

	// 2. Para cada workout, obtener sus ejercicios
	const workoutsWithExercises = await Promise.all(
		workouts.map(async (workout) => {
			// Obtener ejercicios del workout
			const { data: workoutExercises, error: exercisesError } =
				await supabase
					.from('WorkoutExercise')
					.select(
						`
          id,
          exercise_name,
          sets,
          reps,
          rest,
          position,
          Exercise (*)
        `
					)
					.eq('workout_id', workout.id)
					.order('position', { ascending: true });

			if (exercisesError) {
				console.error(
					`Error al obtener ejercicios para workout ${workout.id}:`,
					exercisesError
				);
				return { ...workout, exercises: [] };
			}

			// Transformar datos para incluir información completa del ejercicio
			const exercises = workoutExercises.map((we) => ({
				id: we.id,
				name: we.exercise_name,
				sets: we.sets,
				reps: we.reps,
				rest: we.rest,
				position: we.position,
				exerciseDetails: we.Exercise, // Detalles completos del ejercicio
			}));

			return { ...workout, exercises };
		})
	);

	return workoutsWithExercises;
}

/**
 * Obtiene un workout por su ID con sus ejercicios
 */
export async function getWorkout(id: number) {
	const supabase = await createClient();

	// 1. Obtener el workout
	const { data: workout, error: workoutError } = await supabase
		.from('Workout')
		.select('*')
		.eq('id', id)
		.single();

	if (workoutError || !workout) {
		console.error(`Error al obtener workout ${id}:`, workoutError);
		return null;
	}

	// 2. Obtener los ejercicios del workout con sus detalles
	const { data: workoutExercises, error: exercisesError } = await supabase
		.from('WorkoutExercise')
		.select(
			`
      id,
      exercise_name,
      sets,
      reps,
      rest,
      position,
      Exercise (*)
    `
		)
		.eq('workout_id', id)
		.order('position', { ascending: true });

	if (exercisesError) {
		console.error(
			`Error al obtener ejercicios para workout ${id}:`,
			exercisesError
		);
		return { ...workout, exercises: [] };
	}

	// Transformar datos para incluir información completa del ejercicio
	const exercises = workoutExercises.map((we) => ({
		id: we.id,
		name: we.exercise_name,
		sets: we.sets,
		reps: we.reps,
		rest: we.rest,
		position: we.position,
		exerciseDetails: we.Exercise, // Detalles completos del ejercicio
	}));

	return { ...workout, exercises };
}

/**
 * Actualiza un workout existente
 */
export async function updateWorkout(id: number, workout: Workout) {
	const supabase = await createClient();

	try {
		// 1. Verificar que todos los ejercicios existen en la tabla Exercise
		const exerciseNames = workout.exercises.map((ex) => ex.name);
		const { data: existingExercises, error: exerciseCheckError } =
			await supabase
				.from('Exercise')
				.select('name')
				.in('name', exerciseNames);

		if (exerciseCheckError) throw exerciseCheckError;

		// Comprobar si hay algún ejercicio que no existe
		const existingNames = existingExercises.map((ex) => ex.name);
		const missingExercises = exerciseNames.filter(
			(name) => !existingNames.includes(name)
		);

		if (missingExercises.length > 0) {
			throw new Error(
				`Los siguientes ejercicios no existen en la base de datos: ${missingExercises.join(
					', '
				)}`
			);
		}

		// 2. Actualizar datos del workout
		const { error: workoutError } = await supabase
			.from('Workout')
			.update({
				name: workout.name,
				difficulty: workout.difficulty,
				duration: workout.duration,
				description: workout.description,
				tags: workout.tags,
			})
			.eq('id', id);

		if (workoutError) throw workoutError;

		// 3. Eliminar ejercicios antiguos
		const { error: deleteError } = await supabase
			.from('WorkoutExercise')
			.delete()
			.eq('workout_id', id);

		if (deleteError) throw deleteError;

		// 4. Insertar ejercicios actualizados
		if (workout.exercises.length > 0) {
			const exercisesToInsert = workout.exercises.map(
				(exercise, index) => ({
					workout_id: id,
					exercise_name: exercise.name,
					sets: exercise.sets,
					reps: exercise.reps,
					rest: exercise.rest || 60,
					position: index + 1,
				})
			);

			const { error: exerciseError } = await supabase
				.from('WorkoutExercise')
				.insert(exercisesToInsert);

			if (exerciseError) throw exerciseError;
		}

		// Revalidar datos
		revalidatePath('/workouts');
		revalidatePath(`/workouts/${id}`);
		return { success: true };
	} catch (error) {
		console.error(`Error al actualizar workout ${id}:`, error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'Error al actualizar el workout',
		};
	}
}

/**
 * Elimina un workout por su ID (y sus ejercicios relacionados)
 */
export async function deleteWorkout(id: number) {
	const supabase = await createClient();

	try {
		// 1. Eliminar ejercicios asociados primero (suponiendo que hay restricciones de clave foránea)
		const { error: exercisesError } = await supabase
			.from('WorkoutExercise')
			.delete()
			.eq('workout_id', id);

		if (exercisesError) throw exercisesError;

		// 2. Eliminar el workout
		const { error: workoutError } = await supabase
			.from('Workout')
			.delete()
			.eq('id', id);

		if (workoutError) throw workoutError;

		// Revalidar datos
		revalidatePath('/workouts');
		return { success: true };
	} catch (error) {
		console.error(`Error al eliminar workout ${id}:`, error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'Error al eliminar el workout',
		};
	}
}
