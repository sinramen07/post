'use client';

import React, { useState, useEffect } from 'react';
import { Note, NoteCategory, NoteColor, CATEGORIES, COLORS, COLOR_CONFIG } from '../types/note';
import { X, Check, FileEdit, Bookmark, Palette, Calendar } from 'lucide-react';

interface EditNoteModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, newContent: string, newCategory: NoteCategory, newColor: NoteColor, newDatetime?: string) => void;
}

export default function EditNoteModal({
  note,
  isOpen,
  onClose,
  onSave,
}: EditNoteModalProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoteCategory>('할 일');
  const [color, setColor] = useState<NoteColor>('yellow');
  const [datetime, setDatetime] = useState('');

  useEffect(() => {
    if (note) {
      setContent(note.content);
      setCategory(note.category);
      setColor(note.color);
      setDatetime(note.createdAt);
    }
  }, [note]);

  if (!isOpen || !note) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSave(note.id, content.trim(), category, color, datetime.trim() || note.createdAt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#faf6ec] dark:bg-[#25201b] border border-[#d6c7b0] dark:border-[#524436] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5d8c3] dark:border-[#3d3228]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#efe5cf] dark:bg-[#342b23] flex items-center justify-center border border-[#d2be9f] dark:border-[#67543f]">
              <FileEdit className="w-4 h-4 text-[#9a6a2a] dark:text-[#f4c881]" />
            </div>
            <h2 className="font-serif-vintage text-lg font-bold contrast-heading">
              포스트잇 수정하기
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7a6557] hover:text-[#2c1810] dark:text-[#a89686] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          {/* Category */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-mono-vintage text-[#735e51] dark:text-[#bfb0a1] mb-1">
              <Bookmark className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>카테고리</span>
            </label>
            <div className="flex gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono-vintage transition-all border ${
                    category === cat
                      ? 'bg-[#2c1810] text-[#fff9ec] border-[#2c1810] dark:bg-[#f4ecdf] dark:text-[#2c1810] dark:border-[#f4ecdf] shadow-xs font-bold'
                      : 'bg-[#f4ece1] dark:bg-[#2f2822] text-[#695447] dark:text-[#a89a8c] border-[#dfd2be] dark:border-[#4d4034] hover:border-[#b8860b]'
                  }`}
                >
                  #{cat}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-mono-vintage text-[#735e51] dark:text-[#bfb0a1] mb-1">
              <Palette className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>포스트잇 색상</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((c) => {
                const cfg = COLOR_CONFIG[c];
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-body-vintage border transition-all ${
                      cfg.border
                    } ${
                      color === c
                        ? 'ring-2 ring-[#b8860b] shadow-xs font-bold scale-102'
                        : 'opacity-75 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor:
                        c === 'yellow'
                          ? '#fef9c3'
                          : c === 'pink'
                          ? '#fce7f3'
                          : c === 'green'
                          ? '#dcfce7'
                          : '#e0f2fe',
                      color: '#2c1810',
                    }}
                  >
                    <span>{cfg.name}</span>
                    {color === c && <Check className="w-3 h-3 text-[#b8860b]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DateTime field */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-mono-vintage text-[#735e51] dark:text-[#bfb0a1] mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>작성 날짜 및 시간</span>
            </label>
            <input
              type="text"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              placeholder="예: 2026. 10. 11 (일) 16:18"
              className="w-full rounded-xl border border-[#d6c7b0] dark:border-[#5c4d3e] bg-[#fdfbf6] dark:bg-[#2b2520] px-3.5 py-2 text-xs font-mono-vintage text-[#2c1810] dark:text-[#f3ece0] focus:ring-2 focus:ring-[#b8860b]/40 focus:border-[#b8860b] focus:outline-hidden"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-mono-vintage text-[#735e51] dark:text-[#bfb0a1] mb-1">
              메모 내용
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-xl border border-[#d6c7b0] dark:border-[#5c4d3e] bg-[#fdfbf6] dark:bg-[#2b2520] p-3 text-sm font-body-vintage text-[#2c1810] dark:text-[#f3ece0] focus:ring-2 focus:ring-[#b8860b]/40 focus:border-[#b8860b] focus:outline-hidden"
              placeholder="내용을 입력하세요..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e5d8c3] dark:border-[#3d3228]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono-vintage text-[#735e51] dark:text-[#a89686] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-mono-vintage font-bold bg-[#b8860b] hover:bg-[#c99411] text-white shadow-xs transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>구글 시트에 저장</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
