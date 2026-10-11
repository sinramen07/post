'use client';

import React, { useState } from 'react';
import { NoteCategory, NoteColor, CATEGORIES, COLORS } from '../types/note';
import { Bookmark, FilePenLine, Plus } from 'lucide-react';
import { playStickSound } from '../utils/sound';
import VintageDropdown, { DropdownOption } from './VintageDropdown';

interface NoteInputProps {
  onAddNote: (content: string, category: NoteCategory, color: NoteColor) => void;
}

const CATEGORY_OPTIONS: DropdownOption<NoteCategory>[] = CATEGORIES.map((cat) => ({
  value: cat,
  label: `#${cat}`,
}));

export default function NoteInput({ onAddNote }: NoteInputProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoteCategory>('할 일');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Pick random color among yellow, pink, green, blue
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    const randomColor = COLORS[randomIndex];

    playStickSound();
    onAddNote(content.trim(), category, randomColor);
    setContent('');
  };

  return (
    <div className="relative max-w-2xl mx-auto my-6 px-4">
      {/* Container with Vintage Bracket Corners */}
      <div className="relative rounded-2xl bg-[#fdfbf6] dark:bg-[#231e1a] border border-[#dfd4c0] dark:border-[#524436] p-6 sm:p-7 shadow-md">
        {/* Corner Ornaments */}
        <div className="absolute top-2 left-2 text-[#b8860b] dark:text-[#d4af37] text-sm select-none pointer-events-none opacity-80">⌜</div>
        <div className="absolute top-2 right-2 text-[#b8860b] dark:text-[#d4af37] text-sm select-none pointer-events-none opacity-80">⌝</div>
        <div className="absolute bottom-2 left-2 text-[#b8860b] dark:text-[#d4af37] text-sm select-none pointer-events-none opacity-80">⌞</div>
        <div className="absolute bottom-2 right-2 text-[#b8860b] dark:text-[#d4af37] text-sm select-none pointer-events-none opacity-80">⌟</div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selector with Vintage Dropdown */}
          <div>
            <label
              htmlFor="category-select"
              className="flex items-center gap-1.5 text-xs font-mono-vintage text-black dark:text-white font-medium mb-1.5 tracking-wide"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#b8860b] dark:text-[#d4af37]" />
              <span>범주 (카테고리 선택)</span>
            </label>
            <VintageDropdown<NoteCategory>
              id="category-select"
              ariaLabel="카테고리 선택"
              value={category}
              onChange={setCategory}
              options={CATEGORY_OPTIONS}
              prefixIcon={<Bookmark className="w-3.5 h-3.5 text-[#b8860b]" />}
              className="w-full"
            />
          </div>

          {/* Note Content Textarea */}
          <div>
            <label
              htmlFor="note-content"
              className="flex items-center gap-1.5 text-xs font-mono-vintage text-black dark:text-white font-medium mb-1.5 tracking-wide"
            >
              <FilePenLine className="w-3.5 h-3.5 text-[#b8860b] dark:text-[#d4af37]" />
              <span>메모 내용</span>
            </label>
            <div className="relative rounded-xl border border-[#d6c7b0] dark:border-[#5c4d3e] bg-[#fbf9f4] dark:bg-[#28221d] focus-within:border-[#b8860b] focus-within:ring-2 focus-within:ring-[#b8860b]/40 transition-all">
              <textarea
                id="note-content"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="포스트잇에 적을 내용을 입력하세요..."
                className="w-full resize-none bg-transparent px-4 py-3 text-sm font-body-vintage text-black dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!content.trim()}
            className="w-full group relative flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-body-vintage text-sm font-semibold tracking-wide text-[#2b1704] dark:text-[#2a1705] bg-gradient-to-b from-[#e8ad35] to-[#c58b16] hover:from-[#f1b73e] hover:to-[#ce941d] active:from-[#b98010] active:to-[#aa730b] border border-[#a6740f] shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
            <span>포스트잇 게시</span>
          </button>
        </form>
      </div>
    </div>
  );
}
