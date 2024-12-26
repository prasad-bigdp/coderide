import { getServerSession } from 'next-auth';
import { authOptions } from './config';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
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