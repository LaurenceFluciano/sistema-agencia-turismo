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

DROP PROCEDURE IF EXISTS pd_cadastrar_cliente(
    VARCHAR(255),
    VARCHAR(15),
    VARCHAR(320),
    CHAR(1),
    CHAR(11),
    DATE,
    VARCHAR(255),
    CHAR(14)
);

DROP PROCEDURE IF EXISTS pd_rotina_cancelar_pagamentos_vencidos();

DROP PROCEDURE IF EXISTS pd_atualizar_cliente(
    INT,
    VARCHAR(255),
    VARCHAR(15),
    VARCHAR(320),
    CHAR(1),
    CHAR(11),
    DATE,
    VARCHAR(255),
    CHAR(14)
)