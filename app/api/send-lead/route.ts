// app/api/send-lead/route.ts (or pages/api/send-lead.ts)
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();

  const username = 'nnXSEUPwdF0xU33lqHZSKS6tTBaitBqAm';
  const password = 'bgSMUyYZLmk9Y0F';

  const auth = Buffer.from(`${username}:${password}`).toString('base64');

  try {
    const res = await fetch('https://partners.lend.com.au/api/leads', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Version: '20190501',
        Environment: 'live',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(data),
    });

    const responseBody = await res.text();
    console.log('Response from Lend API:', responseBody);

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
