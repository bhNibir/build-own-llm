'use client';

import { useEffect, useState } from 'react';

function readDark(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

/** Detect Fumadocs / class-based dark mode without next-themes */
export function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = useState(readDark);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}
