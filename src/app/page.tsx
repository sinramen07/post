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
    const tempId = String(Date.now());
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

    const updated = [optimisticNote, ...notes];
    setNotes(updated);
    saveToLocal(updated);

    try {
      const created = await createNoteInSheet({
        content,
        category,
        color,
        datetime: formattedDate,
        state: '진행중',
        order: 0,
      });

      setNotes((prev) =>
        prev.map((n) => (n.id === tempId ? { ...created, isNew: false } : n))
      );
    } catch (err) {
      console.error('Failed to sync new note to sheet:', err);
    }

    setTimeout(() => {
      setNotes((prev) =>
        prev.map((n) => (n.id === tempId ? { ...n, isNew: false } : n))
      );
    }, 600);
  };

  // DELETE Note immediately
  const handleDeleteNote = async (id: string) => {
    const nextNotes = notes.filter((n) => n.id !== id);
    setNotes(nextNotes);
    saveToLocal(nextNotes);

    try {
      await deleteNoteFromSheet(id);
    } catch (err) {
      console.error('Failed to delete note from sheet:', err);
    }
  };

  // TOGGLE COMPLETE (F열: 체크 버튼을 눌러 완료가 되면 '완료'로 표시)
  const handleToggleComplete = async (note: Note) => {
    const isCurrentlyCompleted = note.state === '완료' || note.state === '체크';
    const nextState = isCurrentlyCompleted ? '진행중' : '완료';

    const updated = notes.map((n) =>
      n.id === note.id ? { ...n, state: nextState } : n
    );
    setNotes(updated);
    saveToLocal(updated);

    try {
      await updateNoteInSheet({
        timestamp: note.id,
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
    const updated = notes.map((n) =>
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
    setNotes(updated);
    saveToLocal(updated);

    try {
      await updateNoteInSheet({
        timestamp: id,
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
        timestamp: item.id,
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
