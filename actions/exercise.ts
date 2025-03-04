'use server';
import { Exercise, Filter } from '@/types/supabase';
import { createClient } from '@/utils/supabase/server';
const EXERCISES_PER_PAGE = 12;

export async function getExercise(id: number) {
	const supabase = await createClient();

	const query = {
		id: id as number,
	};

	const { data } = await supabase
		.from('Exercise')
		.select('*')
		.eq('id', query.id)
		.single();

	if (!data) {
		return null;
	}

	return data;
}

export async function getExercises() {
	const supabase = await createClient();

	const { data } = await supabase.from('exercise_list').select('*');

	if (!data) {
		return null;
	}

	return data;
}

export async function getExercisesByPage(
	page: number,
	filters?: Record<string, string | string[]>
) {
	const supabase = await createClient();

	// Configura la consulta inicial con el rango de paginación
	let query = supabase
		.from('Exercise')
		.select('*', { count: 'exact' })
		.range((page - 1) * EXERCISES_PER_PAGE, page * EXERCISES_PER_PAGE - 1);

	// Aplica los filtros dinámicamente
	if (filters) {
		for (const [key, value] of Object.entries(filters)) {
			console.log(`Applying filter: ${key} with value: ${value}`);
			if (key === 'muscle_group') {
				// Si 'value' es un string, lo convertimos a un array
				const valueArray = Array.isArray(value) ? value : [value];
				console.log('Value array:', valueArray);

				// Ahora pasamos el array a la función `.in()`
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

	console.log('count:', count);

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

export async function getExerciseByName(name: string) {
	const supabase = await createClient();

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

export async function filter(filters: Filter) {
	const supabase = await createClient();

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
