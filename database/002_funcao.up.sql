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



CREATE OR REPLACE FUNCTION fn_copiar_itens_pacote_para_reserva()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."id_pacote" IS NOT NULL THEN

        PERFORM 1 FROM "Pacote" pa WHERE NEW."id_pacote" = pa."id";

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Pacote (ID %) não existe. A reserva não será criada.', NEW."id_pacote"; 
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
BEGIN
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

CREATE OR REPLACE FUNCTION
    fn_marcar_reserva_como_concluido_ou_em_atraso()
RETURNS TRIGGER AS $$
BEGIN

    PERFORM 1 
    FROM "Pagamento" 
    WHERE "status" = 'VENCIDO' 
    AND "id_reserva" = NEW."id_reserva";


    IF FOUND THEN
        UPDATE "Reserva" 
        SET "status" = 'EM_ATRASO'::tipo_status_reserva 
        WHERE "id" = NEW."id_reserva";
        
    ELSE
        PERFORM 1
        FROM "Pagamento" 
        WHERE "status" = 'PENDENTE' 
        AND "id_reserva" = NEW."id_reserva";


        IF NOT FOUND THEN
            UPDATE "Reserva" 
            SET "status" = 'CONCLUIDA'::tipo_status_reserva 
            WHERE "id" = NEW."id_reserva";
        END IF;
    END IF;

    RETURN NEW;
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
    WHERE r."data_inicio_viagem_utc"::DATE BETWEEN data_inicio AND data_fim
      AND r."status" NOT IN ('RASCUNHO', 'CANCELADA');

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
    SELECT COALESCE(SUM("preco_venda" - "custo_fornecedor"), 0)
    INTO v_lucro_reserva
    FROM "Reserva_Item"
    WHERE "id_reserva" = p_id_reserva;

    RETURN v_lucro_reserva;
END;
$$ LANGUAGE plpgsql;