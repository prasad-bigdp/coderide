import { supabase } from './config';
import { User, Course, Task, Progress } from '@/types';

// Users
export async function createUser(userData: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUser(id: string, userData: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Courses
export async function getCourses(filters?: { faculty_id?: string; batch_id?: string }) {
  let query = supabase
    .from('courses')
    .select(`
      *,
      faculty:users!faculty_id (
        id,
        name,
        email
      ),
      levels (
        id,
        title,
        order_index,
        tasks (
          id,
          title,
          max_score
        )
      )
    `);

  if (filters?.faculty_id) {
    query = query.eq('faculty_id', filters.faculty_id);
  }

  if (filters?.batch_id) {
    query = query.eq('batch_id', filters.batch_id);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Progress
export async function getStudentProgress(studentId: string) {
  const { data, error } = await supabase
    .from('progress')
    .select(`
      *,
      task:tasks (
        id,
        title,
        max_score,
        level:levels (
          id,
          title,
          course:courses (
            id,
            title
          )
        )
      )
    `)
    .eq('student_id', studentId);

  if (error) throw error;
  return data;
}