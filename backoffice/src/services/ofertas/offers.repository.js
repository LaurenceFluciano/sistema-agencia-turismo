'use server'
import sql from "../db";


async function listOffers() {
    const offers = await sql`
        SELECT * FROM vw_fornecedor_servico_completo WHERE status_fornecedor = 'ATIVO';
    `

    return offers
}



export { listOffers }