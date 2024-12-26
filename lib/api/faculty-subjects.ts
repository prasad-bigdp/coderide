import { supabase } from '../supabase';
import { FacultySubject } from '@/types';

export async function assignSubjectToFaculty(facultyId: string, subjectId: string) {
  const { data, error } = await supabase
    .from('faculty_subjects')
    .insert([{ faculty_id: facultyId, subject_id: subjectId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getFacultySubjects(facultyId: string) {
  const { data, error } = await supabase
    .from('faculty_subjects')
    .select(`
      *,
      subjects (*)
    `)
    .eq('faculty_id', facultyId);

  if (error) throw error;
  return data;
}

export async function removeSubjectFromFaculty(facultyId: string, subjectId: string) {
  const { error } = await supabase
    .from('faculty_subjects')
    .delete()
    .match({ faculty_id: facultyId, subject_id: subjectId });

  if (error) throw error;
}