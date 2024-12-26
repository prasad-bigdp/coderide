import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  Settings,
  LogOut,
  BarChart,
  FileText,
} from 'lucide-react';

export const navigationConfig = {
  admin: [
    { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Faculty', href: '/dashboard/admin/faculty', icon: Users },
    { name: 'Students', href: '/dashboard/admin/students', icon: GraduationCap },
    { name: 'Batches', href: '/dashboard/admin/batches', icon: BookOpen },
    { name: 'Subjects', href: '/dashboard/admin/subjects', icon: FileText },
    { name: 'Courses', href: '/dashboard/admin/courses', icon: BookOpen },
    { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ],
  faculty: [
    { name: 'Overview', href: '/dashboard/faculty', icon: LayoutDashboard },
    { name: 'My Courses', href: '/dashboard/faculty/courses', icon: BookOpen },
    { name: 'Students', href: '/dashboard/faculty/students', icon: Users },
    { name: 'Assignments', href: '/dashboard/faculty/assignments', icon: FileText },
  ],
  student: [
    { name: 'Overview', href: '/dashboard/student', icon: LayoutDashboard },
    { name: 'My Courses', href: '/dashboard/student/courses', icon: BookOpen },
    { name: 'Progress', href: '/dashboard/student/progress', icon: GraduationCap },
    { name: 'Assignments', href: '/dashboard/student/assignments', icon: FileText },
  ],
  footer: [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Sign Out', href: '/auth/signout', icon: LogOut },
  ],
};