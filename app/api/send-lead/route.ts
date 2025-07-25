import { NextRequest, NextResponse } from 'next/server';
import brokers from '@/lib/brokers.json';

export async function POST(req: NextRequest) {
  const username = process.env.LEND_USERNAME;
  const password = process.env.LEND_PASSWORD;
  const mode = process.env.LEND_MODE || 'sandbox';
  const auth = Buffer.from(`${username}:${password}`).toString('base64');

  const brokerList = brokers.brokers.map((broker) => ({ id: broker.id }));
  const chosenBroker = brokerList[Math.floor(Math.random() * brokerList.length)];

  const data = {
    ...(await req.json()),
    broker_assigned: chosenBroker.id,
  };

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

    console.log('brokers', brokers);
    console.log('sent body:', data);
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
