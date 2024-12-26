'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingAnimationProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function LoadingAnimation({ 
  className,
  size = 'md',
  showText = true 
}: LoadingAnimationProps) {
  const sizes = {
    sm: 'w-24',
    md: 'w-32',
    lg: 'w-48'
  };

  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { 
          type: "spring",
          duration: 1.5,
          bounce: 0 
        },
        opacity: { duration: 0.01 }
      }
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <motion.div
        initial="hidden"
        animate="visible"
        className={cn(sizes[size])}
      >
        <svg
          viewBox="0 0 400 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          {/* Wave path */}
          <motion.path
            d="M20 60 Q100 20 200 60 T380 60"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            variants={draw}
            className="text-primary"
          />
          
          {/* Logo text */}
          <motion.text
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            x="50%"
            y="85"
            textAnchor="middle"
            className="text-4xl font-bold fill-current"
          >
            coderide
          </motion.text>
        </svg>
      </motion.div>

      {showText && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4 text-muted-foreground"
        >
          Loading...
        </motion.p>
      )}
    </div>
  );
}