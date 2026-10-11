export type NoteCategory = '할 일' | '아이디어' | '기타';
export type FilterCategory = '전체' | NoteCategory;
export type NoteColor = 'yellow' | 'pink' | 'green' | 'blue';

export type NoteState = '진행중' | '완료' | '체크';

export interface Note {
  id: string; // Client unique identifier (guaranteed unique for React keys)
  rowIndex?: number; // Row index in Google Sheet (for precision updates/deletions)
  timestamp?: string; // A열: timestamp (시트기록날짜및시간)
  createdAt: string; // B열: datetime (메모생성날짜및시간)
  category: NoteCategory; // C열: category (메모범주)
  content: string; // D열: content (메모내용)
  color: NoteColor; // E열: color (메모색상)
  colorCode?: number; // E열: 1:노랑, 2:분홍, 3:초록, 4:파랑
  state: string; // F열: state ('완료', '체크', '진행중')
  order: number; // G열: order (메모순서)
  rotation?: number;
  badgeTag?: string;
  isNew?: boolean;
}

export const CATEGORIES: NoteCategory[] = ['할 일', '아이디어', '기타'];
export const FILTER_OPTIONS: FilterCategory[] = ['전체', '할 일', '아이디어', '기타'];
export const COLORS: NoteColor[] = ['yellow', 'pink', 'green', 'blue'];

// E열: 메모색상, 색상(숫자) 타입 매핑 (1: 노란색, 2: 분홍색, 3: 초록색, 4: 파랑색)
export const COLOR_TO_NUMBER: Record<NoteColor, number> = {
  yellow: 1,
  pink: 2,
  green: 3,
  blue: 4,
};

export const NUMBER_TO_COLOR: Record<number, NoteColor> = {
  1: 'yellow',
  2: 'pink',
  3: 'green',
  4: 'blue',
};

export function parseNoteColor(val: unknown): NoteColor {
  if (typeof val === 'number') {
    return NUMBER_TO_COLOR[val] || 'yellow';
  }
  const num = Number(val);
  if (!isNaN(num) && NUMBER_TO_COLOR[num]) {
    return NUMBER_TO_COLOR[num];
  }
  const str = String(val).toLowerCase();
  if (str === 'yellow' || str === 'pink' || str === 'green' || str === 'blue') {
    return str as NoteColor;
  }
  return 'yellow';
}

export const COLOR_CONFIG = {
  yellow: {
    code: 1,
    name: '노란색',
    lightBg: 'bg-[#fff9db] hover:bg-[#fff7c8]',
    darkBg: 'dark:bg-[#2e2912] dark:hover:bg-[#342e14]',
    border: 'border-[#f3df7b] dark:border-[#856a1e]',
    tape: 'bg-[#fefce8]/90 dark:bg-[#524619]/70',
    badgeBg: 'bg-[#fef08a] dark:bg-[#4a3f12]',
    badgeText: 'text-[#854d0e] dark:text-[#fef08a]',
    textColor: 'text-[#2c1810] dark:text-[#faebd7]',
  },
  pink: {
    code: 2,
    name: '분홍색',
    lightBg: 'bg-[#faeade] hover:bg-[#f7dfd1]',
    darkBg: 'dark:bg-[#331c22] dark:hover:bg-[#3d2028]',
    border: 'border-[#f2c1b8] dark:border-[#8e4554]',
    tape: 'bg-[#fff1f2]/90 dark:bg-[#572733]/70',
    badgeBg: 'bg-[#fbcfe8] dark:bg-[#4f2030]',
    badgeText: 'text-[#9f1239] dark:text-[#fbcfe8]',
    textColor: 'text-[#2c1810] dark:text-[#faebd7]',
  },
  green: {
    code: 3,
    name: '초록색',
    lightBg: 'bg-[#e8f5e9] hover:bg-[#dcf0df]',
    darkBg: 'dark:bg-[#182b20] dark:hover:bg-[#1d3527]',
    border: 'border-[#bbf0cb] dark:border-[#336848]',
    tape: 'bg-[#f0fdf4]/90 dark:bg-[#254933]/70',
    badgeBg: 'bg-[#bbf7d0] dark:bg-[#204a30]',
    badgeText: 'text-[#166534] dark:text-[#bbf7d0]',
    textColor: 'text-[#2c1810] dark:text-[#faebd7]',
  },
  blue: {
    code: 4,
    name: '파랑색',
    lightBg: 'bg-[#e3f2fd] hover:bg-[#d8ecfc]',
    darkBg: 'dark:bg-[#162739] dark:hover:bg-[#1b3147]',
    border: 'border-[#bbdefb] dark:border-[#2f5d88]',
    tape: 'bg-[#f0f9ff]/90 dark:bg-[#234668]/70',
    badgeBg: 'bg-[#bae6fd] dark:bg-[#1e496d]',
    badgeText: 'text-[#075985] dark:text-[#bae6fd]',
    textColor: 'text-[#2c1810] dark:text-[#faebd7]',
  },
} as const;
