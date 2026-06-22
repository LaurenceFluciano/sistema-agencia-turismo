-- Início: 000_tipos.up.sql
CREATE TYPE tipo_status_pessoa AS ENUM (
  'ATIVO', 
  'INATIVO'
);
CREATE TYPE tipo_status_pacote AS ENUM (
  'DISPONIVEL',
  'INDISPONIVEL',
  'ENCERRADO'
);
CREATE TYPE tipo_status_reserva AS ENUM (
  'RASCUNHO', 
  'CONFIRMADA', 
  'CANCELADA', 
  'CONCLUIDA'
);
CREATE TYPE tipo_status_pagamento AS ENUM (
  'PAGO', 
  'PENDENTE', 
  'VENCIDO'
);
CREATE TYPE tipo_status_fornecedor_servico AS ENUM (
  'ATIVO',
  'PAUSADO',
  'ENCERRADA'
);
CREATE TYPE tipo_status_itinerario AS ENUM (
  'RASCUNHO',
  'AGENDADO',
  'CONCLUIDO',
  'CANCELADO'
);
CREATE TYPE tipo_status_servico AS ENUM (
  'ATIVO',
  'INATIVO',
  'MANUTENCAO',
  'INTERDITADO'
);
-- Início: 001_ddl.up.sql
/*
* Cadastro e Gestão de Contatos/Atores
*/

CREATE TABLE "Pessoa" (
  "id" SERIAL,
  "nome" VARCHAR(255),
  "telefone" VARCHAR(15),
  "email" VARCHAR(320),
  "data_cadastro" TIMESTAMP DEFAULT NOW(),
  "status" tipo_status_pessoa DEFAULT 'ATIVO',
  "tipo" CHAR(1) CHECK ("tipo" IN ('F', 'J')),

  CONSTRAINT "pk_pessoa" PRIMARY KEY ("id")
);

CREATE TABLE "Papel" (
  "id" SERIAL,
  "nome_papel" VARCHAR(50) NOT NULL UNIQUE,

  CONSTRAINT "pk_papel" PRIMARY KEY ("id")
);

CREATE TABLE "Pessoa_Papel" (
  "id_pessoa" INT,
  "id_papel" INT,

  CONSTRAINT "pk_pessoa_papel" PRIMARY KEY ("id_pessoa", "id_papel"),
  CONSTRAINT "fk_pessoa_papel_pessoa" FOREIGN KEY ("id_pessoa") REFERENCES "Pessoa"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_pessoa_papel_papel" FOREIGN KEY ("id_papel") REFERENCES "Papel"("id") ON DELETE CASCADE
);

CREATE TABLE "Pessoa_Fisica" (
  "id_pessoa" INT,
  "cpf" CHAR(11),
  "data_nascimento" DATE,

  CONSTRAINT "pk_pessoa_fisica" PRIMARY KEY ("id_pessoa"),
  CONSTRAINT "fk_pessoa_fisica_pessoa" FOREIGN KEY ("id_pessoa") REFERENCES "Pessoa"("id") ON DELETE CASCADE
);

CREATE TABLE "Pessoa_Juridica" (
  "id_pessoa" INT,
  "razao_social" VARCHAR(255),
  "cnpj" CHAR(14),

  CONSTRAINT "pk_pessoa_juridica" PRIMARY KEY ("id_pessoa"),
  CONSTRAINT "fk_pessoa_juridica_pessoa" FOREIGN KEY ("id_pessoa") REFERENCES "Pessoa"("id") ON DELETE CASCADE
);

CREATE TABLE "Tipo_Pessoa_Papel" (
  "tipo_pessoa" CHAR(1),
  "id_papel" INT,

  CONSTRAINT "pk_tipo_pessoa_papel"
      PRIMARY KEY ("tipo_pessoa", "id_papel"),

  CONSTRAINT "chk_tipo_pessoa"
      CHECK ("tipo_pessoa" IN ('F', 'J'))
);

/*
* Cátalogo
*/

CREATE TABLE "Pais" (
  "id" SERIAL PRIMARY KEY,
  "nome" VARCHAR(255) NOT NULL
);

CREATE TABLE "Estado" (
  "id" SERIAL PRIMARY KEY,
  "id_pais" INT REFERENCES "Pais"("id"),
  "nome" VARCHAR(255) NOT NULL,
  "sigla" CHAR(2)
);

CREATE TABLE "Municipio" (
  "id" SERIAL PRIMARY KEY,
  "id_estado" INT REFERENCES "Estado"("id"),
  "nome" VARCHAR(255) NOT NULL
);

CREATE TABLE "Tipo_Servico" (
  "id" SERIAL,
  "nome_tipo" VARCHAR(255),

  CONSTRAINT "pk_tipo_servico" PRIMARY KEY ("id")
);

CREATE TABLE "Servico" (
  "id" SERIAL,
  "nome_oficial" VARCHAR(255),
  "id_municipio" INT,
  "data_atualizacao" TIMESTAMP DEFAULT NOW(),
  "status" tipo_status_servico DEFAULT 'ATIVO',
  "id_tipo" INT,

  CONSTRAINT "pk_servico" PRIMARY KEY ("id")
);

CREATE TABLE "Fornecedor_Servico" (
  "id" SERIAL,
  "id_pessoa" INT NOT NULL,
  "id_servico" INT NOT NULL,
  "titulo_comercial" VARCHAR(256),
  "status" tipo_status_fornecedor_servico DEFAULT 'ATIVO',
  "data_atualizacao" TIMESTAMP DEFAULT NOW(),

  CONSTRAINT "pk_fornecedor_servico" PRIMARY KEY ("id")
);

/*
* Módulo Pacotes
*/

CREATE TABLE "Pacote" (
  "id" SERIAL,
  "nome" VARCHAR(255),
  "status" tipo_status_pacote DEFAULT 'DISPONIVEL',
  CONSTRAINT "pk_pacote" PRIMARY KEY ("id")
);

CREATE TABLE "Pacote_Item" (
  "id_pacote" INT,
  "id_fornecedor_servico" INT,
  CONSTRAINT "pk_pacote_item" PRIMARY KEY ("id_pacote", "id_fornecedor_servico")
);

/* 
* MÓDULO RESERVAS E FINANCEIRO
*/

CREATE TABLE "Reserva" (
  "id" SERIAL,
  "id_cliente" INT NOT NULL,
  "id_pacote" INT,
  "data_inicio_viagem_utc" TIMESTAMP,
  "data_fim_viagem_utc" TIMESTAMP,
  "status" tipo_status_reserva,
  "preco_total" DECIMAL(13,4),

  CONSTRAINT "pk_reserva" PRIMARY KEY ("id")
);

CREATE TABLE "Reserva_Item" (
  "id_reserva" INT,
  "id_fornecedor_servico" INT,
  "custo_fornecedor" DECIMAL(13,4),
  "preco_venda" DECIMAL(13,4),
  CONSTRAINT "pk_reserva_item" PRIMARY KEY ("id_reserva", "id_fornecedor_servico")
);

CREATE TABLE "Pagamento" (
  "id" INT PRIMARY KEY,
  "id_reserva" INT,
  "valor" DECIMAL(13,4),
  "forma_pagamento" VARCHAR(50),
  "status" tipo_status_pagamento,
  "data_pagamento_utc" TIMESTAMP
);

/*
* MÓDULO ORGANIZAÇÃO VIAGEM
*/

CREATE TABLE "Itinerario" (
  "id" SERIAL,
  "id_reserva" INT NOT NULL,
  "id_fornecedor_servico" INT NOT NULL,
  "id_municipio" INT NOT NULL,
  "ordem_passo" INT,
  "voucher_codigo" VARCHAR(255),
  "data_hora_inicio_utc" TIMESTAMP,
  "data_hora_fim_utc" TIMESTAMP,
  "tipo_evento" VARCHAR(255),
  "descricao_evento" TEXT,
  "status" tipo_status_itinerario,
  CONSTRAINT "pk_itinerario" PRIMARY KEY ("id")
);

CREATE INDEX ON "Itinerario" ("id_reserva", "id_fornecedor_servico");

/*
* CONSTRAINTS DE INTEGRIDADE REFERENCIAL 
*/

ALTER TABLE "Servico" ADD FOREIGN KEY ("id_municipio") REFERENCES "Municipio" ("id");
ALTER TABLE "Servico" ADD FOREIGN KEY ("id_tipo") REFERENCES "Tipo_Servico" ("id");


ALTER TABLE "Fornecedor_Servico" ADD FOREIGN KEY ("id_pessoa") REFERENCES "Pessoa" ("id");
ALTER TABLE "Fornecedor_Servico" ADD FOREIGN KEY ("id_servico") REFERENCES "Servico" ("id");

ALTER TABLE "Pacote_Item" ADD FOREIGN KEY ("id_fornecedor_servico") REFERENCES "Fornecedor_Servico" ("id");
ALTER TABLE "Pacote_Item" ADD FOREIGN KEY ("id_pacote") REFERENCES "Pacote" ("id");


ALTER TABLE "Reserva" ADD FOREIGN KEY ("id_pacote") REFERENCES "Pacote" ("id");
ALTER TABLE "Reserva" ADD FOREIGN KEY ("id_cliente") REFERENCES "Pessoa" ("id");
ALTER TABLE "Pagamento" ADD FOREIGN KEY ("id_reserva") REFERENCES "Reserva" ("id") ON DELETE RESTRICT;

ALTER TABLE "Reserva_Item" ADD FOREIGN KEY ("id_reserva") REFERENCES "Reserva" ("id");
ALTER TABLE "Reserva_Item" ADD FOREIGN KEY ("id_fornecedor_servico") REFERENCES "Fornecedor_Servico" ("id");


ALTER TABLE "Itinerario" ADD FOREIGN KEY ("id_municipio") REFERENCES "Municipio" ("id");

ALTER TABLE "Itinerario" ADD FOREIGN KEY ("id_reserva", "id_fornecedor_servico") REFERENCES "Reserva_Item" ("id_reserva", "id_fornecedor_servico");


ALTER TABLE "Reserva_Item" ADD COLUMN "gerado_pelo_pacote" BOOLEAN DEFAULT FALSE;
-- Início: 002_funcao.up.sql
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
-- Início: 003_constraint.up.sql
ALTER TABLE "Itinerario" 
    ADD CONSTRAINT "chk_data_hora" 
        CHECK (fn_validar_periodo("data_hora_inicio_utc", "data_hora_fim_utc"));

ALTER TABLE "Reserva"
    ADD CONSTRAINT "chk_data" 
        CHECK (fn_validar_periodo("data_inicio_viagem_utc","data_fim_viagem_utc"));
-- Início: 004_trigger.up.sql
CREATE OR REPLACE TRIGGER tg_atualiza_data_atualizacao_servico
BEFORE UPDATE ON "Servico"
FOR EACH ROW
EXECUTE FUNCTION fn_atualiza_data_atualizacao();


CREATE OR REPLACE TRIGGER tg_atualiza_data_atualizacao_fornecedor_servico
BEFORE UPDATE ON "Fornecedor_Servico"
FOR EACH ROW
EXECUTE FUNCTION fn_atualiza_data_atualizacao();


CREATE OR REPLACE TRIGGER tg_verificar_papel_tipo_pessoa
BEFORE UPDATE OR INSERT ON "Pessoa_Papel"
FOR EACH ROW
EXECUTE FUNCTION fn_validar_papel_pessoa();


CREATE TRIGGER tg_copiar_itens_pacote_reserva
AFTER INSERT OR UPDATE OF "id_pacote" ON "Reserva"
FOR EACH ROW
EXECUTE FUNCTION fn_copiar_itens_pacote_para_reserva();


CREATE OR REPLACE TRIGGER tg_remover_itens_pacote_reserva
AFTER UPDATE ON "Reserva"
FOR EACH ROW
WHEN (NEW."id_pacote" IS NULL)
EXECUTE FUNCTION fn_remover_itens_pacote_da_reserva();


CREATE OR REPLACE TRIGGER tg_atualizar_total_reserva
AFTER UPDATE OR INSERT OR DELETE ON "Reserva_Item"
FOR EACH ROW
EXECUTE FUNCTION fn_atualizar_total_reserva();


CREATE TRIGGER trg_check_pessoa_fisica
BEFORE INSERT OR UPDATE ON "Pessoa_Fisica"
FOR EACH ROW EXECUTE FUNCTION check_pessoa_fisica_tipo();

CREATE TRIGGER trg_check_pessoa_juridica
BEFORE INSERT OR UPDATE ON "Pessoa_Juridica"
FOR EACH ROW EXECUTE FUNCTION check_pessoa_juridica_tipo();


CREATE TRIGGER trg_validar_pagamento_pago
BEFORE INSERT OR UPDATE ON "Pagamento"
FOR EACH ROW EXECUTE FUNCTION fn_validar_pagamento_pago();


CREATE TRIGGER trg_validar_status_reserva
BEFORE INSERT ON "Pagamento"
FOR EACH ROW EXECUTE FUNCTION fn_validar_status_reserva_pagamento();


CREATE TRIGGER trg_check_insert_reserva_item
BEFORE INSERT ON "Reserva_Item"
FOR EACH ROW
EXECUTE FUNCTION fn_check_insert_reserva_item();


CREATE TRIGGER trg_check_insert_itinerario
BEFORE INSERT ON "Itinerario"
FOR EACH ROW
EXECUTE FUNCTION fn_check_insert_itinerario();


CREATE TRIGGER trg_reserva_confirmada
AFTER UPDATE OF status ON "Reserva"
FOR EACH ROW
WHEN (NEW.status = 'CONFIRMADA')
EXECUTE FUNCTION fn_reserva_confirmada();


CREATE TRIGGER trg_reserva_cancelada
AFTER UPDATE OF status ON "Reserva"
FOR EACH ROW
WHEN (NEW.status = 'CANCELADA')
EXECUTE FUNCTION fn_reserva_cancelada();


CREATE TRIGGER trg_reserva_concluida
AFTER UPDATE OF status ON "Reserva"
FOR EACH ROW
WHEN (NEW.status = 'CONCLUIDA')
EXECUTE FUNCTION fn_reserva_concluida();


CREATE TRIGGER trg_check_update_itinerario
BEFORE UPDATE OF status ON "Itinerario"
FOR EACH ROW
EXECUTE FUNCTION fn_check_update_itinerario();
-- Início: 005_view.up.sql
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


CREATE OR REPLACE VIEW vw_relatorio_itinerario_completo AS
SELECT 
    i."id" AS itinerario_id,
    r."id" AS reserva_id,
    i."id_fornecedor_servico" AS id_fornecedor_servico,
    i."id_municipio" AS id_municipio,
    p."nome" AS nome_cliente,
    s."nome_oficial" AS nome_servico,
    m."nome" AS nome_municipio,
    i."ordem_passo",
    i."voucher_codigo",
    i."data_hora_inicio_utc",
    i."data_hora_fim_utc",
    i."tipo_evento",
    i."descricao_evento",
    i."status" AS status_itinerario
FROM "Itinerario" i
JOIN "Reserva" r ON i."id_reserva" = r."id"
JOIN "Pessoa" p ON r."id_cliente" = p."id"
JOIN "Reserva_Item" ri ON i."id_reserva" = ri."id_reserva" 
                      AND i."id_fornecedor_servico" = ri."id_fornecedor_servico"
JOIN "Fornecedor_Servico" fs ON ri."id_fornecedor_servico" = fs."id"
JOIN "Servico" s ON fs."id_servico" = s."id"
JOIN "Municipio" m ON i."id_municipio" = m."id";

CREATE OR REPLACE VIEW vw_pacotes_mais_reservados AS
SELECT 
    pa."id" AS pacote_id,
    pa."nome" AS nome_pacote,
    COUNT(r."id") AS total_reservas,
    SUM(r."preco_total") AS receita_total_gerada
FROM "Pacote" pa
JOIN "Reserva" r ON r."id_pacote" = pa."id"
WHERE r."status" NOT IN ('CANCELADA', 'RASCUNHO') 
GROUP BY pa."id", pa."nome"
ORDER BY total_reservas DESC;
-- Início: 006_procedure.up.sql
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
-- Início: 007_conexao_externa.up.sql
ALTER TABLE "Fornecedor_Servico" ADD COLUMN "provedor_nome" VARCHAR(50); -- ex: 'BOOKING_API', 'SABRE_V_API', 'PROPRIO'
ALTER TABLE "Fornecedor_Servico" ADD COLUMN "codigo_id_externo" VARCHAR(255); -- ex: 'hotel_xyz_7761'


ALTER TABLE "Reserva" ADD COLUMN "orcamento" DECIMAL(13,4);
-- Início: 008_melhorias.up.sql
ALTER TABLE "Servico" 
    ALTER COLUMN "nome_oficial" SET NOT NULL,
    ALTER COLUMN "id_municipio" SET NOT NULL,
    ALTER COLUMN "id_tipo" SET NOT NULL;


ALTER TABLE "Tipo_Servico"
    ALTER COLUMN "nome_tipo" SET NOT NULL;


ALTER TABLE "Reserva_Item"
    ADD CONSTRAINT "chk_lucro_positivo" CHECK ("preco_venda" >= "custo_fornecedor"),
    ADD CONSTRAINT "chk_preco_venda_positivo" CHECK ("preco_venda" >= 0),
    ADD CONSTRAINT "chk_custo_fornecedor_positivo" CHECK ("custo_fornecedor" >= 0);

ALTER TABLE "Reserva"
    ADD CONSTRAINT "chk_preco_totoal_positivo"
    CHECK ("preco_total" >= 0); 

ALTER TABLE "Pagamento"
    ADD CONSTRAINT "chk_valor_positivo" 
    CHECK ("valor" >= 0);


ALTER TABLE "Pagamento"
    ALTER COLUMN "id_reserva" SET NOT NULL;


ALTER TABLE "Pagamento" 
    ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY;



-- Indices importantes de acordo com as consultas mais frequentes

CREATE INDEX idx_pagamento_id_reserva ON "Pagamento" ("id_reserva");
CREATE INDEX idx_reserva_id_cliente ON "Reserva" ("id_cliente");
CREATE INDEX idx_itinerario_reserva ON "Itinerario" ("id_reserva");
CREATE INDEX idx_itinerario_status ON "Itinerario" ("status");
CREATE INDEX idx_servico_municipio ON "Servico" ("id_municipio");
CREATE INDEX idx_servico_tipo ON "Servico" ("id_tipo");
CREATE INDEX idx_reserva_item_reserva ON "Reserva_Item" ("id_reserva");
CREATE INDEX idx_fornecedor_servico_pessoa ON "Fornecedor_Servico" ("id_pessoa");


-- Tabela de Auditoria genérica

CREATE TABLE "Log_Auditoria" (
  "id" BIGSERIAL PRIMARY KEY,
  "nome_tabela" VARCHAR(100) NOT NULL,
  "operacao" CHAR(6) NOT NULL CHECK ("operacao" IN ('INSERT', 'UPDATE', 'DELETE')),
  "dados_antigos" JSONB,
  "dados_novos" JSONB,
  "usuario_db" VARCHAR(100) DEFAULT CURRENT_USER,
  -- "usuario_sistema_id" INT, 
  "data_hora" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX "idx_log_auditoria_tabela" ON "Log_Auditoria" ("nome_tabela");
CREATE INDEX "idx_log_auditoria_data" ON "Log_Auditoria" ("data_hora");
CREATE INDEX "idx_log_auditoria_dados_novos" ON "Log_Auditoria" USING gin ("dados_novos");

CREATE OR REPLACE FUNCTION fn_log_auditoria()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO "Log_Auditoria" ("nome_tabela", "operacao", "dados_antigos")
        VALUES (TG_TABLE_NAME, 'DELETE', to_jsonb(OLD));
        RETURN OLD;
        
    ELSIF (TG_OP = 'UPDATE') THEN
        IF (to_jsonb(OLD) = to_jsonb(NEW)) THEN
            RETURN NEW;
        END IF;

        INSERT INTO "Log_Auditoria" ("nome_tabela", "operacao", "dados_antigos", "dados_novos")
        VALUES (TG_TABLE_NAME, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
        
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO "Log_Auditoria" ("nome_tabela", "operacao", "dados_novos")
        VALUES (TG_TABLE_NAME, 'INSERT', to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER trg_auditoria_reserva
AFTER INSERT OR UPDATE OR DELETE ON "Reserva"
FOR EACH ROW EXECUTE FUNCTION fn_log_auditoria();


CREATE TRIGGER trg_auditoria_pagamento
AFTER INSERT OR UPDATE OR DELETE ON "Pagamento"
FOR EACH ROW EXECUTE FUNCTION fn_log_auditoria();


ALTER TABLE "Itinerario" 
DROP CONSTRAINT "Itinerario_id_reserva_id_fornecedor_servico_fkey",
ADD CONSTRAINT "Itinerario_id_reserva_id_fornecedor_servico_fkey"
    FOREIGN KEY ("id_reserva", "id_fornecedor_servico") 
    REFERENCES "Reserva_Item" ("id_reserva", "id_fornecedor_servico")
    ON DELETE CASCADE;
