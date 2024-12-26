'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Settings,
  FileText,
} from 'lucide-react';

const roleBasedNavItems = {
  admin: [
    {
      title: "Overview",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "Courses",
      href: "/dashboard/admin/courses",
      icon: BookOpen,
    },
  ],
  faculty: [
    {
      title: "Overview",
      href: "/dashboard/faculty",
      icon: LayoutDashboard,
    },
    {
      title: "My Courses",
      href: "/dashboard/faculty/courses",
      icon: BookOpen,
    },
    {
      title: "Assignments",
      href: "/dashboard/faculty/assignments",
      icon: FileText,
    },
  ],
  student: [
    {
      title: "Overview",
      href: "/dashboard/student",
      icon: LayoutDashboard,
    },
    {
      title: "My Courses",
      href: "/dashboard/student/courses",
      icon: BookOpen,
    },
    {
      title: "Progress",
      href: "/dashboard/student/progress",
      icon: GraduationCap,
    },
  ],
};

export function DashboardNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role || 'student';
  const navItems = roleBasedNavItems[role as keyof typeof roleBasedNavItems];

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Button
            key={index}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              pathname === item.href && "bg-muted font-medium"
            )}
            asChild
          >
            <a href={item.href}>
              <Icon className="mr-2 h-4 w-4" />
              {item.title}
            </a>
          </Button>
        );
      })}
    </nav>
  );
}