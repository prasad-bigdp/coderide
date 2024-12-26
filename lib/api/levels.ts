import { supabase } from '../supabase/config';
import { Level } from '@/types';

export async function getLevels(courseId: string, userId?: string) {
  const query = supabase
    .from('levels')
    .select(`
      *,
      tasks (
        id,
        title,
        description,
        max_score,
        order_index,
        progress (
          status,
          score
        )
      )
    `)
    .eq('course_id', courseId)
    .order('order_index');

  if (userId) {
    query.eq('tasks.progress.student_id', userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function checkLevelAccess(levelId: string, userId: string) {
  const { data, error } = await supabase
    .rpc('check_level_completion', {
      level_id: levelId,
      student_id: userId
    });

  if (error) throw error;
  return data;
}