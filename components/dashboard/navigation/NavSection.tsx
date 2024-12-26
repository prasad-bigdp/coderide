'use client';

import { NavItem } from './NavItem';
import { LucideIcon } from 'lucide-react';

interface NavLink {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface NavSectionProps {
  items: NavLink[];
  onItemClick?: (item: NavLink) => void;
}

export function NavSection({ items, onItemClick }: NavSectionProps) {
  return (
    <nav className="grid items-start gap-2">
      {items.map((item) => (
        <NavItem
          key={item.href}
          {...item}
          onClick={onItemClick ? () => onItemClick(item) : undefined}
        />
      ))}
    </nav>
  );
}