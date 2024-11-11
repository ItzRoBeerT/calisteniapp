'use server';
import { createClient } from '@/utils/supabase/server';

export async function getExercise(id: number) {
	const supabase = await createClient();

	const query = {
		id: id as number,
	};

	const { data } = await supabase.from('Exercise').select('*').eq('id', query.id).single();

	if (!data) {
		return null;
	}
	console.log(data);

	return data;
}
