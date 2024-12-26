import { User } from '@/types';

export const ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const PERMISSIONS = {
  // User management
  MANAGE_USERS: [ROLES.ADMIN],
  VIEW_USERS: [ROLES.ADMIN, ROLES.FACULTY],
  
  // Course management
  MANAGE_COURSES: [ROLES.ADMIN],
  CREATE_COURSE: [ROLES.ADMIN, ROLES.FACULTY],
  UPDATE_OWN_COURSE: [ROLES.FACULTY],
  VIEW_COURSES: [ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT],
  
  // Task management
  CREATE_TASK: [ROLES.ADMIN, ROLES.FACULTY],
  UPDATE_TASK: [ROLES.ADMIN, ROLES.FACULTY],
  SUBMIT_TASK: [ROLES.STUDENT],
  GRADE_TASK: [ROLES.FACULTY],
  
  // Progress management
  VIEW_PROGRESS: [ROLES.ADMIN, ROLES.FACULTY],
  UPDATE_PROGRESS: [ROLES.STUDENT],
  GRADE_PROGRESS: [ROLES.FACULTY],
  
  // Analytics
  VIEW_ANALYTICS: [ROLES.ADMIN],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(user: User | null | undefined, permission: Permission): boolean {
  if (!user?.role) return false;
  return PERMISSIONS[permission].includes(user.role as Role);
}

export function checkPermission(user: User | null | undefined, permission: Permission): void {
  if (!hasPermission(user, permission)) {
    throw new Error(`Permission denied: ${permission}`);
  }
}

export function checkMultiplePermissions(user: User | null | undefined, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(user, permission));
}

export function filterByPermission<T>(items: T[], user: User | null | undefined, permission: Permission): T[] {
  if (hasPermission(user, permission)) {
    return items;
  }
  return [];
}