'use client';

import React, { useRef, useState } from 'react';
import { Note, COLOR_CONFIG } from '../types/note';
import { formatKoreanDateTime } from '../utils/date';
import { Trash2, Edit3, GripVertical, Calendar, CheckCircle2, Circle } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  index: number;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onToggleComplete?: (note: Note) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onTouchMoveReorder?: (fromIndex: number, toIndex: number) => void;
  isDragging?: boolean;
}

export default function NoteCard({
  note,
  index,
  onEdit,
  onDelete,
  onToggleComplete,
  onDragStart,
  onDragOver,
  onDrop,
  onTouchMoveReorder,
  isDragging = false,
}: NoteCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const colorCfg = COLOR_CONFIG[note.color] || COLOR_CONFIG.yellow;
  const [isTouchActive, setIsTouchActive] = useState(false);
  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);

  const isCompleted = note.state === '완료' || note.state === '체크';

  // Touch Drag Support for Mobile Responsive Web
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartY.current = touch.clientY;
    touchStartX.current = touch.clientX;
    setIsTouchActive(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsTouchActive(false);
    if (!onTouchMoveReorder || !cardRef.current) return;

    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetCard = dropTarget?.closest('[data-note-index]');
    if (targetCard) {
      const targetIndex = Number(targetCard.getAttribute('data-note-index'));
      if (!isNaN(targetIndex) && targetIndex !== index) {
        onTouchMoveReorder(index, targetIndex);
      }
    }
  };

  return (
    <div
      ref={cardRef}
      data-note-index={index}
      draggable
      onDragStart={(e) => {
        if (typeof window !== 'undefined' && window.getSelection) {
          window.getSelection()?.removeAllRanges();
        }
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(index));
        onDragStart(e, index);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        onDragOver(e, index);
      }}
      onDrop={(e) => onDrop(e, index)}
      style={{
        ['--note-rot' as string]: `${note.rotation ?? 0}deg`,
        transform: isDragging || isTouchActive ? 'scale(1.05) rotate(0deg)' : `rotate(${note.rotation ?? 0}deg)`,
      }}
      className={`group relative rounded-xl border p-4.5 pt-5 pb-4 flex flex-col justify-between transition-all duration-200 select-none cursor-grab active:cursor-grabbing ${
        colorCfg.lightBg
      } ${colorCfg.darkBg} ${colorCfg.border} ${
        note.isNew ? 'animate-stick-slap' : ''
      } ${
        isDragging || isTouchActive
          ? 'z-40 opacity-75 shadow-2xl ring-2 ring-[#b8860b]'
          : 'shadow-md hover:shadow-xl hover:-translate-y-1'
      } ${isCompleted ? 'opacity-85' : ''} min-h-[220px]`}
    >
      {/* Translucent Washi Tape at Top */}
      <div
        className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-20 h-6.5 rounded-xs washi-tape ${colorCfg.tape} border border-black/5 dark:border-white/10 z-10 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity`}
      >
        <div className="w-10 h-0.5 border-b border-stone-400/30 dark:border-stone-300/20" />
      </div>

      {/* Card Header: Category Stamp & Action Buttons */}
      <div className="flex items-center justify-between gap-1 mb-2">
        {/* Category Stamp Badge & Completion State Badge */}
        <div className="flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-mono-vintage font-bold tracking-wider ${colorCfg.badgeBg} ${colorCfg.badgeText} border border-black/5 dark:border-white/10 shadow-2xs`}
          >
            #{note.category}
          </span>
          {isCompleted && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono-vintage font-bold bg-emerald-600 text-white dark:bg-emerald-500 shadow-2xs">
              완료
            </span>
          )}
        </div>

        {/* Action Controls: Check button, Drag Handle, Edit, Delete */}
        <div className="flex items-center gap-1">
          {/* F열: 체크 버튼 (완료 시 '완료' 또는 '체크'로 전환) */}
          {onToggleComplete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(note);
              }}
              className="p-1 rounded-md text-stone-500 hover:text-emerald-600 dark:text-stone-400 dark:hover:text-emerald-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
              title={isCompleted ? '미완료로 변경' : '완료로 체크'}
              aria-label={isCompleted ? '미완료로 변경' : '완료로 체크'}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950/50" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Drag Handle */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-200 cursor-grab active:cursor-grabbing hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="드래그하여 순서 변경"
            aria-label="순서 변경 핸들"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>

          {/* Edit Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            className="p-1 rounded-md text-stone-500 hover:text-[#b8860b] dark:text-stone-400 dark:hover:text-amber-300 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
            title="메모 편집"
            aria-label="메모 편집"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="p-1 rounded-md text-stone-500 hover:text-rose-600 dark:text-stone-400 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
            title="메모 삭제"
            aria-label="메모 삭제"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Note Body Text */}
      <div className="my-2 flex-1 ruled-lines py-1 select-none pointer-events-none">
        <p
          className={`font-body-vintage text-[14px] leading-6 whitespace-pre-wrap break-words select-none pointer-events-none ${colorCfg.textColor} ${
            isCompleted ? 'line-through opacity-60 italic' : ''
          }`}
        >
          {note.content}
        </p>
      </div>

      {/* Bottom Subtle Divider Line */}
      <div className="w-full border-t border-dashed border-stone-300/70 dark:border-stone-600/50 my-2" />

      {/* Card Footer: B열 datetime 표시 */}
      <div className="flex items-center justify-between text-[11px] font-mono-vintage select-none">
        <div
          className="flex items-center gap-1 text-stone-500/75 dark:text-stone-400/75 tracking-tight"
          title={`작성 일시: ${formatKoreanDateTime(note.createdAt)}`}
        >
          <Calendar className="w-3 h-3 opacity-70" />
          <span>{formatKoreanDateTime(note.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
