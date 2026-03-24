const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

async function getCreds() {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
                private_key: (process.env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/^"|"$/g, '').replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const sheets = google.sheets({ version: 'v4', auth });
        const data = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
            range: 'Users!A2:C',
        });
        if (data.data.values && data.data.values.length > 0) {
            console.log('USER_DATA:' + JSON.stringify(data.data.values[0]));
        } else {
            console.log('NO_USER_FOUND');
        }
    } catch (error) {
        console.error(error.message);
    }
}
getCreds();
