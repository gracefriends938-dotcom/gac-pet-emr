const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

async function testConnection() {
    console.log('Testing connection to Google Sheets...');
    console.log('Spreadsheet ID:', SPREADSHEET_ID);
    console.log('Client Email:', process.env.GOOGLE_SHEETS_CLIENT_EMAIL);

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
                private_key: (process.env.GOOGLE_SHEETS_PRIVATE_KEY || '')
                    .replace(/^"|"$/g, '')
                    .replace(/\\n/g, '\n'),
            },
            scopes: SCOPES,
        });
        const sheets = google.sheets({ version: 'v4', auth });
        
        console.log('Fetching spreadsheet metadata...');
        const res = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
        });
        console.log('Success! Spreadsheet title:', res.data.properties.title);
        
        console.log('Fetching Users sheet data...');
        const data = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Users!A2:C',
        });
        console.log('Users found:', data.data.values ? data.data.values.length : 0);
    } catch (error) {
        console.error('Error during test:', error.message);
        if (error.stack) console.error(error.stack);
    }
}

testConnection();
