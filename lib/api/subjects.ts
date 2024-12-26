import { supabase } from '../supabase';
import { Subject } from '@/types';

export async function getSubjects() {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function createSubject(subjectData: Partial<Subject>) {
  const { data, error } = await supabase
    .from('subjects')
    .insert([subjectData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSubject(id: string) {
  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}