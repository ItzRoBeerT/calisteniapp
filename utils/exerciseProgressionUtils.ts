import { getMockExercises } from './mock-data';
import { getProgressionByExerciseId, type ExerciseProgression } from '@/data/exerciseProgressions';
import type { Exercise } from '@/types/supabase';

// A group of exercises that can be variations of each other at the same level
export type PrerequisiteGroup = Exercise[];

/**
 * Groups prerequisites that are variations of each other.
 * For example, if prerequisites are [26, 10, 27, 28] and 27 and 28 are variations,
 * returns [[26], [10], [27, 28]] so they can be displayed side by side.
 */
function groupPrerequisitesByVariations(
	prerequisiteIds: number[],
	exercises: Exercise[]
): PrerequisiteGroup[] {
	const groups: PrerequisiteGroup[] = [];
	const processed = new Set<number>();

	for (const id of prerequisiteIds) {
		if (processed.has(id)) continue;

		const exercise = exercises.find((e) => e.id === id);
		if (!exercise) continue;

		// Check if this exercise has variations that are also in the prerequisites
		const progression = getProgressionByExerciseId(id);
		const variationIds = progression?.variations || [];

		// Find which variations are also in the prerequisites and haven't been processed
		const variationsInPrereqs = variationIds.filter(
			(varId) => prerequisiteIds.includes(varId) && !processed.has(varId)
		);

		if (variationsInPrereqs.length > 0) {
			// Group this exercise with its variations
			const group: Exercise[] = [exercise];
			processed.add(id);

			for (const varId of variationsInPrereqs) {
				const varExercise = exercises.find((e) => e.id === varId);
				if (varExercise) {
					group.push(varExercise);
					processed.add(varId);
				}
			}
			groups.push(group);
		} else {
			// Single exercise, no variations in prerequisites
			groups.push([exercise]);
			processed.add(id);
		}
	}

	return groups;
}

export interface ExerciseProgressionData {
	current: Exercise;
	prerequisites: Exercise[];
	prerequisiteGroups: PrerequisiteGroup[]; // Grouped by variations
	variations: Exercise[];
	progressions: Exercise[];
}

/**
 * Obtiene los datos completos de progresión de un ejercicio.
 * Incluye el ejercicio actual, sus prerrequisitos, variaciones y progresiones.
 */
export function getExerciseProgressionData(
	exerciseId: number,
	locale: string = 'es',
	prefetchedProgression?: ExerciseProgression
): ExerciseProgressionData | null {
	const exercises = getMockExercises(locale);
	const currentExercise = exercises.find((e) => e.id === exerciseId);
	if (!currentExercise) return null;

	const progression = prefetchedProgression ?? getProgressionByExerciseId(exerciseId);
	if (!progression) {
		// Si no hay progresión definida, retorna solo el ejercicio actual
		return {
			current: currentExercise,
			prerequisites: [],
			prerequisiteGroups: [],
			variations: [],
			progressions: [],
		};
	}

	// Obtener ejercicios por IDs manteniendo el orden
	const getExercisesByIds = (ids: number[]): Exercise[] => {
		return ids
			.map((id) => exercises.find((e) => e.id === id))
			.filter((e): e is Exercise & { difficulty: number; muscle_group: string[] } => e !== undefined);
	};

	const prerequisites = getExercisesByIds(progression.prerequisites);
	const prerequisiteGroups = groupPrerequisitesByVariations(progression.prerequisites, exercises);

	return {
		current: currentExercise,
		prerequisites,
		prerequisiteGroups,
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
 * Obtiene el color de fondo (con transparencia) según la dificultad del ejercicio.
 * Usado para fondos de nodos en el árbol de progresión.
 */
export function getDifficultyBgColor(difficulty: number, opacity: number = 0.3): string {
	switch (difficulty) {
		case 0:
			return `rgba(76, 175, 80, ${opacity})`; // Verde - Muy fácil
		case 1:
			return `rgba(139, 195, 74, ${opacity})`; // Verde claro - Fácil
		case 2:
			return `rgba(255, 193, 7, ${opacity})`; // Amarillo - Intermedio
		case 3:
			return `rgba(255, 152, 0, ${opacity})`; // Naranja - Difícil
		case 4:
			return `rgba(255, 87, 34, ${opacity})`; // Naranja oscuro - Muy difícil
		case 5:
			return `rgba(244, 67, 54, ${opacity})`; // Rojo - Experto
		default:
			return `rgba(158, 158, 158, ${opacity})`; // Gris
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
