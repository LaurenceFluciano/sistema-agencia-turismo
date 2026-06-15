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