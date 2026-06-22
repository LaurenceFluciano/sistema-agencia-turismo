import { NextResponse } from "next/server";
import sql from "@/services/db";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const offers = await sql`
      SELECT
        s."id" AS id_fornecedor_servico,
        s."nome_oficial" AS nome_comercial,
        s."nome_oficial" AS nome_oficial_servico,
        COALESCE(ts."nome_tipo", 'Serviço') AS tipo_servico,
        s."status" AS status_fornecedor,
        m."nome" AS municipio_cidade,
        e."sigla" AS sigla_estado
      FROM "Servico" s
      LEFT JOIN "Tipo_Servico" ts ON s."id_tipo" = ts."id"
      LEFT JOIN "Municipio" m ON s."id_municipio" = m."id"
      LEFT JOIN "Estado" e ON m."id_estado" = e."id"
      ORDER BY s."id" DESC;
    `;

    const arrayResult = Array.isArray(offers) ? offers : (offers.rows || []);

    return NextResponse.json({ data: arrayResult }, { status: 200 });
  } catch (error) {
    console.error("API /api/ofertas error:", error);
    return NextResponse.json({ success: false, error: error?.message ?? String(error) }, { status: 500 });
  }
}