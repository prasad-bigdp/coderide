import { useSession } from 'next-auth/react';
import { Permission, hasPermission, checkPermission } from '@/lib/auth/permissions';

export function usePermissions() {
  const { data: session } = useSession();
  const user = session?.user;

  return {
    hasPermission: (permission: Permission) => hasPermission(user, permission),
    checkPermission: (permission: Permission) => checkPermission(user, permission),
    isAdmin: user?.role === 'admin',
    isFaculty: user?.role === 'faculty',
    isStudent: user?.role === 'student',
  };
}