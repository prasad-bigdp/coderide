import { supabase } from '../supabase';
import { User } from '@/types';

export async function createUser(userData: Partial<User>) {
  // First create auth user
  const { data: authUser, error: authError } = await supabase.auth.signUp({
    email: userData.email!,
    password: 'tempPassword123', // Should be changed on first login
  });

  if (authError) throw authError;

  // Then create user profile with RLS enabled
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        id: authUser.user!.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        batch_id: userData.batch_id,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUsers(role?: string) {
  let query = supabase
    .from('users')
    .select('*');
  
  if (role) {
    query = query.eq('role', role);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function deleteUser(id: string) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}