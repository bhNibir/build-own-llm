'use client';

import { motion } from 'motion/react';
import { Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

export function CopyAnimated({ className }: { className?: string }) {
  return (
    <motion.span
      className={cn('inline-flex', className)}
      whileHover={{ rotate: [-2, 2, 0] }}
      transition={{ duration: 0.3 }}
    >
      <Copy className="h-3.5 w-3.5" />
    </motion.span>
  );
}
