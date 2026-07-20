'use client';

import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/cn';

export function PlayAnimated({ className }: { className?: string }) {
  return (
    <motion.span
      className={cn('inline-flex', className)}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <motion.span
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <Play className="h-3.5 w-3.5 fill-current" />
      </motion.span>
    </motion.span>
  );
}
