'use server';
import { Exercise, ExerciseBase, ExerciseTranslation, Filter } from '@/types/supabase';
import { createClient } from '@/utils/supabase/server';
import { getMockExercises, mockFilters, exercisesBaseData } from '@/utils/mock-data';
import { NotFoundError, BadRequestError, UnauthorizedError } from '@/utils/errors';
import { getProgressionByExerciseId, type ExerciseProgression } from '@/data/exerciseProgressions';

const EXERCISES_PER_PAGE = 12;

// Load translations dynamically
// eslint-disable-next-line @typescript-eslint/no-require-imports
const esMessages = require('@/messages/es.json');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const enMessages = require('@/messages/en.json');

const translationsByLocale: Record<string, Record<string, ExerciseTranslation>> = {
	es: esMessages.Exercises,
	en: enMessages.Exercises,
};

// Index exercises base data by id for quick lookup
const exercisesBaseById: Record<number, ExerciseBase> = {};
exercisesBaseData.forEach((ex) => {
	exercisesBaseById[ex.id] = ex;
});

// Apply translations and enrich with base data (equipment, category, type) from exercises.json
function applyTranslations(exercises: Exercise[], locale: string): Exercise[] {
	const translations = translationsByLocale[locale] || translationsByLocale.es;
	return exercises.map((exercise) => {
		const translation = translations[String(exercise.id)];
		const baseData = exercisesBaseById[exercise.id];
		return {
			...exercise,
			// Enrich with base data if missing from database
			...(baseData && !exercise.equipment?.length && { equipment: baseData.equipment }),
			...(baseData && !exercise.category && { category: baseData.category }),
			...(baseData && !exercise.type && { type: baseData.type }),
			// Apply translations
			...(translation && {
				name: translation.name,
				description: translation.description,
				...(translation.instructions && { instructions: translation.instructions }),
			}),
		};
	});
}

function applyTranslationSingle(exercise: Exercise, locale: string): Exercise {
	const translations = translationsByLocale[locale] || translationsByLocale.es;
	const translation = translations[String(exercise.id)];
	const baseData = exercisesBaseById[exercise.id];
	return {
		...exercise,
		// Enrich with base data if missing from database
		...(baseData && !exercise.equipment?.length && { equipment: baseData.equipment }),
		...(baseData && !exercise.category && { category: baseData.category }),
		...(baseData && !exercise.type && { type: baseData.type }),
		// Apply translations
		...(translation && {
			name: translation.name,
			description: translation.description,
			...(translation.instructions && { instructions: translation.instructions }),
		}),
	};
}

export async function getExercise(id: number, locale: string = 'es') {
	const supabase = await createClient();

	if (!supabase) {
		return getMockExercises(locale).find((e) => e.id === id) || null;
	}

	const { data } = await supabase
		.from('Exercise')
		.select('*')
		.eq('id', id)
		.single();

	if (!data) {
		return null;
	}

	return applyTranslationSingle(data as Exercise, locale);
}

export async function getExercises(locale: string = 'es') {
	const supabase = await createClient();

	if (!supabase) {
		return getMockExercises(locale);
	}

	const { data } = await supabase.from('Exercise').select('*');

	if (!data) {
		return null;
	}

	return applyTranslations(data as Exercise[], locale);
}

export async function getExercisesByPage(
	page: number,
	filters?: Record<string, string | string[]>,
	locale: string = 'es'
) {
	const supabase = await createClient();

	if (!supabase) {
		let filtered = [...getMockExercises(locale)];

		if (filters) {
			for (const [key, value] of Object.entries(filters)) {
				if (key === 'muscle_group') {
					const valueArray = Array.isArray(value) ? value : [value];
					filtered = filtered.filter((e) =>
						valueArray.some((mg) => e.muscle_group.includes(mg))
					);
				}
				if (key === 'difficulty') {
					const valueArray = Array.isArray(value) ? value : [value];
					const difficultyRanges: number[] = [];

					if (valueArray.includes('beginner')) {
						difficultyRanges.push(0, 1);
					}
					if (valueArray.includes('intermediate')) {
						difficultyRanges.push(2, 3);
					}
					if (valueArray.includes('advanced')) {
						difficultyRanges.push(4, 5);
					}

					filtered = filtered.filter((e) =>
						difficultyRanges.includes(e.difficulty)
					);
				}
				if (key === 'equipment') {
					const valueArray = Array.isArray(value) ? value : value.split(',').filter(Boolean);
					filtered = filtered.filter((e) =>
						valueArray.some((eq) => (e.equipment || []).includes(eq))
					);
				}
			}
		}

		const start = (page - 1) * EXERCISES_PER_PAGE;
		const end = start + EXERCISES_PER_PAGE;
		const paginatedExercises = filtered.slice(start, end);
		const totalPages = Math.ceil(filtered.length / EXERCISES_PER_PAGE);

		return { exercises: paginatedExercises as Exercise[], totalPages };
	}

	let query = supabase
		.from('Exercise')
		.select('*', { count: 'exact' })
		.range((page - 1) * EXERCISES_PER_PAGE, page * EXERCISES_PER_PAGE - 1);

	if (filters) {
		for (const [key, value] of Object.entries(filters)) {
			console.log(`Applying filter: ${key} with value: ${value}`);
			if (key === 'muscle_group') {
				const valueArray = Array.isArray(value) ? value : [value];
				console.log('Value array:', valueArray);
				query = query.contains('muscle_group', valueArray);
			}

			if (key === 'difficulty') {
				const valueArray = Array.isArray(value) ? value : [value];
				console.log('Value array:', valueArray);

				const values = [];

				if (valueArray.includes('beginner')) {
					values.push([0, 1]);
				}
				if (valueArray.includes('intermediate')) {
					values.push([2, 3]);
				}
				if (valueArray.includes('advanced')) {
					values.push([4, 5]);
				}

				query = query.in('difficulty', values);
			}

			if (key === 'equipment') {
				const valueArray = Array.isArray(value) ? value : value.split(',').filter(Boolean);
				query = query.overlaps('equipment', valueArray);
			}
		}
	}

	const { data, count, error } = await query;

	if (error) {
		console.error('Error fetching exercises:', error.message);
		return null;
	}

	let totalPages = 0;
	if (count && count > 0) {
		totalPages = Math.ceil(count / EXERCISES_PER_PAGE);
	}

	const translatedExercises = applyTranslations(data as Exercise[], locale);
	return { exercises: translatedExercises, totalPages };
}

export async function getExerciseByName(name: string, locale: string = 'es') {
	// First try to find in mock data (always available with translations)
	const mockExercise = getMockExercises(locale).find(
		(e) => e.name.toLowerCase() === name.toLowerCase()
	);

	const supabase = await createClient();

	if (!supabase) {
		return mockExercise || null;
	}

	// Find the exercise ID by translated name
	const translations = translationsByLocale[locale] || translationsByLocale.es;
	const exerciseId = Object.entries(translations).find(
		([, translation]) => translation.name.toLowerCase() === name.toLowerCase()
	)?.[0];

	if (exerciseId) {
		// Found by translation, fetch by ID
		const { data } = await supabase
			.from('Exercise')
			.select('*')
			.eq('id', parseInt(exerciseId))
			.single();

		if (data) {
			return applyTranslationSingle(data as Exercise, locale);
		}
	}

	// Fallback: try to find by Spanish name (database default)
	const { data } = await supabase
		.from('Exercise')
		.select('*')
		.ilike('name', name)
		.single();

	if (data) {
		return applyTranslationSingle(data as Exercise, locale);
	}

	// Final fallback: return mock data if database didn't have the exercise
	return mockExercise || null;
}

export async function getFilters() {
	const supabase = await createClient();

	if (!supabase) {
		return mockFilters;
	}

	const muscle_group =
		(await supabase
			.from('Exercise')
			.select('muscle_group')
			.then(({ data }) => [
				...new Set(data?.flatMap((item) => item.muscle_group)),
			])) || [];

	const difficulty =
		(await supabase
			.from('Exercise')
			.select('difficulty')
			.then(({ data }) => [
				...new Set(data?.map((item) => item.difficulty)),
			])) || [];

	const equipment =
		(await supabase
			.from('Exercise')
			.select('equipment')
			.then(({ data }) => [
				...new Set(data?.flatMap((item) => item.equipment || [])),
			])) || [];

	return { muscle_group, difficulty, equipment };
}

export async function filter(filters: Filter, locale: string = 'es') {
	const supabase = await createClient();

	if (!supabase) {
		return getMockExercises(locale).filter(
			(e) =>
				filters.difficulty.includes(String(e.difficulty)) &&
				filters.muscle_group.some((mg) => e.muscle_group.includes(mg))
		);
	}

	const { data } = await supabase
		.from('Exercise')
		.select('*')
		.in('difficulty', filters.difficulty)
		.in('muscle_group', filters.muscle_group);

	if (!data) {
		return null;
	}

	return applyTranslations(data as Exercise[], locale);
}

export async function getExerciseProgression(exerciseId: number): Promise<ExerciseProgression | undefined> {
	const supabase = await createClient();

	if (!supabase) {
		return getProgressionByExerciseId(exerciseId);
	}

	const { data } = await supabase
		.from('exercise_progressions')
		.select('exercise_id, prerequisites, variations, progressions')
		.eq('exercise_id', exerciseId)
		.single();

	if (!data) {
		return getProgressionByExerciseId(exerciseId);
	}

	return {
		exerciseId: data.exercise_id,
		prerequisites: data.prerequisites ?? [],
		variations: data.variations ?? [],
		progressions: data.progressions ?? [],
	};
}

// Ejemplo de función que podría lanzar diferentes tipos de errores
export async function getExerciseById(id: string) {
  // Validar la entrada
  if (!id) {
    throw new BadRequestError('El ID del ejercicio es requerido');
  }

  try {
    // Simulando una búsqueda en la base de datos
    const exercise = await fetchExerciseFromDatabase(id);
    
    if (!exercise) {
      throw new NotFoundError(`No se encontró el ejercicio con ID: ${id}`);
    }
    
    return exercise;
  } catch (error) {
    // Manejo del error y relanzamiento como error personalizado
    if (error instanceof NotFoundError) {
      throw error; // Ya es un error personalizado, lo relanzamos
    }
    
    // En caso de un error de base de datos u otro error
    console.error('Error al obtener ejercicio:', error);
    throw new Error(`Error al obtener el ejercicio: ${(error as Error).message}`);
  }
}

// Función simulada para la demostración
async function fetchExerciseFromDatabase(id: string) {
  // Simulación de acceso a la base de datos
  return null; // Simula que no se encontró el ejercicio
}

// Ejemplo de función que verifica autenticación
export async function createExercise(exerciseData: any, userId?: string) {
  // Verificar si el usuario está autenticado
  if (!userId) {
    throw new UnauthorizedError('Debes iniciar sesión para crear un ejercicio');
  }
  
  // Validar datos de entrada
  if (!exerciseData || !exerciseData.name) {
    throw new BadRequestError('Datos de ejercicio inválidos');
  }
  
  // Resto de la lógica para crear el ejercicio...
  return { id: 'new-id', ...exerciseData };
}
