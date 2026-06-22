'use server'
import sql from "../db";


export async function listReservations(filters) {
    const reservas = await sql`
        SELECT DISTINCT
            r."id",
            pe."id" as id_cliente,
            pe."nome" AS nome_cliente,
            pf."cpf" AS cpf,
            pe."email" AS email,
            r."status",
            r."data_inicio_viagem_utc",
            r."data_fim_viagem_utc",
            r."preco_total",
            r."orcamento",
            pa."nome" AS nome_pacote,
            pa."id" AS id_pacote,
            pa."status" AS status_pacote
        FROM "Reserva" r
        LEFT JOIN "Pacote" pa ON pa."id" = r."id_pacote"
        LEFT JOIN "Pessoa" pe ON pe."id" = r."id_cliente"
        JOIN "Pessoa_Fisica" pf ON pe."id" = pf."id_pessoa"
        ${filters}
    `

    return reservas
}

export async function registerReservation(payload, items) {
    // adiciona itens do pacote pode deixar assim
    try {
        await sql.begin(async (sql) => {
            const [novaReserva] = await sql`
                INSERT INTO "Reserva" (
                    "id_cliente", 
                    "data_inicio_viagem_utc", 
                    "data_fim_viagem_utc", 
                    "status",
                    "orcamento"
                ) VALUES (
                    ${payload.id_cliente}, 
                    ${payload.data_inicio_viagem_utc}, 
                    ${payload.data_fim_viagem_utc}, 
                    'RASCUNHO',
                    ${payload.orcamento}
                ) RETURNING "id";
            `;

            if (items?.length > 0) {
                const itensComId = items.map(item => ({
                    ...item,
                    id_reserva: novaReserva.id
                }));


                await sql`
                    INSERT INTO "Reserva_Item" ${sql(itensComId, 
                        'id_reserva', 
                        'id_fornecedor_servico', 
                        'custo_fornecedor', 
                        'preco_venda'
                    )}
                `;
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Erro na transação:", error);
        return { success: false, error: error.message };
    }
}

export async function updateReservation(payload, items) {
    // atualiza a reserva normalmente, não tem responsabilidade de remover itens do pacote
    try {
        await sql.begin(async (sql) => {

            await sql`
                UPDATE "Reserva"
                SET 
                    "id_cliente" = ${payload.id_cliente},
                    "data_inicio_viagem_utc" = ${payload.data_inicio_viagem_utc},
                    "data_fim_viagem_utc" = ${payload.data_fim_viagem_utc},
                    "orcamento" = ${payload.orcamento},
                    "status" = ${payload.status}
                WHERE "id" = ${payload.id_reserva};
            `;

            await sql`
                DELETE FROM "Reserva_Item"
                WHERE "id_reserva" = ${payload.id_reserva}
                AND gerado_pelo_pacote = false;
            `;

            if (items?.length > 0) {
                const itensComId = items.map(item => ({
                    ...item,
                    id_reserva: payload.id_reserva
                }));

                await sql`
                    INSERT INTO "Reserva_Item" ${sql(
                        itensComId,
                        'id_reserva',
                        'id_fornecedor_servico',
                        'custo_fornecedor',
                        'preco_venda',
                        'gerado_pelo_pacote'
                    )}
                `;
            }
        });

        return { success: true };

    } catch (error) {
        console.error("Erro no update:", error);
        return { success: false, error: error.message };
    }
}


export async function listReservationItemsByReservationId(id, pegarGeradoPeloPacote=false) {
    // Aqui mantem o id pq estou listando apenas
    const reservationItems = await sql`
        SELECT 
            ri."custo_fornecedor",
            ri."preco_venda",
            ri."id_fornecedor_servico",
            fs."titulo_comercial" as nomeOferta,
            m."nome" AS cidade,
            e."nome" AS estado,
            ri."gerado_pelo_pacote" AS gerado_pelo_pacote
        FROM
            "Reserva_Item" ri
        JOIN "Fornecedor_Servico" fs ON fs."id" = ri."id_fornecedor_servico"
        JOIN "Servico" s ON fs."id_servico" = s."id"
        JOIN "Municipio" m ON s."id_municipio" = m."id"
        JOIN "Estado" e ON m."id_estado" = e."id"
        WHERE "id_reserva" = ${id}
        AND (
            ${pegarGeradoPeloPacote} = TRUE 
            OR ri."gerado_pelo_pacote" = FALSE
        )
    `

    return reservationItems
}

export async function updateReservationItemPrices(items, reservaId) {
    try {
        for (const item of items) {
            await sql`
                UPDATE "Reserva_Item"
                SET 
                    "custo_fornecedor" = ${item.custo_fornecedor},
                    "preco_venda" = ${item.preco_venda}
                WHERE "id_fornecedor_servico" = ${item.id_fornecedor_servico}
                AND "id_reserva" = ${reservaId}
            `;
        }
        return { success: true, message: "Salvo com sucesso" };
    } catch (err) {
        console.log("Ocorreu um erro: " + err)
        return { success: false, message: err.message}
    } 
}

export async function getReservationById(idReserva) {
    const reserva = await sql`
        SELECT
            r."id",
            pe."id" as id_cliente,
            pe."nome" AS nome_cliente,
            pf."cpf" AS cpf,
            pe."email" AS email,
            r."status",
            r."data_inicio_viagem_utc",
            r."data_fim_viagem_utc",
            r."preco_total",
            r."orcamento",
            pa."nome" AS nome_pacote,
            pa."id" AS id_pacote,
            pa."status" AS status_pacote
        FROM "Reserva" r
        LEFT JOIN "Pacote" pa ON pa."id" = r."id_pacote"
        LEFT JOIN "Pessoa" pe ON pe."id" = r."id_cliente"
        JOIN "Pessoa_Fisica" pf ON pe."id" = pf."id_pessoa"
        WHERE r."id" = ${idReserva}
    `


    return reserva
}


export async function deleteReservationById(idReserva) {
  try {
    await sql`
        DELETE FROM "Reserva"
        WHERE id = ${idReserva}
    `
        return {success: true, message: "Removido com sucesso"}
    }
    catch (err) {
        console.log(err)
        return {success: false, message: err.message}
    }
}