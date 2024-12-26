import { supabase } from '../supabase';
import { Batch } from '@/types';

export async function getBatches() {
  const { data, error } = await supabase
    .from('batches')
    .select('*')
    .order('year', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createBatch(batchData: Partial<Batch>) {
  const { data, error } = await supabase
    .from('batches')
    .insert([batchData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBatch(id: string) {
  const { error } = await supabase
    .from('batches')
    .delete()
    .eq('id', id);

  if (error) throw error;
}