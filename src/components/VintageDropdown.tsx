'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
  count?: number;
}

interface VintageDropdownProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: DropdownOption<T>[];
  prefixIcon?: React.ReactNode;
  className?: string;
  dropdownClassName?: string;
  id?: string;
  ariaLabel?: string;
}

export default function VintageDropdown<T extends string = string>({
  value,
  onChange,
  options,
  prefixIcon,
  className = '',
  dropdownClassName = '',
  id,
  ariaLabel,
}: VintageDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-2.5 rounded-xl bg-[#f7f2e5]/90 dark:bg-[#2c2621] border border-[#d6c7b0] dark:border-[#5c4d3e] px-3.5 py-2 text-xs font-mono-vintage text-black dark:text-white font-medium hover:border-[#b8860b] dark:hover:border-[#d4af37] focus:outline-hidden focus:ring-2 focus:ring-[#b8860b]/40 shadow-2xs transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2 truncate">
          {prefixIcon && <span className="opacity-80 shrink-0">{prefixIcon}</span>}
          <span className="truncate">
            {selectedOption?.label}
            {selectedOption?.count !== undefined && ` (${selectedOption.count})`}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#8c7457] dark:text-[#a89072] shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#b8860b] dark:text-[#d4af37]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Box - Styled consistently with website parchment theme */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className={`absolute left-0 right-0 z-50 mt-1.5 min-w-[140px] rounded-xl bg-[#fdfbf6] dark:bg-[#25201b] border border-[#d6c7b0] dark:border-[#524436] p-1.5 shadow-xl backdrop-blur-xs animate-in fade-in zoom-in-95 duration-150 origin-top ${dropdownClassName}`}
        >
          {/* Subtle Corner Accents for vintage consistency */}
          <div className="space-y-1">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-mono-vintage text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#2c1810] text-[#fff9ec] dark:bg-[#f4ecdf] dark:text-[#2c1810] font-bold shadow-2xs'
                      : 'text-black dark:text-white hover:bg-[#efe5cf] dark:hover:bg-[#342b23]'
                  }`}
                >
                  <span className="truncate">
                    {option.label}
                    {option.count !== undefined && ` (${option.count})`}
                  </span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 shrink-0 text-[#b8860b] dark:text-[#b8860b]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
