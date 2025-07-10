// app/api/send-lead/route.ts (or pages/api/send-lead.ts)
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();

  const username = 'lQg2HSOwNLgAmoqQqDe7ffpJkhtqhwXMK';
  const password = 'CGxG0EdIjGLR3xt';

  const auth = Buffer.from(`${username}:${password}`).toString('base64');

  try {
    const res = await fetch('https://partners.lend.com.au/api/leads', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Version: '20190501',
        Environment: 'sandbox',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(data),
    });

    const responseBody = await res.text();

    return NextResponse.json(
      {
        ok: res.ok,
        status: res.status,
        body: responseBody,
      },
      { status: res.status }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
