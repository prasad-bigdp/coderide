import { supabase } from '../supabase';
import { Task, TestCase } from '@/types';

export async function getTask(taskId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      test_cases (
        id,
        input,
        expected_output,
        order_index
      ),
      levels (
        id,
        title,
        courses (
          id,
          title
        )
      )
    `)
    .eq('id', taskId)
    .single();

  if (error) throw error;

  // Sort test cases by order_index
  if (data.test_cases) {
    data.test_cases.sort((a, b) => a.order_index - b.order_index);
  }

  return data;
}

export async function createTask(taskData: Partial<Task> & { test_cases: Partial<TestCase>[] }) {
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .insert([{
      title: taskData.title,
      description: taskData.description,
      max_score: taskData.max_score,
      level_id: taskData.level_id,
      order_index: taskData.order_index
    }])
    .select()
    .single();

  if (taskError) throw taskError;

  if (taskData.test_cases?.length) {
    const testCasesWithTaskId = taskData.test_cases.map((tc, index) => ({
      ...tc,
      task_id: task.id,
      order_index: index
    }));

    const { error: testCaseError } = await supabase
      .from('test_cases')
      .insert(testCasesWithTaskId);

    if (testCaseError) throw testCaseError;
  }

  return task;
}

export async function updateTask(
  taskId: string, 
  taskData: Partial<Task> & { test_cases?: Partial<TestCase>[] }
) {
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .update({
      title: taskData.title,
      description: taskData.description,
      max_score: taskData.max_score
    })
    .eq('id', taskId)
    .select()
    .single();

  if (taskError) throw taskError;

  if (taskData.test_cases?.length) {
    // Delete existing test cases
    await supabase
      .from('test_cases')
      .delete()
      .eq('task_id', taskId);

    // Insert new test cases
    const testCasesWithTaskId = taskData.test_cases.map((tc, index) => ({
      ...tc,
      task_id: taskId,
      order_index: index
    }));

    const { error: testCaseError } = await supabase
      .from('test_cases')
      .insert(testCasesWithTaskId);

    if (testCaseError) throw testCaseError;
  }

  return task;
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) throw error;
}