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


CREATE OR REPLACE PROCEDURE pd_rotina_cancelar_pagamentos_vencidos()
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE "Reserva"
    SET "status" = 'CANCELADA'::tipo_status_reserva
    WHERE "id" IN (
        SELECT "id_reserva" 
        FROM "Pagamento" 
        WHERE "status" = 'PENDENTE'::tipo_status_pagamento 
          AND "data_pagamento_utc" < NOW()
    );
    
    UPDATE "Pagamento"
    SET "status" = 'VENCIDO'::tipo_status_pagamento
    WHERE "status" = 'PENDENTE'::tipo_status_pagamento 
      AND "data_pagamento_utc" < NOW();


    RAISE NOTICE 'Rotina concluída: Pagamentos atrasados e suas respectivas reservas foram devidamente cancelados.';
END;
$$;



CREATE OR REPLACE PROCEDURE pd_cadastrar_cliente(
    p_nome VARCHAR(255),
    p_telefone VARCHAR(15),
    p_email VARCHAR(320),
    p_tipo_pessoa CHAR(1),
    p_cpf CHAR(11) DEFAULT NULL,
    p_data_nascimento DATE DEFAULT NULL,
    p_razao_social VARCHAR(255) DEFAULT NULL,
    p_cnpj CHAR(14) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_pessoa INT;
    v_id_papel_cliente INT;
BEGIN
    SELECT "id" INTO v_id_papel_cliente 
    FROM "Papel" 
    WHERE "nome_papel" = 'Cliente';
    
    IF v_id_papel_cliente IS NULL THEN
        RAISE EXCEPTION 'Erro crítico: O papel ''Cliente'' não foi localizado na tabela Papel.';
    END IF;


    INSERT INTO "Pessoa" ("nome", "telefone", "email", "tipo_pessoa")
    VALUES (p_nome, p_telefone, p_email, p_tipo_pessoa)
    RETURNING "id" INTO v_id_pessoa;

    IF p_tipo_pessoa = 'F' THEN

        IF p_cpf IS NULL THEN
            RAISE EXCEPTION 'Para cadastrar Pessoa Física (F), o parâmetro de CPF é obrigatório.';
        END IF;
        
        INSERT INTO "Pessoa_Fisica" ("id_pessoa", "cpf", "data_nascimento", "tipo_pessoa")
        VALUES (v_id_pessoa, p_cpf, p_data_nascimento, 'F');
        
    ELSIF p_tipo_pessoa = 'J' THEN
        
        IF p_cnpj IS NULL OR p_razao_social IS NULL THEN
            RAISE EXCEPTION 'Para cadastrar Pessoa Jurídica (J), CNPJ e Razão Social são obrigatórios.';
        END IF;
        
        INSERT INTO "Pessoa_Juridica" ("id_pessoa", "razao_social", "cnpj", "tipo_pessoa")
        VALUES (v_id_pessoa, p_razao_social, p_cnpj, 'J');
    ELSE
        RAISE EXCEPTION 'Tipo de pessoa inválido. Utilize ''F'' para Física ou ''J'' para Jurídica.';
    END IF;


    INSERT INTO "Pessoa_Papel" ("id_pessoa", "id_papel")
    VALUES (v_id_pessoa, v_id_papel_cliente);

    RAISE NOTICE 'Cliente % cadastrado com sucesso! ID gerado: %', p_nome, v_id_pessoa;
END;
$$;

