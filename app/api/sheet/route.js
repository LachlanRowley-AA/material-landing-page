import { google } from "googleapis";
import keys from "../../../secrets/excel-editor.json";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const apiKey = searchParams.get("accountKey");
    
    if (!apiKey) {
      return Response.json({ message: 'Missing accountKey', success: false }, { status: 400 });
    }

    const auth = await google.auth.getClient({
      projectId: keys.project_id,
      credentials: {
        type: "service_account",
        private_key: keys.private_key,
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
    let emailCol = -1;
    let balanceCol = -1;
    let phoneCol = -1;

    // Find column indices
    for (let i = 0; i < headers.length; i++) {
      if (headers[i] === 'pw') {
        pwCol = i;
      }
      if (headers[i] === 'CompanyName') {
        companyCol = i;
      }
      if (headers[i] === 'Email') {
        emailCol = i;
      }
      if (headers[i] === 'Current Balance') {
        balanceCol = i;
      }
      if (headers[i] === 'Phone1') {
        phoneCol = i;
      }
    }

    if (pwCol === -1) {
      return Response.json(
        { message: 'Error authenticating passwords. Please notify development team', success: false,
          data: headers
         },
        { status: 500 }
      );
    }

    // Search for matching API key
    for (let i = 1; i < data.length; i++) { // start from 1 to skip headers
      if (data[i] && data[i][pwCol] === apiKey) {
        const result = {
          company: data[i][companyCol] || '',
          email: data[i][emailCol] || '',
          balance: data[i][balanceCol] || '',
          phoneNumber: data[i][phoneCol] || ''
        };
        
        return Response.json({ 
          data: result, 
          success: true 
        });
      }
    }

  } catch (e) {
    console.log(e);
    return Response.json(
      { message: 'Error getting spreadsheet data', success: false },
      { status: 500 }
    );
  }
}