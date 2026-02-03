import { mockExercises } from './mock-data';
import { getProgressionByExerciseId } from '@/data/exerciseProgressions';
import type { Exercise } from '@/types/supabase';

export interface ExerciseProgressionData {
	current: Exercise;
	prerequisites: Exercise[];
	variations: Exercise[];
	progressions: Exercise[];
}

/**
 * Obtiene los datos completos de progresión de un ejercicio.
 * Incluye el ejercicio actual, sus prerrequisitos, variaciones y progresiones.
 */
export function getExerciseProgressionData(exerciseId: number): ExerciseProgressionData | null {
	const currentExercise = mockExercises.find((e) => e.id === exerciseId);
	if (!currentExercise) return null;

	const progression = getProgressionByExerciseId(exerciseId);
	if (!progression) {
		// Si no hay progresión definida, retorna solo el ejercicio actual
		return {
			current: currentExercise,
			prerequisites: [],
			variations: [],
			progressions: [],
		};
	}

	// Obtener ejercicios por IDs manteniendo el orden
	const getExercisesByIds = (ids: number[]): Exercise[] => {
		return ids
			.map((id) => mockExercises.find((e) => e.id === id))
			.filter((e): e is Exercise & { difficulty: number; muscle_group: string[] } => e !== undefined);
	};

	return {
		current: currentExercise,
		prerequisites: getExercisesByIds(progression.prerequisites),
		variations: getExercisesByIds(progression.variations),
		progressions: getExercisesByIds(progression.progressions),
	};
}

/**
 * Verifica si un ejercicio tiene progresiones definidas.
 */
export function hasProgressions(exerciseId: number): boolean {
	const progression = getProgressionByExerciseId(exerciseId);
	if (!progression) return false;
	return (
		progression.prerequisites.length > 0 ||
		progression.variations.length > 0 ||
		progression.progressions.length > 0
	);
}

/**
 * Obtiene el color según la dificultad del ejercicio.
 */
export function getDifficultyColor(difficulty: number): string {
	switch (difficulty) {
		case 0:
			return '#4CAF50'; // Verde - Muy fácil
		case 1:
			return '#8BC34A'; // Verde claro - Fácil
		case 2:
			return '#FFC107'; // Amarillo - Intermedio
		case 3:
			return '#FF9800'; // Naranja - Difícil
		case 4:
			return '#FF5722'; // Naranja oscuro - Muy difícil
		case 5:
			return '#F44336'; // Rojo - Experto
		default:
			return '#9E9E9E'; // Gris
	}
}

/**
 * Obtiene el texto de dificultad según el nivel.
 */
export function getDifficultyLabel(difficulty: number): string {
	switch (difficulty) {
		case 0:
			return 'Muy fácil';
		case 1:
			return 'Fácil';
		case 2:
			return 'Intermedio';
		case 3:
			return 'Difícil';
		case 4:
			return 'Muy difícil';
		case 5:
			return 'Experto';
		default:
			return 'Desconocido';
	}
}
