'use server';
import { Exercise, Filter } from '@/types/supabase';
import { createClient } from '@/utils/supabase/server';
import { log } from 'console';
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

	const { data } = await supabase.from('Exercise').select('*');

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
			if (key === 'muscle_groups') {
				// Si 'value' es un string, lo convertimos a un array
				const valueArray = Array.isArray(value) ? value : [value];
				console.log('Value array:', valueArray);

				// Ahora pasamos el array a la función `.in()`
				query = query.contains('muscle_groups', valueArray);
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

	const muscleGroups =
		(await supabase
			.from('Exercise')
			.select('muscle_groups')
			.then(({ data }) => [
				...new Set(data?.flatMap((item) => item.muscle_groups)),
			])) || [];

	const families =
		(await supabase
			.from('Exercise')
			.select('families')
			.then(({ data }) => [
				...new Set(data?.flatMap((item) => item.families)),
			])) || [];

	const difficulties =
		(await supabase
			.from('Exercise')
			.select('difficulty')
			.then(({ data }) => [
				...new Set(data?.map((item) => item.difficulty)),
			])) || [];

	return { muscleGroups, families, difficulties };
}

export async function filter(filters: Filter) {
	const supabase = await createClient();

	const { data } = await supabase
		.from('Exercise')
		.select('*')
		.in('difficulty', filters.difficulties)
		.in('muscle_group', filters.muscleGroups)
		.in('family', filters.families);

	if (!data) {
		return null;
	}

	return data;
}
