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




CREATE OR REPLACE PROCEDURE pd_rotina_mudar_pagamentos_cancelados_para_vencidos()
LANGUAGE plpgsql
AS $$
BEGIN
    
    UPDATE "Pagamento"
    SET "status" = 'VENCIDO'::tipo_status_pagamento
    WHERE "status" = 'PENDENTE'::tipo_status_pagamento 
      AND "data_pagamento_utc" < NOW();


    RAISE NOTICE 'Rotina concluída: Pagamentos atrasados devidamente cancelados.';
END;
$$;



CREATE OR REPLACE PROCEDURE
    pd_criar_oferta_comercial(
        pd_id_fornecedor INT,
        pd_nome_servico VARCHAR(255),
        pd_id_tipo_servico INT,
        pd_id_municipio INT,
        pd_titulo_comercial VARCHAR(256)
    )
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_servico INT;
BEGIN

    SELECT s."id"
    INTO v_id_servico
    FROM "Servico" s
    WHERE s."nome_oficial" = pd_nome_servico
      AND s."id_tipo" = pd_id_tipo_servico
      AND s."id_municipio" = pd_id_municipio;

    IF NOT FOUND THEN

        INSERT INTO "Servico" (
            "nome_oficial",
            "id_tipo",
            "id_municipio"
        )
        VALUES (
            pd_nome_servico,
            pd_id_tipo_servico,
            pd_id_municipio
        )
        RETURNING "id"
        INTO v_id_servico;

    END IF;

    INSERT INTO "Fornecedor_Servico" (
        "id_pessoa",
        "id_servico",
        "titulo_comercial"
    )
    VALUES (
        pd_id_fornecedor,
        v_id_servico,
        pd_titulo_comercial
    );

END;
$$;


-- Cadastrar pessoa
CREATE OR REPLACE PROCEDURE pd_cadastrar_pessoa(
    p_nome VARCHAR(255),
    p_telefone VARCHAR(15),
    p_email VARCHAR(320),
    p_tipo CHAR(1),
    p_ids_papeis INT[],
    p_cpf CHAR(11) DEFAULT NULL,
    p_data_nascimento DATE DEFAULT NULL,
    p_razao_social VARCHAR(255) DEFAULT NULL,
    p_cnpj CHAR(14) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_pessoa INT;
    v_id_papel INT;
    v_papel INT;
BEGIN

    INSERT INTO "Pessoa" ("nome", "telefone", "email", "tipo")
    VALUES (p_nome, p_telefone, p_email, p_tipo)
    RETURNING "id" INTO v_id_pessoa;


    IF p_tipo = 'F' THEN

        INSERT INTO "Pessoa_Fisica" ("id_pessoa", "cpf", "data_nascimento")
        VALUES (v_id_pessoa, p_cpf, p_data_nascimento);

    ELSIF p_tipo = 'J' THEN

        INSERT INTO "Pessoa_Juridica" ("id_pessoa", "razao_social", "cnpj")
        VALUES (v_id_pessoa, p_razao_social, p_cnpj);

    ELSE
        RAISE EXCEPTION 'Tipo inválido. Use F ou J.';
    END IF;


    FOREACH v_papel IN ARRAY p_ids_papeis LOOP

        INSERT INTO "Pessoa_Papel" ("id_pessoa", "id_papel")
        VALUES (v_id_pessoa, v_papel)
        ON CONFLICT DO NOTHING;

    END LOOP;

    RAISE NOTICE 'Pessoa cadastrada com ID %', v_id_pessoa;
END;
$$;


-- Atualizar Pessoa

CREATE OR REPLACE PROCEDURE pd_atualizar_pessoa(
    p_id_pessoa INT,
    p_nome VARCHAR(255),
    p_telefone VARCHAR(15),
    p_email VARCHAR(320),
    p_tipo CHAR(1),
    p_cpf CHAR(11) DEFAULT NULL,
    p_data_nascimento DATE DEFAULT NULL,
    p_razao_social VARCHAR(255) DEFAULT NULL,
    p_cnpj CHAR(14) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_tipo_atual CHAR(1);
BEGIN

    SELECT tipo INTO v_tipo_atual
    FROM "Pessoa"
    WHERE id = p_id_pessoa;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pessoa ID % não encontrada', p_id_pessoa;
    END IF;


    UPDATE "Pessoa"
    SET nome = p_nome,
        telefone = p_telefone,
        email = p_email,
        tipo = p_tipo
    WHERE id = p_id_pessoa;


    IF p_tipo = 'F' THEN

        INSERT INTO "Pessoa_Fisica" ("id_pessoa", "cpf", "data_nascimento")
        VALUES (p_id_pessoa, p_cpf, p_data_nascimento)
        ON CONFLICT ("id_pessoa") DO UPDATE
        SET cpf = EXCLUDED.cpf,
            data_nascimento = EXCLUDED.data_nascimento;

        DELETE FROM "Pessoa_Juridica"
        WHERE "id_pessoa" = p_id_pessoa;

    ELSIF p_tipo = 'J' THEN

        INSERT INTO "Pessoa_Juridica" ("id_pessoa", "razao_social", "cnpj")
        VALUES (p_id_pessoa, p_razao_social, p_cnpj)
        ON CONFLICT ("id_pessoa") DO UPDATE
        SET razao_social = EXCLUDED.razao_social,
            cnpj = EXCLUDED.cnpj;


        DELETE FROM "Pessoa_Fisica"
        WHERE "id_pessoa" = p_id_pessoa;

    ELSE
        RAISE EXCEPTION 'Tipo inválido';
    END IF;

    RAISE NOTICE 'Pessoa ID % atualizada com sucesso', p_id_pessoa;
END;
$$;



-- Atualizar papeis das pessoas [WARN: Pessoa sem papel PODE desaparecer ]
CREATE OR REPLACE PROCEDURE pd_atualizar_papeis_pessoa(
    p_id_pessoa INT,
    p_ids_papeis INT[]
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_papel INT;
BEGIN
    DELETE FROM "Pessoa_Papel"
    WHERE "id_pessoa" = p_id_pessoa;

    FOREACH v_papel IN ARRAY p_ids_papeis LOOP
        INSERT INTO "Pessoa_Papel" ("id_pessoa", "id_papel")
        VALUES (p_id_pessoa, v_papel);
    END LOOP;

    RAISE NOTICE 'Papéis atualizados para pessoa %', p_id_pessoa;
END;
$$;