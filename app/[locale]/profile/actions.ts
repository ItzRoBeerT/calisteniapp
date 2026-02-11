'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  if (!supabase) {
    return { error: 'Authentication is not available. Running in demo mode.' };
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to update your profile.' };
  }

  const fullName = formData.get('fullName') as string;
  const username = formData.get('username') as string;

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName || null,
      username: username || null,
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message || 'Error updating profile.' };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function changePassword(formData: FormData) {
  const supabase = await createClient();

  if (!supabase) {
    return { error: 'Authentication is not available. Running in demo mode.' };
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to change your password.' };
  }

  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!newPassword || newPassword.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message || 'Error updating password.' };
  }

  return { success: true };
}
