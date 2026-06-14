CREATE OR REPLACE PROCEDURE pd_definir_preco_da_reserva(
    pd_id_reserva INT,
    pd_id_fornecedor_servico INT,
    pd_preco_fornecedor DECIMAL(13,4),
    pd_percentual_aumento NUMERIC(5,2)
)
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE "Reserva_Item"
    SET
        "custo_fornecedor" = pd_preco_fornecedor,
        "preco_venda" =
            pd_preco_fornecedor *
            (1 + pd_percentual_aumento / 100.0)
    WHERE
        "id_reserva" = pd_id_reserva
        AND "id_fornecedor_servico" = pd_id_fornecedor_servico;

    IF NOT FOUND THEN
        RAISE WARNING
            'Reserva % e serviço % não encontrados.',
            pd_id_reserva,
            pd_id_fornecedor_servico;
    END IF;

END;
$$;


CREATE OR REPLACE PROCEDURE
    pd_adicionar_passageiro_na_viagem(
        pd_nome VARCHAR(255),
        pd_id_reserva INT
    )
LANGUAGE plpgsql AS $$
DECLARE
    v_id_pessoa INT;
BEGIN
    INSERT INTO "Pessoa" ("nome","tipo_pessoa") 
    VALUES (pd_nome, 'F')
    RETURNING "id" INTO v_id_pessoa;

    INSERT INTO "Pessoa_Fisica" ("id_pessoa","tipo_pessoa") 
    VALUES (v_id_pessoa, 'F');

    INSERT INTO "Passageiro" (
        "id_reserva",
        "id_pessoa"
    ) VALUES (
        pd_id_reserva,
        v_id_pessoa
    );
END;
$$;

