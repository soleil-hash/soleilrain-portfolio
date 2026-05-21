import { NextRequest, NextResponse } from 'next/server';

const UPSTASH_URL = process.env.UPSTASH_URL!;
const UPSTASH_TOKEN = process.env.UPSTASH_TOKEN!;

async function upstash(command: string[]) {
  const res = await fetch(`${UPSTASH_URL}/${command.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    cache: 'no-store',
  });
  return res.json();
}

export async function GET() {
  const [statusRes, p0Res, p1Res, p2Res] = await Promise.all([
    upstash(['GET', 'car:status']),
    upstash(['GET', 'car:priority:0']),
    upstash(['GET', 'car:priority:1']),
    upstash(['GET', 'car:priority:2']),
  ]);

  return NextResponse.json({
    status: statusRes.result ?? 'free',
    priorities: [
      p0Res.result ?? 'available',
      p1Res.result ?? 'available',
      p2Res.result ?? 'available',
    ],
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.type === 'status') {
    await upstash(['SET', 'car:status', body.value]);
    return NextResponse.json({ ok: true });
  }

  if (body.type === 'priority') {
    await upstash(['SET', `car:priority:${body.index}`, body.value]);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
}
