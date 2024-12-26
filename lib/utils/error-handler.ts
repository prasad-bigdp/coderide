import { toast } from 'sonner';
import { PostgrestError } from '@supabase/supabase-js';

export function handleError(error: unknown, customMessage?: string) {
  console.error('Error:', error);
  
  if (error instanceof Error) {
    toast.error(customMessage || error.message);
  } else if ((error as PostgrestError).code) {
    const pgError = error as PostgrestError;
    switch (pgError.code) {
      case '23505':
        toast.error('This record already exists');
        break;
      case '23503':
        toast.error('This action would violate referential integrity');
        break;
      default:
        toast.error(customMessage || 'An unexpected error occurred');
    }
  } else {
    toast.error(customMessage || 'An unexpected error occurred');
  }
}