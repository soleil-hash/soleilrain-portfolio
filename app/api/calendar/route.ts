import { NextResponse } from 'next/server';

const CALENDAR_ID = '372756d46b05ccbb65015156a2b0a3418c8d71d02301c40c02c09196c2875c00@group.calendar.google.com';
const API_KEY = process.env.GOOGLE_API_KEY!;

export async function GET() {
  const now = new Date().toISOString();
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${now}&timeMax=${new Date(Date.now() + 1).toISOString()}&singleEvents=true&orderBy=startTime`;

  // Check if any event is happening right now
  const checkNow = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${new Date(Date.now() - 1000).toISOString()}&timeMax=${new Date(Date.now() + 1000).toISOString()}&singleEvents=true&orderBy=startTime`;

  try {
    const res = await fetch(checkNow, { cache: 'no-store' });
    const data = await res.json();
    const events = data.items ?? [];
    const active = events.find((e: any) => {
      const start = new Date(e.start?.dateTime ?? e.start?.date);
      const end = new Date(e.end?.dateTime ?? e.end?.date);
      const now = new Date();
      return start <= now && end >= now;
    });

    return NextResponse.json({
      booked: !!active,
      eventName: active?.summary ?? null,
      eventEnd: active?.end?.dateTime ?? active?.end?.date ?? null,
    });
  } catch (e) {
    return NextResponse.json({ booked: false, eventName: null, eventEnd: null });
  }
}
