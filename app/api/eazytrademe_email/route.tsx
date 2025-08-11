import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { subject, textBody, pdfBase64, filename } = await req.json();

    if (!subject || !textBody || !pdfBase64) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const postmarkApiKey = process.env.POSTMARK_API_KEY;
    if (!postmarkApiKey) {
      return NextResponse.json({ error: 'Postmark API key not set' }, { status: 500 });
    }

    const res = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': postmarkApiKey,
      },
      body: JSON.stringify({
        From: 'lachlan@assetalley.com.au', // Must be a verified sender in Postmark
        To: 'lachlan@assetalley.com.au',
        Subject: subject,
        TextBody: textBody,
        Attachments: [
          {
            Name: filename || 'document.pdf',
            Content: pdfBase64,
            ContentType: 'application/pdf'
          }
        ]
      }),
    });

    const data = await res.json();
    return NextResponse.json({ success: true, postmarkResponse: data });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
