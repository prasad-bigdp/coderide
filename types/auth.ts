import { Batch } from './batch';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'faculty' | 'student';
  batch_id?: string;
  batches?: Batch;
  created_at?: string;
  last_active?: number;
}

export interface Session {
  user: User;
  expires: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  batch?: Batch;
}