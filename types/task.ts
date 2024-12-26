import { TestCase } from './test-case';
import { Level } from './level';

export interface Task {
  id: string;
  level_id: string;
  task_type: 'programming' | 'html' | 'css' | 'javascript';
  title: string;
  description: string;
  max_score: number;
  order_index: number;
  expected_output?: string;
  deadline?: string;
  created_at?: string;
  test_cases?: TestCase[];
  level?: Level;
}