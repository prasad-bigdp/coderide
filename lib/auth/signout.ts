import { signOut } from 'next-auth/react';
import { toast } from 'sonner';

export async function handleSignOut() {
  try {
    await signOut({ callbackUrl: '/auth/login' });
  } catch (error) {
    toast.error('Error signing out');
    console.error('Sign out error:', error);
  }
}