import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PDFDocument } from 'pdf-lib';
import QRCode from 'qrcode';
import { partnerConfig } from '@/lib/partnerConfig';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // // Get first PDF attachment
    // const pdfAttachment = body.Attachments?.find(
    //   (att: any) => att.ContentType === 'application/pdf'
    // );
    const sender: string = body.FromFull.Email;

    console.log('**************');
    console.log(body);
    console.log('**************');

    let recipient: string = body.ToFull[0].Email;
    if (!recipient) {
      recipient = sender;
    }

    // Verify subject can be sent an email
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    console.log(recipient);
    const { data, error } = await supabase
      .from('eazytrade_emails')
      .select()
      .eq('email', recipient)
      .single();

    if ((!error && !data) || (error && error.code === 'PGRST116')) {
      // No match
      console.log('New email, adding to DB:', recipient);
      await supabase.from('eazytrade_emails').insert({ email: recipient, opt_out: false });
    }
    if (error && error.code !== 'PGRST116') {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }
    console.log('Email record:', data, error);

    if (data?.opt_out) {
      return NextResponse.json({ message: 'Recipient has opted out' }, { status: 403 });
    }
    const daysSinceLastEmail = data?.last_emailed
      ? (new Date().getTime() - new Date(data.last_emailed).getTime()) / (1000 * 60 * 60 * 24)
      : null;
    if (daysSinceLastEmail !== null && daysSinceLastEmail < 7) {
      return NextResponse.json({ message: 'Email sent too recently' }, { status: 429 });
    }

    // let updatedPdfBase64 = '';
    // if (pdfAttachment) {
    //   const pdfBase64 = pdfAttachment.Content;

    //   // Load PDF
    //   const pdfBytes = Buffer.from(pdfBase64, 'base64');
    //   const pdfDoc = await PDFDocument.load(pdfBytes);
    //   // Generate QR
    //   const qrData = 'https://www.eazytrade.com.au';
    //   const qrPngBuffer = await QRCode.toBuffer(qrData, { margin: 0 });
    //   const qrImage = await pdfDoc.embedPng(qrPngBuffer);

    //   // Place QR dynamically (20% from top, right side)
    //   const firstPage = pdfDoc.getPages()[0];
    //   const pageWidth = firstPage.getWidth();
    //   const pageHeight = firstPage.getHeight();
    //   const qrSize = 100;
    //   const margin = 20;
    //   const x = pageWidth - qrSize - margin;
    //   const y = pageHeight * (1 - 0.2) - qrSize;

    //   firstPage.drawImage(qrImage, { x, y, width: qrSize, height: qrSize });

    //   // Save updated PDF
    //   const updatedPdfBytes = await pdfDoc.save();
    //   updatedPdfBase64 = Buffer.from(updatedPdfBytes).toString('base64');
    // }

    const [partnerKey, partnerObj] =
      Object.entries(partnerConfig).find(([, value]) => value.email === sender) || [];

    const partnerName = partnerObj?.displayName;
    console.log('Identified partner:', partnerKey, partnerName);

    // await fetch(`https://www.eazytrade.com.au/api/eazytrademe_email`, {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/eazytrademe_email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: 'Updated PDF with QR Code',
        textBody: 'Please find attached your updated PDF.',
        to: recipient,
        cc: sender,
        partnerName: partnerName || '',
        partnerKey: partnerKey || '',
      }),
    });

    const { data: updated, error: updateError } = await supabase
      .from('eazytrade_emails')
      .update({ last_emailed: new Date().toISOString() })
      .eq('email', recipient);

    if (updateError) {
      console.error('Failed to update last_emailed:', updateError);
    } else {
      console.log('Updated last_emailed:', updated);
    }

    // return NextResponse.json({
    //   message: 'QR added successfully',
    //   updatedPdfBase64,
    // });
    return NextResponse.json({
      message: 'Email sent successfully'
    })
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 5. Send to target API
//     const apiRes = await fetch(targetApiUrl, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ pdfBase64: updatedPdfBase64 }),
//     });

//     const apiData = await apiRes.json();

//     return NextResponse.json({
//       message: 'QR added and PDF sent successfully',
//       updatedPdfBase64, // Include PDF so frontend can download it
//       apiResponse: apiData,
//     });
