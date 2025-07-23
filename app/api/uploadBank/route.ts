import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase URL or Key is not set' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const formData = await request.formData();
    const company = (formData.get('company_name') as string) || 'N/A';

    // Grab all 'invoices' entries (can be multiple)
    const files = formData.getAll('invoices');

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadResults = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const filePath = `${company}/${file.name}`;

      const { data, error } = await supabase.storage
        .from('bank-statements')
        .upload(filePath, file, {
          upsert: true, // optional: overwrites if file exists
        });

      if (error) {
        uploadResults.push({ file: file.name, success: false, error: error.message });
      } else {
        uploadResults.push({ file: file.name, success: true, path: data.path });
      }
    }

    return NextResponse.json({ uploads: uploadResults }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
