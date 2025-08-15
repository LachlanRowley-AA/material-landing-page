import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import QRCode from 'qrcode';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Get first PDF attachment
    const pdfAttachment = body.Attachments?.find(
      (att: any) => att.ContentType === 'application/pdf'
    );
    const sender : string = body.FromFull.Email;
    let subject : string = body.Subject;
    if(!subject) {
      subject = sender;
    }

    if (!pdfAttachment) {
      return NextResponse.json({ error: 'No PDF attachment found' }, { status: 400 });
    }

    const pdfBase64 = pdfAttachment.Content;

    // Load PDF
    const pdfBytes = Buffer.from(pdfBase64, 'base64');
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Generate QR
    const qrData = 'https://www.eazytrade.com.au';
    const qrPngBuffer = await QRCode.toBuffer(qrData, { margin: 0 });
    const qrImage = await pdfDoc.embedPng(qrPngBuffer);

    // Place QR dynamically (20% from top, right side)
    const firstPage = pdfDoc.getPages()[0];
    const pageWidth = firstPage.getWidth();
    const pageHeight = firstPage.getHeight();
    const qrSize = 100;
    const margin = 20;
    const x = pageWidth - qrSize - margin;
    const y = pageHeight * (1 - 0.2) - qrSize;

    firstPage.drawImage(qrImage, { x, y, width: qrSize, height: qrSize });

    // Save updated PDF
    const updatedPdfBytes = await pdfDoc.save();
    const updatedPdfBase64 = Buffer.from(updatedPdfBytes).toString('base64');

    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/eazytrademe_email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        subject: 'Updated PDF with QR Code',
        textBody: 'Please find attached your updated PDF.',
        pdfBase64: updatedPdfBase64,
        filename: 'updated.pdf',
        to: subject,
        cc: sender
    })
    });

    return NextResponse.json({
      message: 'QR added successfully',
      updatedPdfBase64
    });
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