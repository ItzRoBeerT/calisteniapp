'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Simple validation
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { 
      error: error.message || 'Error signing in. Please check your credentials.' 
    };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Validation
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
      error: error.message || 'Error creating account. Please try again.' 
    };
  }

  // Check if email confirmation is required
  if (data?.user?.identities?.length === 0) {
    return {
      success: 'Account already exists. Please sign in.',
      redirect: '/login',
    };
  }

  // If email confirmation is required, redirect to a confirmation page
  if (data.user && !data.user.confirmed_at) {
    return {
      success: 'Check your email for the confirmation link.',
      redirect: '/login',
    };
  }

  // Otherwise, the user is signed in automatically
  revalidatePath('/', 'layout');
  redirect('/');
}
