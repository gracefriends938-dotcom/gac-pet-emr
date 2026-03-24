const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const KEY_FILE = process.env.GOOGLE_SHEETS_KEY_FILE;

async function fetchUsers() {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Users!A2:C',
    });

    console.log('Users:', response.data.values);
}

fetchUsers().catch(console.error);
