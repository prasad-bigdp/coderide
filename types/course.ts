import { User } from './auth';
import { Level } from './level';
import { Subject } from './subject';
import { Batch } from './batch';

export interface Course {
  id: string;
  title: string;
  description: string;
  faculty_id: string;
  progress?: number;
  subject_id?: string;
  batch_id?: string;
  created_at?: string;
  faculty?: User;
  subject?: Subject;
  batch?: Batch;
  levels?: Level[];
}