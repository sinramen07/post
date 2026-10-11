import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

// Helper to check if URL is configured
function getScriptUrl() {
  if (!GOOGLE_SCRIPT_URL) {
    throw new Error('NEXT_PUBLIC_GOOGLE_SCRIPT_URL 환경 변수가 설정되지 않았습니다.');
  }
  return GOOGLE_SCRIPT_URL;
}

// 1. GET - Fetch notes from Google Sheet
export async function GET(request: NextRequest) {
  try {
    const url = getScriptUrl();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'read';
    const timestamp = searchParams.get('timestamp') || '';

    const targetUrl = new URL(url);
    targetUrl.searchParams.set('action', action);
    if (timestamp) {
      targetUrl.searchParams.set('timestamp', timestamp);
    }

    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
      redirect: 'follow',
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Google Apps Script 응답 오류: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching from Google Apps Script:', error);
    return NextResponse.json(
      { success: false, error: error.message || '서버 통신 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 2. POST - Handle Create, Update, Delete, Reorder
export async function POST(request: NextRequest) {
  try {
    const url = getScriptUrl();
    const body = await request.json();

    // Google Apps Script doPost handles { action: 'create' | 'update' | 'delete' | 'reorder', ... }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      redirect: 'follow',
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Google Apps Script 응답 오류: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error sending to Google Apps Script:', error);
    return NextResponse.json(
      { success: false, error: error.message || '서버 통신 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
