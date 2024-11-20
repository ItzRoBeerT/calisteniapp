'use server';
import { createClient } from '@/utils/supabase/server';
const EXERCISES_PER_PAGE = 2;

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

export async function getExercisesByPage(page: number) {
	const supabase = await createClient();

	const { data } = await supabase
		.from('exercise_list')
		.select('*')
		.range((page - 1) * EXERCISES_PER_PAGE, page * EXERCISES_PER_PAGE - 1);

	if (!data) {
		return null;
	}

	return data;
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
