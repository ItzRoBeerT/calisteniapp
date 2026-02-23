import { Exercise, ExerciseBase, ExerciseTranslation } from '@/types/supabase';

 
const exercisesData: ExerciseBase[] = require('@/data/exercises.json');

/**
 * Combina los datos base de un ejercicio con sus traducciones
 */
export function getExerciseWithTranslation(
	exerciseBase: ExerciseBase,
	translations: Record<string, ExerciseTranslation>
): Exercise {
	const translation = translations[String(exerciseBase.id)] || {
		name: `Exercise ${exerciseBase.id}`,
		description: '',
	};

	return {
		...exerciseBase,
		name: translation.name,
		description: translation.description,
	};
}

/**
 * Obtiene todos los ejercicios con traducciones aplicadas
 */
export function getExercisesWithTranslations(
	translations: Record<string, ExerciseTranslation>
): Exercise[] {
	return exercisesData.map((exercise) =>
		getExerciseWithTranslation(exercise, translations)
	);
}

/**
 * Obtiene un ejercicio por ID con traducciones
 */
export function getExerciseByIdWithTranslation(
	id: number,
	translations: Record<string, ExerciseTranslation>
): Exercise | null {
	const exercise = exercisesData.find((e) => e.id === id);
	if (!exercise) return null;
	return getExerciseWithTranslation(exercise, translations);
}

/**
 * Obtiene los datos base de los ejercicios (sin traducciones)
 */
export function getExercisesBase(): ExerciseBase[] {
	return exercisesData;
}

/**
 * Obtiene un ejercicio base por ID
 */
export function getExerciseBaseById(id: number): ExerciseBase | null {
	return exercisesData.find((e) => e.id === id) || null;
}
