export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  created_at?: string;
}

export interface FacultySubject {
  id: string;
  faculty_id: string;
  subject_id: string;
  created_at?: string;
  subjects?: Subject;
}