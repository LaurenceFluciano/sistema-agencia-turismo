import sql from "../db";

async function listPacotes(searchQuery = '', statusFilter = '') {
  const filterClause = searchQuery
    ? statusFilter
      ? sql`WHERE pa."nome" ILIKE ${'%' + searchQuery + '%'} AND pa."status" = ${statusFilter}`
      : sql`WHERE pa."nome" ILIKE ${'%' + searchQuery + '%'}`
    : statusFilter
      ? sql`WHERE pa."status" = ${statusFilter}`
      : sql``;

  const pacotes = await sql`
    SELECT
      pa."id",
      pa."nome",
      pa."status",
      COALESCE((SELECT COUNT(*) FROM "Reserva" r WHERE r."id_pacote" = pa."id"), 0) AS quantidade_reservada,
      COALESCE(
        json_agg(
          json_build_object(
            'id_fornecedor_servico', pi."id_fornecedor_servico",
            'nome_comercial', fs."titulo_comercial",
            'tipo_servico', ts."nome_tipo",
            'status_fornecedor', fs."status"
          )
        ) FILTER (WHERE pi."id_fornecedor_servico" IS NOT NULL),
        '[]'
      ) AS itensSelecionados
    FROM "Pacote" pa
    LEFT JOIN "Pacote_Item" pi ON pi."id_pacote" = pa."id"
    LEFT JOIN "Fornecedor_Servico" fs ON fs."id" = pi."id_fornecedor_servico"
    LEFT JOIN "Servico" servico ON servico."id" = fs."id_servico"
    LEFT JOIN "Tipo_Servico" ts ON ts."id" = servico."id_tipo"
    ${filterClause}
    GROUP BY pa."id"
    ORDER BY pa."id" DESC
  `;

  return pacotes;
}

async function createPacote(data) {
  try {
    await sql.begin(async (tx) => {
      const [novoPacote] = await tx`
        INSERT INTO "Pacote" ("nome", "status")
        VALUES (${data.nome}, ${data.status || 'DISPONIVEL'})
        RETURNING "id";
      `;

      if (data.itens && data.itens.length) {
        const ids = data.itens;

        const existentes = await tx`
          SELECT id FROM "Fornecedor_Servico" WHERE id = ANY(${ids})
        `;

        const existentesIds = existentes.map((r) => r.id);
        const missing = ids.filter((id) => !existentesIds.includes(id));

        if (missing.length) {
          throw new Error(`Fornecedor_Servico inexistente para ids: ${missing.join(', ')}`);
        }

        for (const id of ids) {
          await tx`
            INSERT INTO "Pacote_Item" ("id_pacote", "id_fornecedor_servico")
            VALUES (${novoPacote.id}, ${id})
          `;
        }
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao criar pacote:', error);
    return { success: false, error: error.message };
  }
}

async function deletePacote(id) {
  try {
    const pacoteId = Number(id);
    if (Number.isNaN(pacoteId)) {
      throw new Error('ID de pacote inválido');
    }

    await sql.begin(async (tx) => {
      await tx`
        DELETE FROM "Pacote_Item" WHERE "id_pacote" = ${pacoteId}
      `;

      await tx`
        DELETE FROM "Pacote" WHERE "id" = ${pacoteId}
      `;
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir pacote:', error);
    return { success: false, error: error.message };
  }
}

async function updatePacote(id, data) {
  try {
    const pacoteId = Number(id);
    if (Number.isNaN(pacoteId)) {
      throw new Error('ID de pacote inválido');
    }

    await sql.begin(async (tx) => {
      await tx`
        DELETE FROM "Pacote_Item" WHERE "id_pacote" = ${pacoteId}
      `;

      await tx`
        UPDATE "Pacote" SET "nome" = ${data.nome} WHERE "id" = ${pacoteId}
      `;

      if (data.itensSelecionados && data.itensSelecionados.length) {
        const ids = data.itensSelecionados.map((item) => {
          if (typeof item === 'object') {
            return item.id_fornecedor_servico ?? item.id;
          }
          return item;
        });

        const existentes = await tx`
          SELECT id FROM "Fornecedor_Servico" WHERE id = ANY(${ids})
        `;

        const existentesIds = existentes.map((r) => r.id);
        const missing = ids.filter((id) => !existentesIds.includes(id));

        if (missing.length) {
          throw new Error(`Fornecedor_Servico inexistente para ids: ${missing.join(', ')}`);
        }

        for (const fornecedorId of ids) {
          await tx`
            INSERT INTO "Pacote_Item" ("id_pacote", "id_fornecedor_servico")
            VALUES (${pacoteId}, ${fornecedorId})
          `;
        }
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar pacote:', error);
    return { success: false, error: error.message };
  }
}

export { listPacotes, createPacote, deletePacote, updatePacote };
