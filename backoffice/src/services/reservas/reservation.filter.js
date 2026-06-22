import sql from "../db";
import { z } from "zod";


const statusValidos = [
  "RASCUNHO", 
  "CONFIRMADA", 
  "CANCELADA", 
  "PENDENTE",
  "CONCLUIDA",
  "EM_ATRASO"
]

const orderByValidos = [
  "id", 
  "nome_pessoa",
  "data_inicio_viagem_utc"
]


/**
 * @typedef {Object} filters
 * @property {string} searchByClientName
 * @property {statusValidos} status
 * @property {string} orderBy
 */


export function buildReservationFilters(searchParams) {
    const filters = [];

    if (searchParams.searchByClientName) {
        const clientName = `%${searchParams.searchByClientName}%`
        filters.push(sql`AND pe."nome" ILIKE ${clientName}`);
    } 

    if (searchParams.status) {
        const statusSchema = z
            .string()
            .trim()
            .transform((val) => val.toUpperCase())

        const result = statusSchema.safeParse(searchParams.status);
        
        if (result.success && statusValidos.includes(result.data)) {
            const statusSanitizado = result.data;
            filters.push(sql`AND r.status = ${statusSanitizado}`);
        } else {
            console.warn(`Status inválido bloqueado: ${searchParams.status}`);
        }
    }

    if (orderByValidos.includes(searchParams.orderBy)) {
        filters.push(sql`ORDER BY ${searchParams.orderBy} ASC`)
    } else {
        filters.push(sql`ORDER BY r."id" ASC`)
    }



    return filters.length > 0 ? sql`${filters}` : sql``;
}

