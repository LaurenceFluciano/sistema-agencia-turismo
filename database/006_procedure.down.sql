DROP PROCEDURE IF EXISTS pd_definir_preco_da_reserva(
    INT,
    INT,
    DECIMAL(13,4),
    NUMERIC(5,2)
);

DROP PROCEDURE IF EXISTS pd_adicionar_passageiro_na_viagem(
    VARCHAR(255),
    INT
);

DROP PROCEDURE IF EXISTS pd_criar_oferta_comercial(
    INT,
    VARCHAR(255),
    INT,
    INT,
    VARCHAR(256)
);

DROP PROCEDURE IF EXISTS pd_rotina_cancelar_pagamentos_vencidos();


-- FORNECEDOR
DROP PROCEDURE IF EXISTS pd_cadastrar_fornecedor;
DROP PROCEDURE IF EXISTS pd_atualizar_fornecedor;
DROP PROCEDURE IF EXISTS pd_adicionar_fornecedor_existente;

-- CLIENTE
DROP PROCEDURE IF EXISTS pd_cadastrar_cliente;
DROP PROCEDURE IF EXISTS pd_atualizar_cliente;
