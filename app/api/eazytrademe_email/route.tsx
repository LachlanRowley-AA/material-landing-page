import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { subject, textBody, to, cc, partnerName, partnerKey } = await req.json();

    if(!partnerKey || !partnerName) {
      return NextResponse.json({ error: 'Partner information missing' }, { status: 401 });
    }

    if (!subject || !textBody) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 402 });
    }

    const postmarkApiKey = process.env.POSTMARK_API_KEY;
    if (!postmarkApiKey) {
      return NextResponse.json({ error: 'Postmark API key not set' }, { status: 500 });
    }

    const res = await fetch('https://api.postmarkapp.com/email/withTemplate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': postmarkApiKey,
      },
      body: JSON.stringify({
        From: 'partner@eazytrade.com.au', // Must be a verified sender in Postmark
        To: to,
        Cc: cc,
        TemplateAlias: "code-your-own-1",
        TemplateModel: {
          "name": to,
          "accountKey": "423550",
          "p_name": partnerName,
          "p_key": partnerKey,
        },
      }),
    });

    const data = await res.json();
    return NextResponse.json({ success: true, postmarkResponse: data });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
