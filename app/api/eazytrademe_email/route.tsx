import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { subject, textBody, pdfBase64, filename, to, cc } = await req.json();

    if (!subject || !textBody || !pdfBase64) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
        From: 'lachlan@assetalley.com.au', // Must be a verified sender in Postmark
        To: to,
        Cc: cc,
        TemplateAlias: "code-your-own-1",
        TemplateModel: {
          "name": to,
          "accountKey": "27fadb22-ea48-4269-a9fc-b5b1938185d9" 
        },
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
