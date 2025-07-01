import { google } from "googleapis";
import keys from "../../../secrets/excel-editor.json";

export async function GET(apiKey) {
  try {
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
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // copy your spreadsheet id here
    // and update the range based on the sheet name and columns used
    const data = await sheets.spreadsheets.values.get({
      spreadsheetId: "15KdCOINKr4XFtOZZF35lOQWTAtPBECuElXjXDyCBWBc",
      range: "Sheet1!A:D",
    });

    // Return the actual data
    return Response.json({ 
      data: data.data.values, 
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