-- TESTES (FUNCIONAM APENAS COM OS DADOS DA SEED!)
-- DEVE SER REALIZADO UMA UNICA VEZ

-- Testando Procedures

-- Procedure de rotina que marca pagamentos vencidos
CALL pd_rotina_cancelar_pagamentos_vencidos();


-- Procedures que cadastram clientes
-- Deve retornar NOTICE
CALL pd_cadastrar_cliente(
    'Marcos Pereira',
    '48999887766',
    'marcos.pereira@email.com',
    'F',
    '12345678901',
    '1992-04-15'
);

-- Deve retornar NOTICE
CALL pd_cadastrar_cliente(
    'Empresa XPTO Turismo',
    '1133334444',
    'contato@xpto.com.br',
    'J',
    NULL,
    NULL,
    'XPTO Turismo LTDA',
    '12345678000199'
);

-- Deve retornar ERRO
CALL pd_cadastrar_cliente(
    'Cliente Inválido',
    '48999999999',
    'invalido@email.com',
    'F'
);

-- Procedure que cadastra ofertas

CALL pd_criar_oferta_comercial(
    12,
    'Hotel Plaza Paulista',
    1,
    1,
    'Hotel Plaza Paulista - Tarifa Corporativa'
);

SELECT *
FROM "Servico"
WHERE "nome_oficial" = 'Hotel Plaza Paulista';

SELECT *
FROM "Fornecedor_Servico"
WHERE "titulo_comercial" = 'Hotel Plaza Paulista - Tarifa Corporativa';


CALL pd_criar_oferta_comercial(
    12,
    'Hotel Plaza Paulista',
    1,
    1,
    'Hotel Plaza Paulista - Fim de Semana'
);

SELECT *
FROM "Fornecedor_Servico"
WHERE "id_servico" = (
    SELECT "id"
    FROM "Servico"
    WHERE "nome_oficial" = 'Hotel Plaza Paulista'
);

CALL pd_criar_oferta_comercial(
    13,
    'Hotel Plaza Paulista',
    1,
    1,
    'Hotel Plaza Paulista - Agência Parceira'
);

SELECT
    fs."id",
    p."nome",
    s."nome_oficial",
    fs."titulo_comercial"
FROM "Fornecedor_Servico" fs
JOIN "Pessoa" p
    ON p."id" = fs."id_pessoa"
JOIN "Servico" s
    ON s."id" = fs."id_servico"
WHERE s."nome_oficial" = 'Hotel Plaza Paulista';


-- Cria também. (OBS: proposital, a validacao de papel nao ocorre aqui.)
CALL pd_criar_oferta_comercial(
    1,
    'Hotel Plaza Minas',
    1,
    1,
    'Hotel Plaza Minas - Agência Parceira'
);



-- Testando funções 
-- Deve Listar
SELECT * FROM fn_listar_servicos_por_municipio(5);
SELECT *
FROM fn_calcular_lucro_periodo(
    CURRENT_DATE - 15,
    CURRENT_DATE + 15
);
SELECT * FROM fn_calcular_lucro_reserva(1);


-- Testando views
SELECT * FROM vw_fornecedor_servico_completo;
SELECT * FROM vw_pacotes_mais_reservados;
SELECT * FROM vw_relatorio_itinerario_completo;

