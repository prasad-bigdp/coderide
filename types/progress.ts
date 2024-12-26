import { Task } from './task';
import { User } from './auth';

export interface Progress {
  id: string;
  task_id: string;
  student_id: string;
  status: 'pending' | 'in-progress' | 'completed';
  score?: number;
  code?: string;
  feedback?: string;
  updated_at?: string;
  task?: Task;
  student?: User;
}