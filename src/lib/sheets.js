import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/**
 * Initialize Google Sheets API client
 */
async function getSheetsClient() {
	try {
		const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
		const auth = new google.auth.GoogleAuth({
			credentials,
			scopes: SCOPES,
		});
		return google.sheets({ version: 'v4', auth });
	} catch (error) {
		console.error('Error initializing Google Sheets client:', error);
		throw error;
	}
}

/**
 * Fetch data from a specific range in the spreadsheet
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
	const data = await getSheetData('Patients!A2:L'); // 12 columns
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
		updatedAt: row[10],
		updatedBy: row[11],
	})).filter(patient => patient.status !== 'アーカイブ');
}

// Higher-level functions for Records
export async function getPatientRecords(patientId) {
	const data = await getSheetData('Records!A2:K'); // 11 columns
	if (!data) return [];

	return data
		.filter(row => row[1] === patientId && row[10] !== 'アーカイブ')
		.map(row => ({
			id: row[0],
			patientId: row[1],
			date: row[2],
			weight: row[3],
			symptoms: row[4],
			diagnosis: row[5],
			treatment: row[6],
			notes: row[7],
			updatedAt: row[8],
			updatedBy: row[9],
			status: row[10],
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
		patient.status || '健康',
		'', // updatedAt
		''  // updatedBy
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
		record.notes || '',
		new Date().toLocaleString('ja-JP'), // updatedAt
		record.updatedBy || '', // updatedBy
		'アクティブ' // status
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

export async function updateRecord(recordId, record) {
	const data = await getSheetData('Records!A2:K');
	if (!data) throw new Error("No records found");
	const rowIndex = data.findIndex(row => row[0] === recordId);
	if (rowIndex === -1) throw new Error("Record not found");

	const rowData = data[rowIndex];
	const range = `Records!A${rowIndex + 2}:K${rowIndex + 2}`;
	const values = [
		recordId,
		record.patientId || rowData[1],
		record.date || rowData[2],
		record.weight || rowData[3] || '',
		record.symptoms || rowData[4] || '',
		record.diagnosis || rowData[5] || '',
		record.treatment || rowData[6] || '',
		record.notes || rowData[7] || '',
		record.updatedAt || new Date().toLocaleString('ja-JP'),
		record.updatedBy || rowData[9] || '',
		record.status || rowData[10] || 'アクティブ'
	];
	await updateRow(range, values);
	return { success: true };
}

export async function deleteRecord(recordId) {
	const data = await getSheetData('Records!A2:A');
	if (!data) return;
	const rowIndex = data.findIndex(row => row[0] === recordId);
	if (rowIndex === -1) return;

	const sheets = await getSheetsClient();
	const sheetIdResponse = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
	const sheetId = sheetIdResponse.data.sheets.find(s => s.properties.title === 'Records').properties.sheetId;

	await sheets.spreadsheets.batchUpdate({
		spreadsheetId: SPREADSHEET_ID,
		requestBody: {
			requests: [{
				deleteDimension: {
					range: {
						sheetId: sheetId,
						dimension: "ROWS",
						startIndex: rowIndex + 1,
						endIndex: rowIndex + 2
					}
				}
			}]
		}
	});
	return { success: true };
}

export async function updatePatient(dbId, updateData) {
	const data = await getSheetData('Patients!A2:L');
	if (!data) throw new Error("Patients not found");
	const rowIndex = data.findIndex(row => row[0] === dbId);
	if (rowIndex === -1) throw new Error("Patient not found");

	const rowData = data[rowIndex];
	const values = [
		dbId,
		rowData[1], // id
		updateData.name || rowData[2],
		updateData.emoji || rowData[3],
		updateData.gender || rowData[4],
		updateData.age || rowData[5],
		updateData.owner || rowData[6],
		updateData.breed || rowData[7],
		rowData[8], // lastVisit
		updateData.status || rowData[9],
		updateData.updatedAt || new Date().toLocaleString('ja-JP'),
		updateData.updatedBy || rowData[11] || '',
	];
	await updateRow(`Patients!A${rowIndex + 2}:L${rowIndex + 2}`, values);
	return { success: true };
}

export async function addBilling(billingData) {
	const recordId = Math.random().toString(36).substring(7);
	const date = new Date().toLocaleDateString('ja-JP');
	const { patientId, items } = billingData;
	
	const rows = items.map(item => [
		Math.random().toString(36).substring(7), // id
		patientId,
		recordId,
		date,
		item.name,
		item.category,
		item.price,
		item.qty,
		item.price * item.qty, // total
		'未払' // status
	]);

	for (const row of rows) {
		await appendRow('Billing!A2', row);
	}

	return { recordId };
}

export async function getMasterItems() {
	const data = await getSheetData('MasterItems!A2:D');
	if (!data) return [];
	return data.map(row => ({
		code: row[0],
		category: row[1],
		name: row[2],
		price: Number(row[3])
	}));
}
