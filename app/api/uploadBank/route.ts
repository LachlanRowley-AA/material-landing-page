import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase URL or Key is not set' }, { status: 511 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const formData = await request.formData();
    const company = (formData.get('company_name') as string) || 'NAME_NOT_PASSED';

    // Grab all 'invoices' entries (can be multiple)
    const files = formData.getAll('invoices');
    const ip = formData.get('ipAddress') as string || 'IP_FETCH_FAILED';
    const date = formData.get('date') as string || '';
    const name = formData.get('name') as string || 'Unknown';

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadResults = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!(file instanceof File)) {continue};
      const originalName = file.name;
      const fileExtension = originalName.split('.').pop() || 'jpeg';
      
      const renamed = i === 0 ? 'front' : 'back';
      const filePath = `${company}/${renamed}.${fileExtension}`;

      const { data, error } = await supabase.storage
        .from('eazytrade')
        .upload(filePath, file, {
          upsert: true, // don't overwrite because iphone direct camera photos have the same name
        });

      if (error) {
        uploadResults.push({ file: file.name, success: false, error: error.message });
      } else {
        uploadResults.push({ file: file.name, success: true, path: data.path });
      }
    }
    let pdfRes : Response;
    const allSuccess = uploadResults.every(result => result.success);
    if (allSuccess) {
      pdfRes = await fetch(`${process.env.WEBSITE_URL}/api/generate_privacy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            ip,
            date,
            fileName: `${company}-privacy-form.pdf`,
            folder: `${company}`
          })
        }
      )
    }
    else {
      return NextResponse.json({ error: 'Failed to upload some files', uploads: uploadResults }, { status: 501 });
    }
    let pdfJson;
    try {
      pdfJson = await pdfRes.json();
    } catch (e) {
      console.log('failed to parse privacy json: ', e)
      return NextResponse.json({ error: 'Invalid JSON from privacy form generator' }, { status: 502 })
    }
    console.log('PDF generation response:', pdfJson);
    if( !pdfRes.ok) {
      return NextResponse.json({ error: 'Failed to generate privacy form' }, { status: 504 });
    }
    return NextResponse.json({ uploads: uploadResults }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 502 });
  }
}
