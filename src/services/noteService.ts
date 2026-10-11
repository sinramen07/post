import { Note, NoteCategory, NoteColor, COLOR_TO_NUMBER, parseNoteColor } from '../types/note';
import { formatKoreanDateTime } from '../utils/date';

export interface SheetNoteRow {
  rowIndex?: number;
  timestamp: string; // A열: 시트기록날짜및시간 (날짜 시간 타입)
  datetime: string;  // B열: 메모생성날짜및시간 (날짜 시간 타입)
  category: string;  // C열: 메모범주 (문자 타입)
  content: string;   // D열: 메모내용 (문자 타입)
  color: number | string; // E열: 메모색상 (숫자 타입 1~4)
  state: string;     // F열: 체크 상태 (문자 타입 '완료'/'진행중')
  order: number;     // G열: 메모순서 (숫자 타입)
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
      const rowId = String(row.timestamp || `row_${index}_${Date.now()}`);
      
      return {
        id: rowId,
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
}): Promise<Note> {
  const now = new Date();
  const nowFormatted = formatKoreanDateTime(now.toISOString());
  
  // A열: timestamp (시트기록날짜및시간)
  const timestamp = nowFormatted;
  // B열: datetime (메모생성날짜및시간)
  const datetime = params.datetime || nowFormatted;
  // E열: color (숫자 타입 1~4)
  const colorCode = COLOR_TO_NUMBER[params.color] || 1;
  // F열: state ('진행중' 또는 '완료')
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
    id: timestamp,
    timestamp,
    content: params.content,
    category: params.category,
    color: params.color,
    colorCode,
    createdAt: datetime,
    state,
    order: params.order ?? 0,
    rotation: +(Math.random() * 2.4 - 1.2).toFixed(1),
    isNew: true,
  };
}

/**
 * Update a note in Google Sheets
 */
export async function updateNoteInSheet(params: {
  timestamp: string;
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
  };

  if (params.content !== undefined) payload.content = params.content;
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
export async function deleteNoteFromSheet(timestamp: string): Promise<void> {
  const payload = {
    action: 'delete',
    timestamp: String(timestamp),
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
export async function reorderNotesInSheet(orders: { timestamp: string; order: number }[]): Promise<void> {
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
