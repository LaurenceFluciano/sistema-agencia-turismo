import sql from "../db";
import { z } from "zod";

const statusValidos = [
  "RASCUNHO",
  "AGENDADO",
  "EM_ANDAMENTO",
  "CONCLUIDO",
  "SUSPENSO",
  "CANCELADO"
];

/**
 * @typedef {Object} filters
 * @property {string} searchByRoteiro (nome do serviço ou descricao)
 * @property {string} status
 * @property {string[]} selectedColumns (colunas para o SELECT)
 */

export function buildItinerarioFilters(searchParams) {
    const filters = [];

    if (searchParams.searchByRoteiro) {
        const term = `%${searchParams.searchByRoteiro}%`;

        filters.push(sql`
            AND (nome_servico ILIKE ${term}
            OR descricao_evento ILIKE ${term})
        `);
    }

    if (searchParams.status) {
        const status = searchParams.status?.toUpperCase();

        if (statusValidos.includes(status)) {
            filters.push(sql`AND status_itinerario = ${status}`);
        }
    }

    return filters.length > 0 ? sql`${filters}` : sql``;
}