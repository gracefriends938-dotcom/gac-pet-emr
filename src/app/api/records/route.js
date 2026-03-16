import { NextResponse } from 'next/server';
import { addRecord } from '@/lib/sheets';

export async function POST(request) {
	try {
		const body = await request.json();
		const result = await addRecord(body);
		return NextResponse.json({ success: true, ...result });
	} catch (error) {
		console.error('API Error:', error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}
