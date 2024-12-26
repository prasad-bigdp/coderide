import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function checkRole(allowedRoles: string[]) {
  const user = await getCurrentUser();
  if (!user || !user.role) return false;
  return allowedRoles.includes(user.role);
}

export const isAdmin = async () => checkRole(['admin']);
export const isFaculty = async () => checkRole(['admin', 'faculty']);
export const isStudent = async () => checkRole(['student']);