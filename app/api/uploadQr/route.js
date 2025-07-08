import { google } from "googleapis";
import keys from "../../../secrets/excel-editor.json";

export async function POST(req) {
  try {
    console.log('API called - parsing FormData...');
    
    const formData = await req.formData();
    const customerName = formData.get('customerName');
    const pw = formData.get('pw');
    
    const baseUrl = process.env.WEBSITE_URL;
    const qrcode = `=IMAGE(\"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="&ENCODEURL(\"${baseUrl}?accountKey=${pw}\"))`

    console.log('FormData parsed:', { 
      hasCustomerName: !!customerName,
      customerName: customerName,
    });
    
    if (!customerName) {
      console.error('Missing fields:', {customerName: !!customerName });
      return Response.json({ error: "Missing required field customerName." }, { status: 400 });
    }

    const pKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    console.log('Authenticating with Google Sheets...');
    const auth = await google.auth.getClient({
      projectId: keys.project_id,
      credentials: {
        type: "service_account",
        private_key: pKey,
        client_email: keys.client_email,
        client_id: keys.client_id,
        token_url: keys.token_uri,
        universe_domain: "googleapis.com",
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "15KdCOINKr4XFtOZZF35lOQWTAtPBECuElXjXDyCBWBc";
    const sheetName = "Sheet1";


    console.log('Fetching sheet data...');
    // 1. Get all rows including headers
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}`,
    });

    const rows = getResponse.data.values;
    console.log('Rows fetched:', rows?.length || 0);

    if (!rows || rows.length === 0) {
      return Response.json({ error: "Sheet is empty." }, { status: 500 });
    }

    const headers = rows[0];
    console.log('Headers:', headers);

    const companyIndex = headers.indexOf("CompanyName");
    const pwIndex = headers.indexOf("pw");
    const qrIndex = headers.indexOf("QrCode");

    console.log('Column indices:', { companyIndex, pwIndex, qrIndex });

    if (companyIndex === -1 || pwIndex === -1 || qrIndex === -1) {
      return Response.json({ 
        error: "Required columns not found in sheet.",
        details: { companyIndex, pwIndex, qrIndex, headers }
      }, { status: 500 });
    }

    // 2. Find the row number (1-based indexing)
    console.log('Searching for company:', customerName);
    const rowIndex = rows.findIndex((row, idx) =>
      idx > 0 && row[companyIndex]?.toLowerCase().trim() === customerName.toLowerCase().trim()
    );

    console.log('Row index found:', rowIndex);

    if (rowIndex === -1) {
      return Response.json({ error: `Company "${customerName}" not found.` }, { status: 404 });
    }

    const rowNumber = rowIndex + 1; // Google Sheets is 1-indexed

    // 3. Update the Pw and QrCode columns on the matching row
    const updateRange = `${sheetName}!${columnToLetter(pwIndex + 1)}${rowNumber}:${columnToLetter(qrIndex + 1)}${rowNumber}`;
    const updateValues = [[pw, qrcode]];

    console.log('Updating range:', updateRange);
    console.log('Update values (pw, qrcode):', [pw, qrcode]);

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: updateRange,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: updateValues,
      },
    });

    console.log('Update successful');
    return Response.json({ 
      message: "Row updated successfully.",
      details: {
        customerName,
        pw,
        qrcode: qrcode
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Detailed error:", error);
    console.error("Error stack:", error.stack);
    return Response.json({ 
      error: "Internal Server Error", 
      details: error.message 
    }, { status: 500 });
  }
}

// Helper: Convert 1-based column index to A1-style letter
function columnToLetter(col) {
  let temp = "";
  let letter = "";
  while (col > 0) {
    temp = (col - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    col = (col - temp - 1) / 26;
  }
  return letter;
}