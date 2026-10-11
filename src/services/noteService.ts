import { Note, NoteCategory, NoteColor, COLOR_TO_NUMBER, parseNoteColor } from '../types/note';
import { formatKoreanDateTime } from '../utils/date';

export interface SheetNoteRow {
  rowIndex?: number;
  timestamp: string; // A열: 시트기록날짜및시간
  datetime: string;  // B열: 메모생성날짜및시간
  category: string;  // C열: 메모범주
  content: string;   // D열: 메모내용
  color: number | string; // E열: 메모색상 (숫자 1~4)
  state: string;     // F열: 체크 상태 ('완료'/'진행중')
  order: number;     // G열: 메모순서
}

/**
 * Fetch all notes from Google Sheets via Next.js API proxy
 */
export async function getNotesFromSheet(): Promise<Note[]> {
  try {
    const res = await fetch('/api/notes?action=read', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) {
      throw new Error(json.error || '구글 시트에서 데이터를 불러오지 못했습니다.');
    }

    return json.data.map((row: SheetNoteRow, index: number) => {
      const parsedColor = parseNoteColor(row.color);
      // 고유하고 충돌 없는 React key & ID 생성
      const uniqueId = `sheet_${row.rowIndex ?? index + 2}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      
      return {
        id: uniqueId,
        rowIndex: row.rowIndex,
        timestamp: String(row.timestamp || ''),
        content: row.content || '',
        category: (row.category || '할 일') as NoteCategory,
        color: parsedColor,
        colorCode: typeof row.color === 'number' ? row.color : COLOR_TO_NUMBER[parsedColor],
        createdAt: row.datetime || formatKoreanDateTime(new Date().toISOString()),
        state: String(row.state || '진행중'),
        order: Number(row.order ?? index),
        rotation: +(Math.random() * 2.4 - 1.2).toFixed(1),
      };
    });
  } catch (error) {
    console.warn('Google Sheets fetch failed, falling back to local storage:', error);
    throw error;
  }
}

/**
 * Create a new note in Google Sheets
 */
export async function createNoteInSheet(params: {
  content: string;
  category: NoteCategory;
  color: NoteColor;
  datetime?: string;
  order?: number;
  state?: string;
}): Promise<{ rowIndex?: number; timestamp: string; datetime: string }> {
  const now = new Date();
  const nowFormatted = formatKoreanDateTime(now.toISOString());
  
  const timestamp = nowFormatted;
  const datetime = params.datetime || nowFormatted;
  const colorCode = COLOR_TO_NUMBER[params.color] || 1;
  const state = params.state || '진행중';

  const payload = {
    action: 'create',
    timestamp,
    datetime,
    category: params.category,
    content: params.content,
    color: colorCode,
    state,
    order: params.order ?? 0,
  };

  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || '구글 시트 저장 실패');
  }

  return {
    rowIndex: json.note?.rowIndex,
    timestamp: json.note?.timestamp || timestamp,
    datetime: json.note?.datetime || datetime,
  };
}

/**
 * Update a note in Google Sheets
 */
export async function updateNoteInSheet(params: {
  timestamp?: string;
  rowIndex?: number;
  content?: string;
  category?: NoteCategory;
  color?: NoteColor;
  datetime?: string;
  state?: string;
  order?: number;
}): Promise<void> {
  const payload: Record<string, any> = {
    action: 'update',
    timestamp: params.timestamp,
    rowIndex: params.rowIndex,
    content: params.content,
  };

  if (params.category !== undefined) payload.category = params.category;
  if (params.color !== undefined) payload.color = COLOR_TO_NUMBER[params.color] || 1;
  if (params.datetime !== undefined) payload.datetime = params.datetime;
  if (params.state !== undefined) payload.state = params.state;
  if (params.order !== undefined) payload.order = params.order;

  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || '구글 시트 수정 실패');
  }
}

/**
 * Delete a note from Google Sheets immediately
 */
export async function deleteNoteFromSheet(params: {
  timestamp?: string;
  rowIndex?: number;
  content?: string;
}): Promise<void> {
  const payload = {
    action: 'delete',
    timestamp: params.timestamp,
    rowIndex: params.rowIndex,
    content: params.content,
    hardDelete: true,
  };

  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || '구글 시트 삭제 실패');
  }
}

/**
 * Reorder notes in Google Sheets
 */
export async function reorderNotesInSheet(orders: { timestamp?: string; rowIndex?: number; content?: string; order: number }[]): Promise<void> {
  const payload = {
    action: 'reorder',
    orders,
  };

  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || '구글 시트 순서 변경 실패');
  }
}
