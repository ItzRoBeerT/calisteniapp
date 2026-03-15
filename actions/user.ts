'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function getUserById(userId: string) {
	const supabase = await createClient();

	if (!supabase) {
		return null;
	}

	let { data, error } = await supabase
		.from('profiles')
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

export async function signIn(formData: FormData) {
	const supabase = await createClient();

	if (!supabase) {
		return { error: 'Authentication is not available. Running in demo mode.' };
	}

	const email = formData.get('email') as string;
	const password = formData.get('password') as string;

	if (!email || !password) {
		return { error: 'Email and password are required' };
	}

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return {
			error: error.message || 'Error signing in. Please check your credentials.',
		};
	}

	revalidatePath('/', 'layout');
	return {
		success: 'Welcome back!',
		redirect: '/',
	};
}

export async function signUp(formData: FormData) {
	const supabase = await createClient();

	if (!supabase) {
		return { error: 'Authentication is not available. Running in demo mode.' };
	}

	const email = formData.get('email') as string;
	const password = formData.get('password') as string;
	const confirmPassword = formData.get('confirmPassword') as string;

	if (!email || !password) {
		return { error: 'Email and password are required' };
	}

	if (password.length < 6) {
		return { error: 'Password must be at least 6 characters' };
	}

	if (password !== confirmPassword) {
		return { error: 'Passwords do not match' };
	}

	const { error, data } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
		},
	});

	if (error) {
		return {
			error: error.message || 'Error creating account. Please try again.',
		};
	}

	if (data?.user?.identities?.length === 0) {
		return {
			success: 'Account already exists. Please sign in.',
			redirect: '/login',
		};
	}

	if (data.user && !data.user.confirmed_at) {
		return {
			success: 'Check your email for the confirmation link.',
			redirect: '/login',
		};
	}

	revalidatePath('/', 'layout');
	redirect('/');
}
