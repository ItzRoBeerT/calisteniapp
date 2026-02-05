'use server';
import { Exercise, Filter } from '@/types/supabase';
import { createClient } from '@/utils/supabase/server';
import { getMockExercises, mockFilters } from '@/utils/mock-data';
import { NotFoundError, BadRequestError, UnauthorizedError } from '@/utils/errors';

const EXERCISES_PER_PAGE = 12;

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

	return data;
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

	return data;
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

	return { exercises: data as unknown as Exercise[], totalPages };
}

export async function getExerciseByName(name: string, locale: string = 'es') {
	const supabase = await createClient();

	if (!supabase) {
		return (
			getMockExercises(locale).find(
				(e) => e.name.toLowerCase() === name.toLowerCase()
			) || null
		);
	}

	console.log(`Searching in column name data: ${name}}`);
	const { data } = await supabase
		.from('Exercise')
		.select('*')
		.ilike('name', name)
		.single();

	if (!data) {
		return null;
	}
	console.log(data);

	return data;
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

	return { muscle_group, difficulty };
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

	return data;
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
