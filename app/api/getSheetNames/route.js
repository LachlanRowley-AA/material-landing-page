import { google } from "googleapis";
import keys from "../../../secrets/excel-editor.json";

export async function GET(req) {
  try {
    const pKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
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
    const sheet = await sheets.spreadsheets.values.get({
      spreadsheetId: "15KdCOINKr4XFtOZZF35lOQWTAtPBECuElXjXDyCBWBc",
      range: "Sheet1",
    });

    const data = sheet.data.values;
    
    // Check if data exists and has headers
    if (!data || data.length === 0) {
      return Response.json(
        { message: 'No data found in spreadsheet', success: false },
        { status: 404 }
      );
    }

    const headers = data[0];
    let pwCol = -1;
    let companyCol = -1;

    // Find column indices
    for (let i = 0; i < headers.length; i++) {
      if (headers[i] === 'pw') {
        pwCol = i;
      }
      if (headers[i] === 'CompanyName') {
        companyCol = i;
      }
    }
    if (companyCol === -1) {
      return Response.json(
        { message: 'CompanyName column not found. Report this error to the dev team', success: false,
          data: headers
         },
        { status: 500 }
      );
    }

    // Get the companyname list
    const result = data.slice(1).map(companyName => companyName[0])
    return Response.json({ 
        data: result, 
        success: true 
    });
  } catch (e) {
    console.log(e);
    return Response.json(
      { message: 'Error getting spreadsheet data', success: false },
      { status: 500 }
    );
  }
}