'use server'
import sql from "../db";


async function listReservations() {
    const reservas = await sql`
        SELECT DISTINCT
            r."id",
            pe."nome" AS nome_cliente,
            r."status",
            r."data_inicio_viagem_utc",
            r."data_fim_viagem_utc",
            r."preco_total",
            pa."nome" AS nome_pacote
        FROM "Reserva" r
        LEFT JOIN "Pessoa" pe ON pe."id" = r."id_cliente"
        LEFT JOIN "Pacote" pa ON pa."id" = r."id_pacote"
    `

    return reservas
}

async function registerReservation(payload, items) {
    try {
        await sql.begin(async (sql) => {
            const [novaReserva] = await sql`
                INSERT INTO "Reserva" (
                    "id_cliente", 
                    "id_pacote",
                    "data_inicio_viagem_utc", 
                    "data_fim_viagem_utc", 
                    "status", 
                    "preco_total"
                ) VALUES (
                    ${payload.id_cliente}, 
                    ${payload.id_pacote},
                    ${payload.data_inicio_viagem_utc}, 
                    ${payload.data_fim_viagem_utc}, 
                    'CONFIRMADA', 
                    ${payload.preco_total}
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

export { listReservations, registerReservation };