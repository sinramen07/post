/**
 * Formats ISO date into 'YYYY. MM. DD (요일) HH:mm'
 * Example: 2026. 10. 11 (일) 16:18
 */
export function formatKoreanDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = dayNames[date.getDay()];

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}. ${month}. ${day} (${dayOfWeek}) ${hours}:${minutes}`;
  } catch {
    return dateString;
  }
}
