import { NextResponse } from 'next/server';
import { addRecord } from '@/lib/sheets';
import { cookies } from 'next/headers';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request) {
	try {
		const body = await request.json();
		
		const cookieStore = await cookies();
		const token = cookieStore.get(COOKIE_NAME)?.value;
		const user = await verifyToken(token);
		if (user) body.updatedBy = user.username;

		const result = await addRecord(body);
		return NextResponse.json({ success: true, ...result });
	} catch (error) {
		console.error('API Error:', error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}
