import { NextResponse } from 'next/server';
import { createPacote } from '../../../services/pacotes/package.repository';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await createPacote(body);

    if (result.success) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  } catch (error) {
    console.error('API /api/pacotes error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
