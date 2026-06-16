CREATE OR REPLACE VIEW vw_fornecedor_servico_completo AS
SELECT 
    fs."id" AS id_fornecedor_servico,
    fs."titulo_comercial" AS nome_comercial,
    p."nome" AS nome_fornecedor_parceiro,
    s."nome_oficial" AS nome_oficial_servico,
    ts."nome_tipo" AS tipo_servico,
    fs."status" AS status_fornecedor,
    m."nome" AS municipio_cidade,
    e."nome" AS nome_estado,
    e."sigla" AS sigla_estado
FROM 
    "Fornecedor_Servico" fs
JOIN 
    "Pessoa" p ON fs."id_pessoa" = p."id"
JOIN 
    "Servico" s ON fs."id_servico" = s."id"
JOIN 
    "Tipo_Servico" ts ON s."id_tipo" = ts."id"
JOIN 
    "Municipio" m ON s."id_municipio" = m."id"
JOIN 
    "Estado" e ON m."id_estado" = e."id";


CREATE OR REPLACE VIEW vw_relatorio_itinerario_completo AS
SELECT 
    i."id" AS itinerario_id,
    r."id" AS reserva_id,
    p."nome" AS nome_cliente,
    s."nome_oficial" AS nome_servico,
    m."nome" AS nome_municipio,
    i."ordem_passo",
    i."voucher_codigo",
    i."data_hora_inicio_utc",
    i."data_hora_fim_utc",
    i."tipo_evento",
    i."descricao_evento",
    i."status" AS status_itinerario
FROM "Itinerario" i
JOIN "Reserva" r ON i."id_reserva" = r."id"
JOIN "Pessoa" p ON r."id_cliente" = p."id"
JOIN "Reserva_Item" ri ON i."id_reserva" = ri."id_reserva" 
                      AND i."id_fornecedor_servico" = ri."id_fornecedor_servico"
JOIN "Fornecedor_Servico" fs ON ri."id_fornecedor_servico" = fs."id"
JOIN "Servico" s ON fs."id_servico" = s."id"
JOIN "Municipio" m ON i."id_municipio" = m."id";

CREATE OR REPLACE VIEW vw_pacotes_mais_reservados AS
SELECT 
    pa."id" AS pacote_id,
    pa."nome" AS nome_pacote,
    COUNT(r."id") AS total_reservas,
    SUM(r."preco_total") AS receita_total_gerada
FROM "Pacote" pa
JOIN "Reserva" r ON r."id_pacote" = pa."id"
WHERE r."status" NOT IN ('CANCELADA', 'RASCUNHO') 
GROUP BY pa."id", pa."nome"
ORDER BY total_reservas DESC;