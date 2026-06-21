'use server'
import  sql  from "@/services/db.js";

/**
 * Lista os logs de auditoria de forma paginada e com filtros aplicados.
 * Otimizado para usar os índices criados na tabela "Log_Auditoria".
 */
export async function listarAuditorias({ 
  nomeTabela = null, 
  operacao = null, 
  limite = 50, 
  offset = 0 
}) {
  try {
    const logs = await sql`
      SELECT 
        id,
        nome_tabela,
        operacao,
        dados_antigos,
        dados_novos,
        usuario_db,
        data_hora
      FROM "Log_Auditoria"
      WHERE 1=1
        ${nomeTabela ? sql`AND nome_tabela = ${nomeTabela}` : sql``}
        ${operacao ? sql`AND operacao = ${operacao}` : sql``}
      ORDER BY data_hora DESC
      LIMIT ${limite}
      OFFSET ${offset}
    `;

    return logs;
  } catch (error) {
    console.error("Erro ao buscar logs de auditoria no repositório:", error);
    throw error;
  }
}

/**
 * Busca o histórico de alterações específico de um registro (ex: de uma Reserva ID 5).
 * Esta query faz uso do operador '@>' aproveitando o seu índice GIN em 'dados_novos'.
 */
export async function buscarHistoricoRegistro(nomeTabela, idRegistro) {
  try {
    const filtroJson = { id: Number(idRegistro) };

    const historico = await sql`
      SELECT 
        id,
        nome_tabela,
        operacao,
        dados_antigos,
        dados_novos,
        usuario_db,
        data_hora
      FROM "Log_Auditoria"
      WHERE nome_tabela = ${nomeTabela}
        AND (
          dados_novos @> ${sql.json(filtroJson)} 
          OR 
          dados_antigos @> ${sql.json(filtroJson)}
        )
      ORDER BY data_hora DESC
    `;

    return historico;
  } catch (error) {
    console.error(`Erro ao buscar histórico do registro ${idRegistro} da tabela ${nomeTabela}:`, error);
    throw error;
  }
}

export {listarAuditorias, buscarHistoricoRegistro}