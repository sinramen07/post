'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('postit_theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const setMode = (dark: boolean) => {
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('postit_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('postit_theme', 'light');
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 p-0.5 text-xs">
        <span className="px-2.5 py-1">라이트</span>
        <span className="px-2.5 py-1">다크</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center rounded-lg border border-stone-300 dark:border-stone-700 bg-[#f4ece1] dark:bg-[#2a241f] p-0.5 text-xs font-mono-vintage shadow-xs">
      <button
        type="button"
        onClick={() => setMode(false)}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
          !isDark
            ? 'bg-white text-black font-bold shadow-xs'
            : 'text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white'
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
        <span>라이트</span>
      </button>
      <button
        type="button"
        onClick={() => setMode(true)}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
          isDark
            ? 'bg-stone-900 text-white font-bold shadow-xs'
            : 'text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white'
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
        <span>다크</span>
      </button>
    </div>
  );
}
