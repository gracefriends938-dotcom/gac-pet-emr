import { NextResponse } from 'next/server';
import { getMasterItems } from '@/lib/sheets';

export async function GET() {
	try {
		const items = await getMasterItems();
		return NextResponse.json(items);
	} catch (error) {
		console.error('API Error:', error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}
