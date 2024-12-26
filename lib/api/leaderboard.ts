import { supabase } from '../supabase';

export async function getLeaderboard() {
  const { data, error } = await supabase
    .rpc('get_leaderboard')
    .limit(10);

  if (error) throw error;
  return data;
}