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

    const file = formData.get('file');
    const name = formData.get('name') as string || 'Unknown';
    const spot = formData.get('spot') as string || 'Unknown'; //front or back

    if (!file) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }
    if (!(file instanceof File)) {return NextResponse.json({error: 'Non file uploaded'}, { status: 401})};
    const originalName = file.name;
    const fileExtension = originalName.split('.').pop() || 'jpeg';

    const renamed = spot;      
    const filePath = `${company}/${renamed}.${fileExtension}`;

    const { data, error } = await supabase.storage
      .from('eazytrade')
      .upload(filePath, file, {
        upsert: true,
      });

      if (error) {
        return NextResponse.json({ error: `Failed to upload : ${spot}`}, { status: 500})
      }
        return NextResponse.json({ message: `successfull upload of ${spot}`}, {status: 200})
    }
    catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 502 });
  }
}
