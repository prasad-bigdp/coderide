import { supabase } from './config';
import { User } from '@/types';

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Fetch additional user data including role
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select(`
      id,
      email,
      name,
      role,
      batch_id,
      batch (
        id,
        name,
        year
      )
    `)
    .eq('id', data.user.id)
    .single();

  if (userError) throw userError;

  return userData;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session?.user) {
    return null;
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select(`
      id,
      email,
      name,
      role,
      batch_id,
      batch (
        id,
        name,
        year
      )
    `)
    .eq('id', session.user.id)
    .single();

  if (userError) throw userError;
  return userData;
}