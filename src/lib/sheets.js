import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

async function getSheetsClient() {
	try {
		const auth = new google.auth.GoogleAuth({
			credentials: {
				client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
				private_key: (process.env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
			},
			scopes: SCOPES,
		});
		return google.sheets({ version: 'v4', auth });
	} catch (error) {
		console.error('Error initializing Google Sheets client:', error);
		throw error;
	}
}

/**
 * Get all rows from a sheet
 */
export async function getSheetData(range) {
	const sheets = await getSheetsClient();
	const response = await sheets.spreadsheets.values.get({
		spreadsheetId: SPREADSHEET_ID,
		range,
	});
	return response.data.values;
}

/**
 * Append a row to a sheet
 */
export async function appendRow(range, values) {
	const sheets = await getSheetsClient();
	await sheets.spreadsheets.values.append({
		spreadsheetId: SPREADSHEET_ID,
		range,
		valueInputOption: 'USER_ENTERED',
		requestBody: {
			values: [values],
		},
	});
}

/**
 * Update a row in a sheet
 */
export async function updateRow(range, values) {
	const sheets = await getSheetsClient();
	await sheets.spreadsheets.values.update({
		spreadsheetId: SPREADSHEET_ID,
		range,
		valueInputOption: 'USER_ENTERED',
		requestBody: {
			values: [values],
		},
	});
}

// Higher-level functions for Users (authentication)
export async function getUsers() {
	const data = await getSheetData('Users!A2:C');
	if (!data) return [];
	return data.map(row => ({
		id: row[0],
		username: row[1],
		password: row[2],
	}));
}

// Higher-level functions for Patients
export async function getPatients() {
	const data = await getSheetData('Patients!A2:J'); // Assuming A1 is header
	if (!data) return [];

	return data.map(row => ({
		dbId: row[0],
		id: row[1],
		name: row[2],
		emoji: row[3],
		gender: row[4],
		age: row[5],
		owner: row[6],
		breed: row[7],
		lastVisit: row[8],
		status: row[9],
	}));
}

// Higher-level functions for Records
export async function getPatientRecords(patientId) {
	const data = await getSheetData('Records!A2:H');
	if (!data) return [];

	return data
		.filter(row => row[1] === patientId)
		.map(row => ({
			id: row[0],
			patientId: row[1],
			date: row[2],
			weight: row[3],
			symptoms: row[4],
			diagnosis: row[5],
			treatment: row[6],
			notes: row[7],
		}));
}

export async function addPatient(patient) {
	// Generate a simple ID if not provided (e.g., PT-xxxx)
	const id = patient.id || `PT-${Math.floor(1000 + Math.random() * 9000)}`;
	const dbId = Math.random().toString(36).substring(7); // Random string for dbId

	const values = [
		dbId,
		id,
		patient.name,
		patient.emoji || '🐾',
		patient.gender,
		patient.age,
		patient.owner,
		patient.breed,
		new Date().toLocaleDateString('ja-JP'), // lastVisit
		patient.status || '健康'
	];

	await appendRow('Patients!A2', values);
	return { dbId, id };
}

export async function addRecord(record) {
	const id = Math.random().toString(36).substring(7);

	const values = [
		id,
		record.patientId,
		new Date().toLocaleDateString('ja-JP'),
		record.weight,
		record.symptoms,
		record.diagnosis,
		record.treatment,
		record.notes || ''
	];

	await appendRow('Records!A2', values);

	// Update lastVisit in Patients sheet
	const patients = await getSheetData('Patients!A2:A1000');
	if (patients) {
		const rowIndex = patients.findIndex(row => row[0] === record.patientId);
		if (rowIndex !== -1) {
			// Patients!I column is lastVisit (Index 8)
			const range = `Patients!I${rowIndex + 2}`;
			await updateRow(range, [new Date().toLocaleDateString('ja-JP')]);
		}
	}

	return { id };
}
