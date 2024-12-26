import { Task } from './task';

export interface Level {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  created_at?: string;
  tasks?: Task[];
}