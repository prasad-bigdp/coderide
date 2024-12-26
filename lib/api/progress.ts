import { supabase } from '../supabase/config';
import { Progress, Task } from '@/types';

export async function getTaskProgress(taskId: string, studentId: string) {
  const { data, error } = await supabase
    .from('progress')
    .select(`
      *,
      tasks (
        id,
        title,
        max_score,
        level_id
      )
    `)
    .eq('task_id', taskId)
    .eq('student_id', studentId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateTaskProgress(
  taskId: string,
  studentId: string,
  update: Partial<Progress>
) {
  const { data, error } = await supabase
    .from('progress')
    .upsert({
      task_id: taskId,
      student_id: studentId,
      ...update,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLevelProgress(levelId: string, studentId: string) {
  const { data, error } = await supabase
    .from('level_progress')
    .select('*')
    .eq('level_id', levelId)
    .eq('student_id', studentId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function checkTaskRequirements(taskId: string, studentId: string) {
  const { data, error } = await supabase
    .rpc('can_unlock_task', {
      p_task_id: taskId,
      p_student_id: studentId
    });

  if (error) throw error;
  return data;
}

export async function getNextTask(currentTaskId: string, studentId: string): Promise<Task | null> {
  const { data: currentTask, error: taskError } = await supabase
    .from('tasks')
    .select('level_id, order_index')
    .eq('id', currentTaskId)
    .single();

  if (taskError) throw taskError;

  const { data: nextTask, error: nextError } = await supabase
    .from('tasks')
    .select(`
      *,
      test_cases (*)
    `)
    .eq('level_id', currentTask.level_id)
    .gt('order_index', currentTask.order_index)
    .order('order_index')
    .limit(1)
    .single();

  if (nextError && nextError.code !== 'PGRST116') throw nextError;
  return nextTask;
}