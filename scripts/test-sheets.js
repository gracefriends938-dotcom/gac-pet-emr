const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const KEY_FILE = process.env.GOOGLE_SHEETS_KEY_FILE;

async function testConnection() {
	console.log('Testing connection to Google Sheets...');
	console.log('Spreadsheet ID:', SPREADSHEET_ID);
	console.log('Key File:', KEY_FILE);

	try {
		const auth = new google.auth.GoogleAuth({
			keyFile: KEY_FILE,
			scopes: ['https://www.googleapis.com/auth/spreadsheets'],
		});
		const sheets = google.sheets({ version: 'v4', auth });

		// Try to get spreadsheet metadata
		const response = await sheets.spreadsheets.get({
			spreadsheetId: SPREADSHEET_ID,
		});

		console.log('\n✅ Successfully connected!');
		console.log('Spreadsheet Title:', response.data.properties.title);
		console.log('Sheets available:', response.data.sheets.map(s => s.properties.title).join(', '));

		// Check for necessary sheets and create if missing
		const existingSheets = response.data.sheets.map(s => s.properties.title);
		const requiredSheets = ['Billing', 'Medications'];

		for (const sheetName of requiredSheets) {
			if (!existingSheets.includes(sheetName)) {
				console.log(`\nAdding missing sheet: ${sheetName}...`);
				await sheets.spreadsheets.batchUpdate({
					spreadsheetId: SPREADSHEET_ID,
					requestBody: {
						requests: [
							{
								addSheet: {
									properties: {
										title: sheetName,
									},
								},
							},
						],
					},
				});

				// Add headers for the new sheet
				let headers = [];
				if (sheetName === 'Billing') {
					headers = ['id', 'patientId', 'recordId', 'date', 'item', 'category', 'price', 'quantity', 'total', 'status'];
				} else if (sheetName === 'Medications') {
					headers = ['id', 'name', 'category', 'defaultUnit', 'defaultPrice', 'stock', 'description'];
				}

				if (headers.length > 0) {
					await sheets.spreadsheets.values.update({
						spreadsheetId: SPREADSHEET_ID,
						range: `${sheetName}!A1`,
						valueInputOption: 'USER_ENTERED',
						requestBody: {
							values: [headers],
						},
					});
				}
				console.log(`✅ ${sheetName} created with headers.`);
			}
		}

	} catch (error) {
		console.error('\n❌ Connection failed:');
		console.error(error.message);
	}
}

testConnection();
