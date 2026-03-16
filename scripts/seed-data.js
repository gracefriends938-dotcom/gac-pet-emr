const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const KEY_FILE = process.env.GOOGLE_SHEETS_KEY_FILE;

async function seedData() {
	console.log('Connecting to Google Sheets...');
	try {
		const auth = new google.auth.GoogleAuth({
			keyFile: KEY_FILE,
			scopes: ['https://www.googleapis.com/auth/spreadsheets'],
		});
		const sheets = google.sheets({ version: 'v4', auth });

		// Sample Patients Data
		const patients = [
			['db_pt001', 'PT-2450', 'レオ', '🐶', 'オス', '3歳', '田中 健一', 'トイプードル', '2026/03/11', '健康'],
			['db_pt002', 'PT-2451', 'モモ', '🐱', 'メス', '5歳', '佐藤 美咲', 'アメリカンショートヘア', '2026/03/10', '要注意'],
			['db_pt003', 'PT-2452', 'タロウ', '🐶', 'オス', '8歳', '鈴木 一郎', '柴犬', '2026/03/05', '経過観察']
		];

		// Sample Records Data
		const records = [
			['db_rc001', 'db_pt001', '2026/02/10', '4.2', '特に異常なし。食欲旺盛。', '健康診断', 'フィラリア予防薬処方', ''],
			['db_rc002', 'db_pt001', '2026/03/11', '4.3', '少し耳を痒がる。', '外耳炎の疑い', '点耳薬処方。1週間後に再診予定。', '右耳の汚れあり。'],
			['db_rc003', 'db_pt002', '2026/03/10', '3.8', '最近水をよく飲む。尿量増加。', '慢性腎臓病の疑い', '血液検査実施。療法食への切り替えを指導。', '次回、エコー検査も検討'],
		];

		console.log('Adding demo patients...');
		await sheets.spreadsheets.values.append({
			spreadsheetId: SPREADSHEET_ID,
			range: 'Patients!A2:J',
			valueInputOption: 'USER_ENTERED',
			requestBody: { values: patients },
		});

		console.log('Adding demo records...');
		await sheets.spreadsheets.values.append({
			spreadsheetId: SPREADSHEET_ID,
			range: 'Records!A2:H',
			valueInputOption: 'USER_ENTERED',
			requestBody: { values: records },
		});

		console.log('✅ Demo data successfully added to Google Sheets!');
	} catch (error) {
		console.error('❌ Failed to seed data:', error.message);
	}
}

seedData();
