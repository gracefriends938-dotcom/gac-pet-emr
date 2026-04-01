const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
    console.log('Testing connection with FULL JSON credentials...');
    const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    try {
        const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const sheets = google.sheets({ version: 'v4', auth });
        
        console.log('Fetching spreadsheet metadata...');
        const res = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
        });
        console.log('✅ Success! Spreadsheet title:', res.data.properties.title);
        
        console.log('Fetching Users sheet data...');
        const data = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Users!A2:C',
        });
        console.log('✅ Users found:', data.data.values ? data.data.values.length : 0);
    } catch (error) {
        console.error('❌ Error during test:', error.message);
    }
}

testConnection();
