import { NextResponse } from 'next/server';
import { deletePacote, updatePacote } from '../../../../services/pacotes/package.repository';

export async function DELETE(request, { params }) {
  try {
    let { id } = params || {};
    if (!id) {
      const url = new URL(request.url);
      const parts = url.pathname.split("/").filter(Boolean);
      id = parts[parts.length - 1];
    }

    const result = await deletePacote(id);

    if (result.success) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  } catch (error) {
    console.error('API /api/pacotes/[id] DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    let { id } = params || {};
    if (!id) {
      const url = new URL(request.url);
      const parts = url.pathname.split("/").filter(Boolean);
      id = parts[parts.length - 1];
    }

    const body = await request.json();
    const result = await updatePacote(id, body);

    if (result.success) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  } catch (error) {
    console.error('API /api/pacotes/[id] PUT error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
