'use client';

import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { handleSignOut } from '@/lib/auth/signout';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Settings,
  LogOut,
  BarChart,
  FileText,
} from 'lucide-react';

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const role = session?.user?.role || 'student';

  const handleSettingsClick = () => {
    router.push(`/dashboard/${role}/settings`);
  };
  const navigation = {
    admin: [
      { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
      { name: 'Faculty', href: '/dashboard/admin/faculty', icon: Users },
      { name: 'Students', href: '/dashboard/admin/students', icon: GraduationCap },
      { name: 'Batches', href: '/dashboard/admin/batches', icon: BookOpen },
      { name: 'Subjects', href: '/dashboard/admin/subjects', icon: FileText },
      { name: 'Courses', href: '/dashboard/admin/courses', icon: BookOpen },
      { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart },
    ],
    faculty: [
      { name: 'Dashboard', href: '/dashboard/faculty', icon: LayoutDashboard },
      { name: 'Courses', href: '/dashboard/faculty/courses', icon: BookOpen },
      { name: 'Students', href: '/dashboard/faculty/students', icon: Users },
    ],
    student: [
      { name: 'Dashboard', href: '/dashboard/student', icon: LayoutDashboard },
      { name: 'My Courses', href: '/dashboard/student/courses', icon: BookOpen },
      { name: 'Progress', href: '/dashboard/student/progress', icon: GraduationCap },
    ],
  };

  const items = navigation[role as keyof typeof navigation];

  return (
    <div
      role="navigation"
      aria-label="Main navigation"
      className="w-64 bg-card border-r min-h-screen p-6"
    >
      <div className="flex items-center gap-2 mb-8">
        <GraduationCap className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg">CodeRide</span>
      </div>

      <nav className="space-y-2" aria-label="Dashboard sections">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Button
              key={item.href}
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start',
                isActive && 'bg-primary/10'
              )}
              aria-current={isActive ? 'page' : undefined}
              asChild
            >
              <a href={item.href}>
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </a>
            </Button>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6 space-y-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={handleSettingsClick}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-600"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}