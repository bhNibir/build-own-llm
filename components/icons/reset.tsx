'use client';

import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/cn';

export function ResetAnimated({ className }: { className?: string }) {
  return (
    <motion.span
      className={cn('inline-flex', className)}
      whileHover={{ rotate: -360 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <RotateCcw className="h-3.5 w-3.5" />
    </motion.span>
  );
}
