'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { FlowConnector } from './diagram-ui';

const EXAMPLE = { text: 'i like apple', ids: [7, 9, 0] };

export function EncodeDecodeAnim({ paused }: { paused?: boolean }) {
  const [dir, setDir] = useState<'encode' | 'decode'>('encode');

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setDir((d) => (d === 'encode' ? 'decode' : 'encode')), 2500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <p className="flex items-center justify-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
        <ArrowLeftRight className="h-3.5 w-3.5" />
        {dir === 'encode' ? 'Encode: text → numbers' : 'Decode: numbers → text'}
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <motion.div
          key={dir + '-text'}
          className={`rounded-lg border px-4 py-2 font-mono text-sm ${
            dir === 'encode' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' : 'border-fd-border'
          }`}
          animate={{ opacity: dir === 'encode' ? 1 : 0.7 }}
        >
          &quot;{EXAMPLE.text}&quot;
        </motion.div>
        <FlowConnector />
        <motion.div
          key={dir + '-ids'}
          className={`rounded-lg border px-4 py-2 font-mono text-sm ${
            dir === 'decode' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' : 'border-fd-border'
          }`}
          animate={{ opacity: dir === 'decode' ? 1 : 0.7 }}
        >
          [{EXAMPLE.ids.join(', ')}]
        </motion.div>
      </div>
    </div>
  );
}
