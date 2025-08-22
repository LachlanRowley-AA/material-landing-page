import { NextRequest, NextResponse } from 'next/server';
import { generate } from '@pdfme/generator';
import { multiVariableText, rectangle, text } from '@pdfme/schemas';
import { createClient } from '@supabase/supabase-js';

import template from '@/lib/template.json';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { name, ip, date, fileName = 'privacy-form.pdf', folder = 'generated-forms' } = await request.json();

    if (!name || !ip || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const inputs = [
      {
        APPLICANT_FULL_NAME: JSON.stringify({ APPLICANT_FULL_NAME: name }),
        APPLICANT_SIGNED_IP: JSON.stringify({ IP: ip }),
        APPLICANT_SIGNED_DATE: JSON.stringify({ APPLICANT_SIGNED_DATE: date }),
        SIGNATURE: JSON.stringify({ SIGNATURE: name })
      }
    ];

    const pdf = await generate({
      template,
      inputs,
      plugins: { rectangle, text, multiVariableText }
    });

    const buffer = new Uint8Array(pdf.buffer);
    const filePath = `${folder}/${fileName}`;

    const { error, data } = await supabase.storage
      .from('eazytrade')
      .upload(filePath, buffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ error: 'Failed to upload PDF to Supabase' }, { status: 500 });
    }
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
