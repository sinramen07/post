/**
 * ==============================================================================
 * Post-it Todo List - Google Apps Script (GAS) CRUD API
 * Spreadsheet ID: 1YrGAxsrAQm2WIXUiytX9lUTtZVG7OKaf-Gcpv1uAPoI
 * 
 * 시트 헤더 필드 규격 (1행):
 * 1. A열: timestamp (시트기록날짜및시간, 날짜 시간 타입)
 * 2. B열: datetime  (메모생성날짜및시간, 날짜 시간 타입)
 * 3. C열: category  (메모범주, 문자 타입)
 * 4. D열: content   (메모내용, 문자 타입)
 * 5. E열: color     (메모색상, 색상(숫자) 타입: 1:노랑, 2:분홍, 3:초록, 4:파랑)
 * 6. F열: state     (체크 버튼 완료 시 '완료', 기본 '진행중', 문자 타입)
 * 7. G열: order     (메모순서, 숫자 타입)
 * ==============================================================================
 */

const SPREADSHEET_ID = "1YrGAxsrAQm2WIXUiytX9lUTtZVG7OKaf-Gcpv1uAPoI";
const SHEET_NAME = "Sheet1";

// 색상 영문/숫자 매핑 유틸
function normalizeColorCode(color) {
  if (typeof color === "number") return color;
  const num = Number(color);
  if (!isNaN(num) && num >= 1 && num <= 4) return num;
  
  const map = { yellow: 1, pink: 2, green: 3, blue: 4 };
  return map[String(color).toLowerCase()] || 1;
}

function getSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

  // 시트가 비어있다면 헤더 자동 생성
  if (sheet.getLastRow() === 0) {
    const headers = ["timestamp", "datetime", "category", "content", "color", "state", "order"];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#f3eedc");
  }
  return sheet;
}

/**
 * 날짜 객체 포맷 변환 유틸
 */
function formatDateValue(val) {
  if (val instanceof Date) {
    return Utilities.formatDate(val, "Asia/Seoul", "yyyy. MM. dd (E) HH:mm");
  }
  return String(val || "");
}

/**
 * 정확한 타겟 행(Row) 인덱스 검색 함수
 * (동일 분초에 작성된 메모가 여러 개 있어도 정확한 행을 찾아 삭제/수정)
 */
function findTargetRowIndex(sheet, data) {
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return -1;

  const targetRow = data.rowIndex ? Number(data.rowIndex) : -1;
  const targetTs = data.timestamp ? String(data.timestamp) : "";
  const targetContent = data.content ? String(data.content) : "";

  // 1순위: 전달된 rowIndex의 내용(content) 또는 timestamp가 일치하는지 확인
  if (targetRow > 1 && targetRow <= values.length) {
    const row = values[targetRow - 1];
    const rowContent = String(row[3]);
    const rowTs = formatDateValue(row[0]);
    if (!targetContent || rowContent === targetContent) {
      return targetRow;
    }
    if (rowTs === targetTs) {
      return targetRow;
    }
  }

  // 2순위: 내용(content)과 timestamp가 모두 일치하는 행 검색 (역순: 최신순)
  if (targetContent && targetTs) {
    for (let i = values.length - 1; i >= 1; i--) {
      const rowContent = String(values[i][3]);
      const rowTs = formatDateValue(values[i][0]);
      if (rowContent === targetContent && (rowTs === targetTs || String(values[i][0]) === targetTs)) {
        return i + 1;
      }
    }
  }

  // 3순위: 내용(content)으로 고유 행 검색 (역순)
  if (targetContent) {
    for (let i = values.length - 1; i >= 1; i--) {
      const rowContent = String(values[i][3]);
      if (rowContent === targetContent) {
        return i + 1;
      }
    }
  }

  // 4순위: timestamp로 검색 (역순)
  if (targetTs) {
    for (let i = values.length - 1; i >= 1; i--) {
      const rowTs = formatDateValue(values[i][0]);
      if (rowTs === targetTs || String(values[i][0]) === targetTs) {
        return i + 1;
      }
    }
  }

  return -1;
}

/**
 * 1. READ (조회)
 */
function readNotes(params = {}) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const rows = data.slice(1);
  const notes = rows.map((row, index) => {
    const rawTimestamp = formatDateValue(row[0]);
    const rawDatetime = formatDateValue(row[1]);
    const colorCode = Number(row[4]) || normalizeColorCode(row[4]);
    const stateVal = String(row[5] || "진행중");

    return {
      rowIndex: index + 2,
      timestamp: rawTimestamp,
      datetime: rawDatetime,
      category: String(row[2] || "할 일"),
      content: String(row[3] || ""),
      color: colorCode, // E열: 숫자 타입
      state: stateVal,  // F열: 완료 여부 문자 타입 ('완료' / '진행중')
      order: Number(row[6] ?? index), // G열: 숫자 타입
    };
  });

  if (params.timestamp) {
    return notes.filter(n => n.timestamp === String(params.timestamp));
  }

  return notes.sort((a, b) => a.order - b.order);
}

/**
 * 2. CREATE (추가)
 */
function createNote(data) {
  const sheet = getSheet();
  const now = new Date();
  
  // A열: timestamp (시트기록날짜및시간)
  const timestamp = data.timestamp ? formatDateValue(data.timestamp) : formatDateValue(now);
  
  // B열: datetime (메모생성날짜및시간)
  const datetime = data.datetime ? formatDateValue(data.datetime) : formatDateValue(now);
  
  // C열: category (메모범주)
  const category = String(data.category || "할 일");
  
  // D열: content (메모내용)
  const content = String(data.content || "");
  
  // E열: color (메모색상, 숫자 타입 1~4)
  const color = normalizeColorCode(data.color);
  
  // F열: state ('완료' 또는 '진행중')
  const state = String(data.state || "진행중");
  
  // G열: order (숫자 타입)
  const order = data.order !== undefined ? Number(data.order) : (sheet.getLastRow() - 1);

  sheet.appendRow([timestamp, datetime, category, content, color, state, order]);

  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 5).setNumberFormat("0"); // color 숫자
  sheet.getRange(lastRow, 7).setNumberFormat("0"); // order 숫자

  return {
    success: true,
    message: "메모가 성공적으로 추가되었습니다.",
    note: {
      rowIndex: lastRow,
      timestamp,
      datetime,
      category,
      content,
      color,
      state,
      order
    }
  };
}

/**
 * 3. UPDATE (수정)
 */
function updateNote(data) {
  const sheet = getSheet();
  const targetRowIndex = findTargetRowIndex(sheet, data);

  if (targetRowIndex === -1) {
    throw new Error(`수정할 메모를 찾을 수 없습니다. (내용: ${data.content || data.timestamp})`);
  }

  const values = sheet.getDataRange().getValues();
  const curr = values[targetRowIndex - 1];

  const updatedTimestamp = formatDateValue(curr[0]);
  const updatedDatetime = data.datetime !== undefined ? formatDateValue(data.datetime) : formatDateValue(curr[1]);
  const updatedCategory = data.category !== undefined ? String(data.category) : String(curr[2]);
  const updatedContent = data.content !== undefined ? String(data.content) : String(curr[3]);
  const updatedColor = data.color !== undefined ? normalizeColorCode(data.color) : normalizeColorCode(curr[4]);
  const updatedState = data.state !== undefined ? String(data.state) : String(curr[5]);
  const updatedOrder = data.order !== undefined ? Number(data.order) : Number(curr[6]);

  sheet.getRange(targetRowIndex, 1, 1, 7).setValues([[
    updatedTimestamp,
    updatedDatetime,
    updatedCategory,
    updatedContent,
    updatedColor,
    updatedState,
    updatedOrder
  ]]);

  return {
    success: true,
    message: "메모가 성공적으로 수정되었습니다.",
    note: {
      rowIndex: targetRowIndex,
      timestamp: updatedTimestamp,
      datetime: updatedDatetime,
      category: updatedCategory,
      content: updatedContent,
      color: updatedColor,
      state: updatedState,
      order: updatedOrder
    }
  };
}

/**
 * 4. DELETE (삭제)
 */
function deleteNote(data) {
  const sheet = getSheet();
  const targetRowIndex = findTargetRowIndex(sheet, data);

  if (targetRowIndex === -1) {
    throw new Error(`삭제할 메모를 찾을 수 없습니다. (내용: ${data.content || data.timestamp})`);
  }

  sheet.deleteRow(targetRowIndex);
  return { success: true, message: "메모가 완전히 삭제되었습니다.", deletedRow: targetRowIndex };
}

/**
 * 5. BATCH REORDER (순서 일괄 업데이트)
 */
function reorderNotes(orders) {
  if (!Array.isArray(orders)) throw new Error("orders 배열이 필요합니다.");
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();

  orders.forEach(item => {
    const targetIdx = findTargetRowIndex(sheet, item);
    if (targetIdx > 1) {
      sheet.getRange(targetIdx, 7).setValue(Number(item.order));
    }
  });

  return { success: true, message: "순서가 업데이트되었습니다." };
}

// Web App 엔드포인트 핸들러
function doGet(e) {
  try {
    const params = e ? e.parameter : {};
    const action = params.action || "read";
    let result;
    if (action === "read") result = { success: true, data: readNotes(params) };
    else if (action === "delete") result = deleteNote(params);
    else result = { success: false, error: "지원하지 않는 GET 액션입니다." };
    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({ success: false, error: err.message });
  }
}

function doPost(e) {
  try {
    const payload = e && e.postData ? JSON.parse(e.postData.contents) : (e.parameter || {});
    let result;
    switch (payload.action) {
      case "read": result = { success: true, data: readNotes(payload) }; break;
      case "create": result = createNote(payload); break;
      case "update": result = updateNote(payload); break;
      case "delete": result = deleteNote(payload); break;
      case "reorder": result = reorderNotes(payload.orders); break;
      default: result = { success: false, error: "유효한 action이 필요합니다." }; break;
    }
    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({ success: false, error: err.message });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
