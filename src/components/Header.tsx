'use client';

import React from 'react';
import { Feather } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="relative pt-8 pb-6 px-4 flex flex-col items-center justify-center text-center">
      <div className="absolute right-4 top-6 sm:right-8">
        <ThemeToggle />
      </div>

      {/* Quill Icon */}
      <div className="relative mb-3">
        <div className="w-12 h-12 rounded-2xl bg-[#faeed8] dark:bg-[#2d2620] border-2 border-[#d6ba8c] dark:border-[#6a543f] flex items-center justify-center shadow-xs">
          <Feather className="w-6 h-6 text-[#9e6d2b] dark:text-[#e4be78]" strokeWidth={1.8} />
        </div>
      </div>

      {/* Main Title - Responsive contrast: pure black in light mode, pure white in dark mode */}
      <h1 className="font-serif-vintage text-4xl sm:text-5xl font-bold tracking-tight contrast-heading flex items-center justify-center gap-2">
        <span>Post-it Todo List</span>
      </h1>
    </header>
  );
}
