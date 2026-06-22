import { NextResponse } from "next/server";
import { deletePerson } from "@/services/pessoas/person.repository";

export async function DELETE(req, context) {
  const url = new URL(req.url);
  const fallbackId = url.pathname.split("/").filter(Boolean).pop();
  const personId = context?.params?.id ?? fallbackId;

  if (!personId) {
    return NextResponse.json(
      { error: "ID de pessoa não informado." },
      { status: 400 }
    );
  }

  try {
    const result = await deletePerson(personId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Não foi possível excluir a pessoa." },
      { status: 400 }
    );
  }
}
