import { User } from '@/types';

export const ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const PERMISSIONS = {
  // User management
  CREATE_USER: [ROLES.ADMIN],
  UPDATE_USER: [ROLES.ADMIN],
  DELETE_USER: [ROLES.ADMIN],
  VIEW_USERS: [ROLES.ADMIN, ROLES.FACULTY],

  // Course management
  CREATE_COURSE: [ROLES.ADMIN, ROLES.FACULTY],
  UPDATE_COURSE: [ROLES.ADMIN, ROLES.FACULTY],
  DELETE_COURSE: [ROLES.ADMIN],
  VIEW_COURSE: [ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT],

  // Task management
  CREATE_TASK: [ROLES.ADMIN, ROLES.FACULTY],
  UPDATE_TASK: [ROLES.ADMIN, ROLES.FACULTY],
  DELETE_TASK: [ROLES.ADMIN, ROLES.FACULTY],
  SUBMIT_TASK: [ROLES.STUDENT],
  GRADE_TASK: [ROLES.FACULTY],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(user: User | null | undefined, permission: Permission): boolean {
  if (!user) return false;
  return PERMISSIONS[permission].includes(user.role as Role);
}

export function checkPermission(user: User | null | undefined, permission: Permission): void {
  if (!hasPermission(user, permission)) {
    throw new Error('Unauthorized');
  }
}