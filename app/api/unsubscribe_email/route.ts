import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { uuid } = await req.json();

    if (!uuid) {
      return NextResponse.json({ error: 'Missing UUID' }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('eazytrade_emails')
      .update({ opt_out: true })
      .eq('email', uuid);

    if (error) {
      console.error('Error unsubscribing:', error);
      return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Successfully unsubscribed', data });
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
