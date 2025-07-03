import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';


const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY! // Usually it's SUPABASE_ANON_KEY, not SUPABASE_KEY
)

export async function POST(request: NextRequest) {
    
    try {
        const body = await request.json()
        
        const { company_name, privacy_form, invoices } = body
        
        const { data, error } = await supabase
            .from('easypay')
            .insert([
                {
                    company_name,
                    privacy_form,
                    invoices,
                }
            ])
        
        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }
        
        return NextResponse.json({ success: true, data })
        
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to submit form' },
            { status: 500 }
        )
    }
}