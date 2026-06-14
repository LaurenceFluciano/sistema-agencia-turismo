DROP PROCEDURE IF EXISTS pd_definir_preco_da_reserva(
    INT,
    INT,
    DECIMAL(13,4),
    NUMERIC(5,2)
);

DROP PROCEDURE IF EXISTS     pd_adicionar_passageiro_na_viagem(
    VARCHAR(255),
    INT
);