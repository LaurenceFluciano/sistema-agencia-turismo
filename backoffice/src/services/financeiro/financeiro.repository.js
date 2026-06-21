"use server"

import db from '../db';

export async function getResumoMes() {
  try {
    const date = new Date();
    const primeiroDia = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    const ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];


    const resultLucro = await db`SELECT fn_calcular_lucro_periodo(${primeiroDia}, ${ultimoDia}) as lucro_total`;
    const lucroMes = Number(resultLucro[0]?.lucro_total) || 0;

    const resultReceitas = await db`
      SELECT COALESCE(SUM("valor"), 0) as total 
      FROM "Pagamento" 
      WHERE "status" = 'PAGO' 
        AND "valor" > 0
        AND "data_pagamento_utc"::DATE BETWEEN ${primeiroDia} AND ${ultimoDia}
    `;
    const receitaMes = Number(resultReceitas[0]?.total) || 0;

   
    const resultGastos = await db`
      SELECT COALESCE(SUM(ri."custo_fornecedor"), 0) as total
      FROM "Reserva_Item" ri
      WHERE ri."id_reserva" IN (
        SELECT DISTINCT p."id_reserva"
        FROM "Pagamento" p
        WHERE p."status" = 'PAGO'
          AND p."data_pagamento_utc"::DATE BETWEEN ${primeiroDia} AND ${ultimoDia}
      )
    `;
    const gastosMes = Number(resultGastos[0]?.total) || 0;

    return {
      receitaMes,
      gastosMes, 
      lucroMes
    };
  } catch (error) {
    console.error("Erro na lógica do resumo:", error);
    return { receitaMes: 0, gastosMes: 0, lucroMes: 0 };
  }
}

export async function getPagamentos(dataInicio, dataFim, status, formaPagamento, idReserva) {
  try {
    const fStatus = status || '';
    const fForma = formaPagamento || '';
    const fReserva = idReserva ? parseInt(idReserva) : 0;

    if (dataInicio && dataFim) {
      return await db`
        SELECT 
          p."id", 
          p."id_reserva",
          p."valor", 
          p."status", 
          p."forma_pagamento",
          TO_CHAR(p."data_pagamento_utc", 'DD/MM/YYYY') as "data_formatada",
          CASE WHEN p."valor" > 0 THEN 'RECEITA' ELSE 'DESPESA' END as "tipo",
          pe."nome" as "nome_cliente",
          pa."nome" as "nome_servico"
        FROM "Pagamento" p
        INNER JOIN "Reserva" r ON p."id_reserva" = r."id"
        INNER JOIN "Pessoa" pe ON r."id_cliente" = pe."id"
        INNER JOIN "Pessoa_Papel" pp ON pe."id" = pp."id_pessoa"
        INNER JOIN "Pacote" pa ON r."id_pacote" = pa."id"
        WHERE pp."id_papel" = 1
          AND p."data_pagamento_utc"::DATE BETWEEN ${dataInicio} AND ${dataFim}
          AND (${fStatus} = '' OR p."status"::text = ${fStatus})
          AND (${fForma} = '' OR p."forma_pagamento"::text = ${fForma})
          AND (${fReserva} = 0 OR p."id_reserva" = ${fReserva})
        ORDER BY p."data_pagamento_utc" DESC
        LIMIT 50
      `;
    }

    return await db`
      SELECT 
        p."id", 
        p."id_reserva",
        p."valor", 
        p."status", 
        p."forma_pagamento",
        TO_CHAR(p."data_pagamento_utc", 'DD/MM/YYYY') as "data_formatada",
        CASE WHEN p."valor" > 0 THEN 'RECEITA' ELSE 'DESPESA' END as "tipo",
        pe."nome" as "nome_cliente",
        pa."nome" as "nome_servico"
      FROM "Pagamento" p
      INNER JOIN "Reserva" r ON p."id_reserva" = r."id"
      INNER JOIN "Pessoa" pe ON r."id_cliente" = pe."id"
      INNER JOIN "Pessoa_Papel" pp ON pe."id" = pp."id_pessoa"
      INNER JOIN "Pacote" pa ON r."id_pacote" = pa."id"
      WHERE pp."id_papel" = 1
        AND (${fStatus} = '' OR p."status"::text = ${fStatus})
        AND (${fForma} = '' OR p."forma_pagamento"::text = ${fForma})
        AND (${fReserva} = 0 OR p."id_reserva" = ${fReserva})
      ORDER BY p."data_pagamento_utc" DESC
      LIMIT 50
    `;
  } catch (error) {
    console.error("Erro na lógica de listar pagamentos com múltiplos filtros:", error);
    return [];
  }
}

export async function createPagamento({ id_reserva, valor, data_pagamento }) {
  try {
    const result = await db`
      INSERT INTO "Pagamento" ("id_reserva", "valor", "data_pagamento_utc", "status")
      VALUES (${id_reserva}, ${valor}, ${data_pagamento}, 'PAGO')
      RETURNING "id"
    `;
    return { success: true, insertedId: result[0].id };
  } catch (error) {
    console.error("Trigger/Banco barrou o pagamento:", error.message);
    return { success: false, error: error.message };
  }
}