import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

const MASTER_ITEMS = [
    ['code', 'category', 'name', 'price'],
	["110010", "基本料金", "初診料（オンライン）", 1500],
	["110020", "基本料金", "再診料（オンライン）", 800],
	["110030", "基本料金", "同日再診料", 400],
	["120010", "相談・指導", "セカンドオピニオン相談料", 3000],
	["120020", "相談・指導", "行動・しつけ相談料", 2000],
	["120030", "相談・指導", "栄養指導料", 1500],
	["210010", "お薬", "処方料（内服薬・外用薬）", 300],
	["220010", "お薬", "ネクスガードスペクトラ 11.3", 2200],
	["220020", "お薬", "ネクスガードスペクトラ 22.5", 2500],
	["220030", "お薬", "ネクスガードスペクトラ 45", 2800],
	["220100", "お薬", "ウェルメイト点耳薬", 1800],
	["310010", "諸経費", "郵送検査キット代（便）", 1500],
	["310020", "諸経費", "郵送検査キット代（尿）", 1500],
	["320010", "諸経費", "システム利用料", 300],
	["900010", "配送料", "オンライン処方配送料", 330]
];

async function main() {
	try {
		const auth = new google.auth.GoogleAuth({
			credentials: {
				client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
				private_key: (process.env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/^"|"$/g, '').replace(/\\n/g, '\n'),
			},
			scopes: SCOPES,
		});
		const sheets = google.sheets({ version: 'v4', auth });
        
        console.log("Adding sheet MasterItems...");
        try {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                requestBody: {
                    requests: [{
                        addSheet: {
                            properties: {
                                title: "MasterItems"
                            }
                        }
                    }]
                }
            });
            console.log("Sheet created successfully.");
        } catch (e) {
            console.log("Sheet might already exist: ", e.message);
        }

        console.log("Seeding data into MasterItems!A1:D...");
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: 'MasterItems!A1:D',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: MASTER_ITEMS
            }
        });
        console.log("Data seeded successfully!");

	} catch (error) {
		console.error('Error:', error);
	}
}

main();
