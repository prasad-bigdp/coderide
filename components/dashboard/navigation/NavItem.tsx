'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  name: string;
  onClick?: () => void;
}

export function NavItem({ href, icon: Icon, name, onClick }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
          "text-sm font-medium",
          isActive && "bg-gray-100 text-gray-900"
        )}
      >
        <Icon className="h-4 w-4" />
        {name}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
        "text-sm font-medium",
        isActive && "bg-gray-100 text-gray-900"
      )}
    >
      <Icon className="h-4 w-4" />
      {name}
    </Link>
  );
}