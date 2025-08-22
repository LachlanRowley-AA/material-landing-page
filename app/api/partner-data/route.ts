import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const accountKey = searchParams.get('accountKey');

  if (!accountKey) return NextResponse.json({ error: 'Missing accountKey' }, { status: 400 });

  try {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbydtvQbFhphQj7RaL2PvMhHyty-R3auBMWncfX0PaYCFeVhXhgziONL_0qzsEDAH8R7ew/exec?accountKey=${encodeURIComponent(accountKey)}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return NextResponse.json({ error: `Upstream error ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}
