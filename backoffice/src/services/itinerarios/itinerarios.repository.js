'use server'
import sql from "../db";

async function fetchItinerarios(id_reserva, filters) {
    return await sql`
        SELECT * FROM vw_relatorio_itinerario_completo
        WHERE reserva_id = ${id_reserva}
        ${filters}
        ORDER BY ordem_passo ASC
    `;
}

async function createItinerario(data) {
    try {
        await sql`
            INSERT INTO "Itinerario" (
                id_reserva, 
                id_fornecedor_servico,
                id_municipio,
                data_hora_inicio_utc, 
                data_hora_fim_utc, 
                voucher_codigo, 
                descricao_evento,
                tipo_evento,
                ordem_passo,
                status
                )
            VALUES (
                ${data.id_reserva}, 
                ${data.id_oferta},
                ${data.id_municipio}, 
                ${data.data_inicio}, 
                ${data.data_fim}, 
                ${data.voucher}, 
                ${data.roteiro},
                ${data.tipo_evento},
                ${data.ordem_passo},
                'RASCUNHO'
            )
        `;

        return {success: true, message: "Itinerário adicionado com sucesso"}
    } catch(err) {
        console.log(err)
        return {success: false, message: err.message}
    }
}

async function updateItinerario(id, reservaId, data) {
    try {
        await sql`
            UPDATE "Itinerario" SET
                id_fornecedor_servico =  ${data.id_oferta},
                id_municipio = ${data.id_municipio},
                data_hora_inicio_utc = ${data.data_inicio}, 
                data_hora_fim_utc = ${data.data_fim}, 
                voucher_codigo = ${data.voucher}, 
                descricao_evento = ${data.roteiro},
                tipo_evento = ${data.tipo_evento},
                ordem_passo = ${data.ordem_passo},
                status = ${data.status}
            WHERE id = ${id}
            AND "id_reserva" = ${reservaId}
        `;

        return {success: true, message: "Itinerário atualziado com sucesso"}
    } catch(err) {
        console.log(err)
        return {success: false, message: err.message}
    }

}

async function getItinerarioById(id_reserva, id_itinerario) {
    const itinerarios = await sql`
        SELECT * FROM vw_relatorio_itinerario_completo 
        WHERE reserva_id = ${id_reserva}
        AND "itinerario_id" = ${id_itinerario}

    `

    return itinerarios[0]
}

export async function deleteItinerarios(ids, reservaId){
    if (!reservaId) throw new Error("ID da reserva é obrigatório para deletar!");
    
    for (let id of ids) {
        await sql`
            DELETE FROM "Itinerario"
            WHERE "id" = ${id}
            AND "id_reserva" = ${reservaId}
        `
    }
    return { success: true, message: "Removido com sucesso" };
}

export { fetchItinerarios, createItinerario, getItinerarioById, updateItinerario, deleteItinerarios }