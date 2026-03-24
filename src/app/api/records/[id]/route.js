import { NextResponse } from 'next/server';
import { updateRecord, deleteRecord } from '@/lib/sheets';
import { cookies } from 'next/headers';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

export async function PUT(request, { params }) {
	try {
		const { id } = await params;
		const body = await request.json();
		
		const cookieStore = await cookies();
		const token = cookieStore.get(COOKIE_NAME)?.value;
		const user = await verifyToken(token);
		if (user) body.updatedBy = user.username;

		const result = await updateRecord(id, body);
		return NextResponse.json({ success: true, ...result });
	} catch (error) {
		console.error('API Error:', error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

export async function DELETE(request, { params }) {
	try {
		const { id } = await params;
		const cookieStore = await cookies();
		const token = cookieStore.get(COOKIE_NAME)?.value;
		const user = await verifyToken(token);

		if (user && user.username === 'admin') {
			const result = await deleteRecord(id);
			return NextResponse.json({ success: true, ...result });
		} else {
			const result = await updateRecord(id, { 
				status: 'アーカイブ', 
				updatedBy: user ? user.username : 'Unknown',
				updatedAt: new Date().toLocaleString('ja-JP')
			});
			return NextResponse.json({ success: true, ...result });
		}
	} catch (error) {
		console.error('API Error:', error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}
