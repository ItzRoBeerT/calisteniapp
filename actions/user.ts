'use server';
import { createClient } from '@/utils/supabase/server';

export async function getUserById(userId: string) {
	const supabase = await createClient();

	if (!supabase) {
		return null;
	}

	let { data, error } = await supabase
		.from('Profile')
		.select('*')
		.eq('user_id', userId)
		.single();

	if (error) {
		console.error('Error fetching user:', error.message);
		return null;
	}

	return data;
}

export async function getUserByUsername(username: string) {
	const supabase = await createClient();

	if (!supabase) {
		return null;
	}

	const { data, error } = await supabase
		.from('profiles')
		.select(
			'id, username, full_name, avatar_url, created_at, workouts_count, followers_count, following_count'
		)
		.eq('username', username)
		.single();

	if (error) {
		console.error('Error fetching user by username:', error.message);
		return null;
	}

	return data;
}
