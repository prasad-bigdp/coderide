'use client';

import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`${theme.spacing.page} ${className}`}
    >
      {children}
    </motion.div>
  );
}