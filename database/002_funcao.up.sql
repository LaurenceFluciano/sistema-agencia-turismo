/**
* FUNCOES OPERACIONAIS
*/

-- Função responsável por validar periodos de datas
CREATE OR REPLACE FUNCTION fn_validar_periodo(data_hora_inicio ANYELEMENT, data_hora_fim ANYELEMENT)
RETURNS BOOLEAN AS $$
BEGIN

  RETURN COALESCE(data_hora_fim >= data_hora_inicio, TRUE);
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- Função responsável por atualizar automaticamente o campo data_atualizacao (quando existir) quando ocorrer qualquer alteração.
CREATE OR REPLACE FUNCTION fn_atualiza_data_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função que impede cadastros de pessoa inconsistentes
CREATE OR REPLACE FUNCTION check_pessoa_fisica_tipo()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT tipo FROM "Pessoa" WHERE id = NEW.id_pessoa) != 'F' THEN
        RAISE EXCEPTION 'Erro: Esta pessoa não é do tipo Física (F).';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_pessoa_juridica_tipo()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT tipo FROM "Pessoa" WHERE id = NEW.id_pessoa) != 'J' THEN
        RAISE EXCEPTION 'Erro: Esta pessoa não é do tipo Jurídica (J).';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/**
* FUNCOES DE NEGOCIO
*/


/*******************************\
* GESTAO DE CADASTRO DE ATORES *
\*******************************/



/* Regra de Negócio - Papel da Pessoa
* 1 - Uma pessoa física pode ser um cliente ou fornecedor.
* 2 - Uma pessoa jurídica pode ser um cliente, fornecedor ou empresa.
*/

CREATE OR REPLACE FUNCTION 
fn_validar_papel_pessoa()
RETURNS TRIGGER AS $$
DECLARE
    d_tipo_pessoa CHAR(1);
BEGIN

    SELECT "Pessoa"."tipo" 
    INTO d_tipo_pessoa 
    FROM "Pessoa" WHERE 
    NEW.id_pessoa = "Pessoa"."id";

    IF NOT EXISTS (
        SELECT 1 
        FROM "Tipo_Pessoa_Papel" tp
        WHERE tp."tipo_pessoa" = d_tipo_pessoa
            AND tp."id_papel" = NEW.id_papel
    ) THEN

        RAISE EXCEPTION 'Papel (ID %) não permitido para Tipo de Pessoa (%)[Regra de Negócio].', 
            NEW.id_papel, d_tipo_pessoa;

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/* RESERVAS */


CREATE OR REPLACE FUNCTION fn_copiar_itens_pacote_para_reserva()
RETURNS TRIGGER AS $$
DECLARE
    v_status tipo_status_reserva;
BEGIN
    IF NEW."id_pacote" IS NOT NULL THEN

        SELECT status INTO v_status
        FROM "Reserva"
        WHERE id = NEW.id;

        IF v_status IS DISTINCT FROM 'RASCUNHO' THEN
            RAISE EXCEPTION
            'Não é permitido gerar itens de pacote fora do estado RASCUNHO (status atual: %).',
            v_status;
        END IF;

        PERFORM 1 FROM "Pacote" pa WHERE NEW."id_pacote" = pa."id";

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Pacote (ID %) não existe. A reserva não será criada.', NEW."id_pacote"; 
        END IF;

        IF OLD."id_pacote" IS NOT NULL THEN
            DELETE FROM "Reserva_Item" 
            WHERE "id_reserva" = NEW."id" 
            AND "gerado_pelo_pacote" = TRUE;
        END IF;

        INSERT INTO "Reserva_Item" (
            "id_reserva",
            "id_fornecedor_servico",
            "gerado_pelo_pacote"
        ) 
        SELECT 
            NEW."id",
            pi."id_fornecedor_servico",
            TRUE
        FROM "Pacote_Item" pi
        WHERE pi."id_pacote" = NEW."id_pacote";


    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fn_remover_itens_pacote_da_reserva()
RETURNS TRIGGER AS $$
DECLARE
    v_status tipo_status_reserva;
BEGIN

    SELECT status INTO v_status
    FROM "Reserva"
    WHERE id = NEW.id;

    IF v_status IN ('CANCELADA', 'CONCLUIDA') THEN
        RETURN NEW;
    END IF;

    IF NEW."id_pacote" IS NULL 
        AND 
       OLD."id_pacote" IS NOT NULL 
    THEN

        DELETE FROM "Reserva_Item" WHERE 
        "gerado_pelo_pacote" = TRUE AND "id_reserva" = NEW."id";
        
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_atualizar_total_reserva()
RETURNS TRIGGER AS $$
BEGIN

    UPDATE "Reserva"
    SET "preco_total" = (
        SELECT COALESCE(SUM("preco_venda"), 0)
        FROM "Reserva_Item"
        WHERE "id_reserva" =
            COALESCE(NEW."id_reserva", OLD."id_reserva")
    )
    WHERE "id" =
        COALESCE(NEW."id_reserva", OLD."id_reserva");

    RETURN NULL;

END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fn_listar_servicos_por_municipio(p_id_municipio INT)
RETURNS TABLE (
    id_servico INT,
    nome_servico VARCHAR,
    tipo_servico VARCHAR,
    status_servico tipo_status_servico,
    nome_municipio VARCHAR
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s."id",
        s."nome_oficial",
        ts."nome_tipo",
        s."status",
        m."nome"
    FROM 
        "Servico" s
    JOIN 
        "Municipio" m ON s."id_municipio" = m."id"
    JOIN 
        "Tipo_Servico" ts ON s."id_tipo" = ts."id"
    WHERE 
        s."id_municipio" = p_id_municipio; 
END;
$$;

CREATE OR REPLACE FUNCTION fn_calcular_lucro_periodo(
    data_inicio DATE,
    data_fim DATE
)
RETURNS DECIMAL(13,4) AS $$
DECLARE
    v_lucro_total DECIMAL(13,4) := 0;
BEGIN
    SELECT COALESCE(SUM(ri."preco_venda" - ri."custo_fornecedor"), 0)
    INTO v_lucro_total
    FROM "Reserva_Item" ri
    JOIN "Reserva" r ON ri."id_reserva" = r."id"
    JOIN "Itinerario" i ON ri."id_reserva" = i."id_reserva" 
                        AND ri."id_fornecedor_servico" = i."id_fornecedor_servico"
    WHERE r."data_inicio_viagem_utc"::DATE BETWEEN data_inicio AND data_fim
      AND r."status" NOT IN ('RASCUNHO', 'CANCELADA')
      AND i."status" = 'CONCLUIDO';

    RETURN v_lucro_total;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fn_calcular_lucro_reserva(
    p_id_reserva INT
)
RETURNS DECIMAL(13,4) AS $$
DECLARE
    v_lucro_reserva DECIMAL(13,4) := 0;
BEGIN
    SELECT COALESCE(SUM(ri."preco_venda" - ri."custo_fornecedor"), 0)
    INTO v_lucro_reserva
    FROM "Reserva_Item" ri
    JOIN "Itinerario" i ON ri."id_reserva" = i."id_reserva" 
                        AND ri."id_fornecedor_servico" = i."id_fornecedor_servico"
    WHERE ri."id_reserva" = p_id_reserva
      AND i."status" = 'CONCLUIDO';

    RETURN v_lucro_reserva;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fn_validar_pagamento_pago()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'PAGO' AND NEW.valor <= 0 THEN
        RAISE EXCEPTION 'Pagamentos com status PAGO devem possuir um valor positivo.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fn_validar_status_reserva_pagamento()
RETURNS TRIGGER AS $$
DECLARE
    v_status_reserva tipo_status_reserva;
BEGIN
    SELECT "status" INTO v_status_reserva FROM "Reserva" WHERE "id" = NEW.id_reserva;

    IF v_status_reserva IN ('RASCUNHO', 'CANCELADA') THEN
        RAISE EXCEPTION 'Não é permitido registrar pagamentos para reservas com status %.', v_status_reserva;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fn_check_insert_reserva_item()
RETURNS TRIGGER AS $$
DECLARE
    v_status tipo_status_reserva;
BEGIN

    SELECT status INTO v_status
    FROM "Reserva"
    WHERE id = NEW.id_reserva;

    IF v_status IS DISTINCT FROM 'RASCUNHO' THEN
        RAISE EXCEPTION
        'Não é permitido inserir Reserva_Item quando a reserva não está em RASCUNHO (status atual: %).',
        v_status;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fn_check_insert_itinerario()
RETURNS TRIGGER AS $$
DECLARE
    v_status tipo_status_reserva;
BEGIN

    SELECT status INTO v_status
    FROM "Reserva"
    WHERE id = NEW.id_reserva;

    IF v_status IS DISTINCT FROM 'RASCUNHO' THEN
        RAISE EXCEPTION
        'Não é permitido inserir Itinerário quando a reserva não está em RASCUNHO (status atual: %).',
        v_status;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fn_reserva_confirmada()
RETURNS TRIGGER AS $$
BEGIN

    IF NEW.status = 'CONFIRMADA' AND OLD.status IS DISTINCT FROM 'CONFIRMADA' THEN

        UPDATE "Itinerario"
        SET status = 'AGENDADO'
        WHERE id_reserva = NEW.id
          AND status IS DISTINCT FROM 'CANCELADO';

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fn_reserva_cancelada()
RETURNS TRIGGER AS $$
BEGIN

    IF NEW.status = 'CANCELADA' AND OLD.status IS DISTINCT FROM 'CANCELADA' THEN

        DELETE FROM "Reserva_Item"
        WHERE id_reserva = NEW.id;

        DELETE FROM "Itinerario"
        WHERE id_reserva = NEW.id;

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fn_reserva_concluida()
RETURNS TRIGGER AS $$
BEGIN

    IF NEW.status = 'CONCLUIDA' AND OLD.status IS DISTINCT FROM 'CONCLUIDA' THEN

        UPDATE "Itinerario"
        SET status = 'CONCLUIDO'
        WHERE id_reserva = NEW.id
          AND status = 'AGENDADO';

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_check_update_itinerario()
RETURNS TRIGGER AS $$
DECLARE
    v_status tipo_status_reserva;
BEGIN

    SELECT status INTO v_status
    FROM "Reserva"
    WHERE id = NEW.id_reserva;

    IF v_status = 'CONFIRMADA' THEN

        IF NEW.status NOT IN ('AGENDADO', 'CANCELADO', 'CONCLUIDO') THEN
            RAISE EXCEPTION
            'Status inválido para itinerário em reserva CONFIRMADA.';
        END IF;

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;