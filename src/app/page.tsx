'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import NoteInput from '@/components/NoteInput';
import NoteCard from '@/components/NoteCard';
import EditNoteModal from '@/components/EditNoteModal';
import Footer from '@/components/Footer';
import VintageDropdown, { DropdownOption } from '@/components/VintageDropdown';
import {
  Note,
  NoteCategory,
  FilterCategory,
  NoteColor,
  FILTER_OPTIONS,
} from '@/types/note';
import {
  getNotesFromSheet,
  createNoteInSheet,
  updateNoteInSheet,
  deleteNoteFromSheet,
  reorderNotesInSheet,
} from '@/services/noteService';
import { formatKoreanDateTime } from '@/utils/date';
import { Filter } from 'lucide-react';

const FILTER_DROPDOWN_OPTIONS: DropdownOption<FilterCategory>[] = FILTER_OPTIONS.map((opt) => ({
  value: opt,
  label: opt,
}));

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('전체');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const saveToLocal = (data: Note[]) => {
    try {
      localStorage.setItem('postit_notes', JSON.stringify(data));
    } catch {
      // storage error
    }
  };

  const loadNotes = useCallback(async () => {
    try {
      const sheetNotes = await getNotesFromSheet();
      if (sheetNotes && Array.isArray(sheetNotes) && sheetNotes.length > 0) {
        setNotes(sheetNotes);
        saveToLocal(sheetNotes);
        return;
      }
      
      const saved = localStorage.getItem('postit_notes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotes(parsed);
          return;
        }
      }
      setNotes([]);
    } catch {
      try {
        const saved = localStorage.getItem('postit_notes');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setNotes(parsed);
            return;
          }
        }
      } catch {
        // empty fallback
      }
      setNotes([]);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // CREATE Note
  const handleAddNote = async (
    content: string,
    category: NoteCategory,
    color: NoteColor
  ) => {
    const randomTilt = +(Math.random() * 3 - 1.5).toFixed(1);
    // 고유한 클라이언트 식별자 생성 (React 키 충돌 방지)
    const tempId = `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const formattedDate = formatKoreanDateTime(new Date().toISOString());

    const optimisticNote: Note = {
      id: tempId,
      timestamp: formattedDate,
      content,
      category,
      color,
      createdAt: formattedDate,
      state: '진행중',
      order: 0,
      rotation: randomTilt,
      isNew: true,
    };

    // 상태 및 로컬 스토리지 업데이트
    setNotes((prevNotes) => {
      const next = [optimisticNote, ...prevNotes];
      saveToLocal(next);
      return next;
    });

    try {
      const created = await createNoteInSheet({
        content,
        category,
        color,
        datetime: formattedDate,
        state: '진행중',
        order: 0,
      });

      // 구글 시트 등록 결과 반영 (기존 tempId를 유지하여 React 재렌더링 오류 방지)
      setNotes((prevNotes) => {
        const next = prevNotes.map((n) =>
          n.id === tempId
            ? {
                ...n,
                rowIndex: created.rowIndex,
                timestamp: created.timestamp || n.timestamp,
                isNew: false,
              }
            : n
        );
        saveToLocal(next);
        return next;
      });
    } catch (err) {
      console.error('Failed to sync new note to sheet:', err);
    }
  };

  // DELETE Note (고유 식별자 및 복합 키로 지정 메모만 정확히 삭제)
  const handleDeleteNote = async (id: string) => {
    const noteToDelete = notes.find((n) => n.id === id);
    if (!noteToDelete) return;

    setNotes((prevNotes) => {
      const next = prevNotes.filter((n) => n.id !== id);
      saveToLocal(next);
      return next;
    });

    try {
      await deleteNoteFromSheet({
        timestamp: noteToDelete.timestamp,
        rowIndex: noteToDelete.rowIndex,
        content: noteToDelete.content,
      });
    } catch (err) {
      console.error('Failed to delete note from sheet:', err);
    }
  };

  // TOGGLE COMPLETE (F열: 체크 버튼 클릭 시 해당 메모만 정확히 '완료'/'진행중' 토글)
  const handleToggleComplete = async (note: Note) => {
    const isCurrentlyCompleted = note.state === '완료' || note.state === '체크';
    const nextState = isCurrentlyCompleted ? '진행중' : '완료';

    setNotes((prevNotes) => {
      const next = prevNotes.map((n) =>
        n.id === note.id ? { ...n, state: nextState } : n
      );
      saveToLocal(next);
      return next;
    });

    try {
      await updateNoteInSheet({
        timestamp: note.timestamp,
        rowIndex: note.rowIndex,
        content: note.content,
        state: nextState,
      });
    } catch (err) {
      console.error('Failed to update complete state in sheet:', err);
    }
  };

  // EDIT Note
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const handleSaveEdit = async (
    id: string,
    newContent: string,
    newCategory: NoteCategory,
    newColor: NoteColor,
    newDatetime?: string
  ) => {
    const targetNote = notes.find((n) => n.id === id);
    if (!targetNote) return;

    setNotes((prevNotes) => {
      const next = prevNotes.map((n) =>
        n.id === id
          ? {
              ...n,
              content: newContent,
              category: newCategory,
              color: newColor,
              createdAt: newDatetime || n.createdAt,
            }
          : n
      );
      saveToLocal(next);
      return next;
    });

    try {
      await updateNoteInSheet({
        timestamp: targetNote.timestamp,
        rowIndex: targetNote.rowIndex,
        content: newContent,
        category: newCategory,
        color: newColor,
        datetime: newDatetime,
      });
    } catch (err) {
      console.error('Failed to update note in sheet:', err);
    }
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }
    reorderNotes(draggedIndex, targetIndex);
    setDraggedIndex(null);
  };

  const reorderNotes = async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const reordered = [...notes];
    const [movedItem] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, movedItem);

    const normalized = reordered.map((item, idx) => ({ ...item, order: idx }));
    setNotes(normalized);
    saveToLocal(normalized);

    try {
      const orderPayload = normalized.map((item) => ({
        timestamp: item.timestamp,
        rowIndex: item.rowIndex,
        content: item.content,
        order: item.order,
      }));
      await reorderNotesInSheet(orderPayload);
    } catch (err) {
      console.error('Failed to sync reorder to sheet:', err);
    }
  };

  const filteredNotes = notes.filter((n) => {
    if (selectedFilter === '전체') return true;
    return n.category === selectedFilter;
  });

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-200 selection:text-amber-950">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <Header />

        {/* Note Input Box */}
        <NoteInput onAddNote={handleAddNote} />

        {/* Note List Section */}
        <section className="mt-10 sm:mt-14 mb-16">
          {/* Section Toolbar */}
          <div className="flex flex-row items-center justify-between gap-4 pb-4 border-b border-[#dfd4c0]/80 dark:border-[#3f342a]">
            {/* Title */}
            <div className="flex items-center gap-2.5">
              <h2 className="font-serif-vintage text-2xl font-bold contrast-heading">
                내 포스트잇 목록
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-vintage font-bold contrast-badge">
                {notes.length}
              </span>
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-vintage contrast-heading font-medium">
                필터:
              </span>
              <VintageDropdown<FilterCategory>
                id="filter-dropdown"
                ariaLabel="카테고리 필터링 드롭다운"
                value={selectedFilter}
                onChange={setSelectedFilter}
                options={FILTER_DROPDOWN_OPTIONS}
                prefixIcon={<Filter className="w-3.5 h-3.5 text-[#b8860b]" />}
                className="w-36 sm:w-40"
              />
            </div>
          </div>

          {/* Grid Layout: Maximum 4 Notes per Row */}
          <div className="mt-8">
            {filteredNotes.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredNotes.map((note, index) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    index={index}
                    isDragging={draggedIndex === index}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                    onToggleComplete={handleToggleComplete}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onTouchMoveReorder={reorderNotes}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Edit Note Modal */}
        <EditNoteModal
          note={editingNote}
          isOpen={editingNote !== null}
          onClose={() => setEditingNote(null)}
          onSave={handleSaveEdit}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
