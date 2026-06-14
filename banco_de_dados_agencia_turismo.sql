DROP TYPE IF EXISTS tipo_status_pessoa CASCADE; 
DROP TYPE IF EXISTS tipo_status_pacote CASCADE; 
DROP TYPE IF EXISTS tipo_status_reserva CASCADE; 
DROP TYPE IF EXISTS tipo_status_pagamento CASCADE; 
DROP TYPE IF EXISTS tipo_status_fornecedor_servico CASCADE; 
DROP TYPE IF EXISTS tipo_status_itinerario CASCADE; 
DROP TYPE IF EXISTS tipo_status_servico CASCADE; 
DROP TYPE IF EXISTS tipo_status_reserva_item CASCADE; 

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
  'PENDENTE', -- significado semantico de pendente é quando esperamos os vouchers serem efetuados
  'CONCLUIDA',
  'EM_ATRASO'
);
CREATE TYPE tipo_status_pagamento AS ENUM (
  'PAGO', 
  'PENDENTE', 
  'VENCIDO'
);
CREATE TYPE tipo_status_fornecedor_servico AS ENUM (
  'DISPONIVEL',
  'PAUSADO',
  'ENCERRADA',
  'CANCELADA'
);
CREATE TYPE tipo_status_itinerario AS ENUM (
  'RASCUNHO',
  'AGENDADO',
  'EM_ANDAMENTO',
  'CONCLUIDO',
  'SUSPENSO',
  'CANCELADO'
);
CREATE TYPE tipo_status_servico AS ENUM (
  'ATIVO',
  'INATIVO',
  'MANUTENCAO',
  'INTERDITADO',
  'EM_ANALISE'
);

DROP TABLE IF EXISTS "Passageiro" CASCADE;
DROP TABLE IF EXISTS "Itinerario" CASCADE;
DROP TABLE IF EXISTS "Pagamento" CASCADE;
DROP TABLE IF EXISTS "Reserva_Item" CASCADE;
DROP TABLE IF EXISTS "Reserva" CASCADE;
DROP TABLE IF EXISTS "Pacote_Item" CASCADE;
DROP TABLE IF EXISTS "Pacote" CASCADE;
DROP TABLE IF EXISTS "Fornecedor_Servico" CASCADE;
DROP TABLE IF EXISTS "Servico" CASCADE;
DROP TABLE IF EXISTS "Tipo_Servico" CASCADE;
DROP TABLE IF EXISTS "Municipio" CASCADE;
DROP TABLE IF EXISTS "Estado" CASCADE;
DROP TABLE IF EXISTS "Pais" CASCADE;
DROP TABLE IF EXISTS "Pessoa_Juridica" CASCADE;
DROP TABLE IF EXISTS "Pessoa_Fisica" CASCADE;
DROP TABLE IF EXISTS "Pessoa_Papel" CASCADE;
DROP TABLE IF EXISTS "Tipo_Pessoa_Papel" CASCADE;
DROP TABLE IF EXISTS "Papel" CASCADE;
DROP TABLE IF EXISTS "Pessoa" CASCADE;

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

  CONSTRAINT "pk_pessoa_papel" PRIMARY KEY ("id_pessoa", "id_papel")
);

CREATE TABLE "Pessoa_Fisica" (
  "id_pessoa" INT,
  "cpf" CHAR(11),
  "data_nascimento" DATE,

  CONSTRAINT "pk_pessoa_fisica" PRIMARY KEY ("id_pessoa")
);

CREATE TABLE "Pessoa_Juridica" (
  "id_pessoa" INT,
  "razao_social" VARCHAR(255),
  "cnpj" CHAR(14),

  CONSTRAINT "pk_pessoa_juridica" PRIMARY KEY ("id_pessoa")
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
  "status" tipo_status_servico DEFAULT 'EM_ANALISE',
  "id_tipo" INT,

  CONSTRAINT "pk_servico" PRIMARY KEY ("id")
);

CREATE TABLE "Fornecedor_Servico" (
  "id" SERIAL,
  "id_pessoa" INT NOT NULL,
  "id_servico" INT NOT NULL,
  "titulo_comercial" VARCHAR(256),
  "status" tipo_status_fornecedor_servico DEFAULT 'DISPONIVEL',
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
  "id_cliente" INT,
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

CREATE TABLE "Passageiro" (
  "id_reserva" INT,
  "id_pessoa" INT,
  "documento_viagem" TEXT,
  CONSTRAINT "pk_passageiro" PRIMARY KEY ("id_reserva", "id_pessoa")
);

CREATE INDEX ON "Itinerario" ("id_reserva", "id_fornecedor_servico");

/*
* CONSTRAINTS DE INTEGRIDADE REFERENCIAL 
*/

ALTER TABLE "Pessoa_Fisica" ADD FOREIGN KEY ("id_pessoa") REFERENCES "Pessoa" ("id");
ALTER TABLE "Pessoa_Juridica" ADD FOREIGN KEY ("id_pessoa") REFERENCES "Pessoa" ("id");


ALTER TABLE "Pessoa_Papel" ADD FOREIGN KEY ("id_papel") REFERENCES "Papel" ("id");
ALTER TABLE "Pessoa_Papel" ADD FOREIGN KEY ("id_pessoa") REFERENCES "Pessoa" ("id");

ALTER TABLE "Servico" ADD FOREIGN KEY ("id_municipio") REFERENCES "Municipio" ("id");
ALTER TABLE "Servico" ADD FOREIGN KEY ("id_tipo") REFERENCES "Tipo_Servico" ("id");


ALTER TABLE "Fornecedor_Servico" ADD FOREIGN KEY ("id_pessoa") REFERENCES "Pessoa" ("id");
ALTER TABLE "Fornecedor_Servico" ADD FOREIGN KEY ("id_servico") REFERENCES "Servico" ("id");

ALTER TABLE "Pacote_Item" ADD FOREIGN KEY ("id_fornecedor_servico") REFERENCES "Fornecedor_Servico" ("id");
ALTER TABLE "Pacote_Item" ADD FOREIGN KEY ("id_pacote") REFERENCES "Pacote" ("id");


ALTER TABLE "Reserva" ADD FOREIGN KEY ("id_pacote") REFERENCES "Pacote" ("id");
ALTER TABLE "Reserva" ADD FOREIGN KEY ("id_cliente") REFERENCES "Pessoa" ("id");
ALTER TABLE "Pagamento" ADD FOREIGN KEY ("id_reserva") REFERENCES "Reserva" ("id");

ALTER TABLE "Reserva_Item" ADD FOREIGN KEY ("id_reserva") REFERENCES "Reserva" ("id");
ALTER TABLE "Reserva_Item" ADD FOREIGN KEY ("id_fornecedor_servico") REFERENCES "Fornecedor_Servico" ("id");


ALTER TABLE "Passageiro" ADD FOREIGN KEY ("id_pessoa") REFERENCES "Pessoa" ("id");
ALTER TABLE "Passageiro" ADD FOREIGN KEY ("id_reserva") REFERENCES "Reserva" ("id");
ALTER TABLE "Itinerario" ADD FOREIGN KEY ("id_municipio") REFERENCES "Municipio" ("id");

ALTER TABLE "Itinerario" ADD FOREIGN KEY ("id_reserva", "id_fornecedor_servico") REFERENCES "Reserva_Item" ("id_reserva", "id_fornecedor_servico");

ALTER TABLE "Pessoa" ADD COLUMN "tipo_pessoa" CHAR(1) NOT NULL CHECK ("tipo_pessoa" IN ('F', 'J'));
ALTER TABLE "Pessoa" ADD CONSTRAINT "id_tipo_pessoa_unique" UNIQUE ("id", "tipo_pessoa");


ALTER TABLE "Pessoa_Fisica" ADD COLUMN "tipo_pessoa" CHAR(1) DEFAULT 'F' NOT NULL CHECK ("tipo_pessoa" = 'F');
ALTER TABLE "Pessoa_Fisica" ADD CONSTRAINT "fk_pessoa_fisica" 
  FOREIGN KEY ("id_pessoa", "tipo_pessoa") REFERENCES "Pessoa" ("id", "tipo_pessoa");


ALTER TABLE "Pessoa_Juridica" ADD COLUMN "tipo_pessoa" CHAR(1) DEFAULT 'J' NOT NULL CHECK ("tipo_pessoa" = 'J');
ALTER TABLE "Pessoa_Juridica" ADD CONSTRAINT "fk_pessoa_juridica" 
  FOREIGN KEY ("id_pessoa", "tipo_pessoa") REFERENCES "Pessoa" ("id", "tipo_pessoa");

ALTER TABLE "Passageiro" ADD CONSTRAINT "fk_passageiro_pessoa_fisica"
  FOREIGN KEY ("id_pessoa") REFERENCES "Pessoa_Fisica" ("id_pessoa");


ALTER TABLE "Reserva_Item" ADD COLUMN "gerado_pelo_pacote" BOOLEAN DEFAULT FALSE;


ALTER TABLE "Reserva_Item"
ADD COLUMN "percentual_desconto_venda" NUMERIC(5,2) DEFAULT 0;


-- ==========================================
-- 1. FUNÇÕES DE NEGÓCIO
-- ==========================================

-- Controle Financeiro e Status da Reserva
DROP FUNCTION IF EXISTS fn_marcar_reserva_como_concluido_ou_em_atraso() CASCADE;

-- Cálculo de Totais da Reserva (Disparada por itens da reserva)
DROP FUNCTION IF EXISTS fn_atualizar_total_reserva() CASCADE;

-- Gerenciamento de Itens Vinculados a Pacotes
DROP FUNCTION IF EXISTS fn_remover_itens_pacote_da_reserva() CASCADE;
DROP FUNCTION IF EXISTS fn_copiar_itens_pacote_para_reserva() CASCADE;

-- Validação de Regras de Atores/Papéis
DROP FUNCTION IF EXISTS fn_validar_papel_pessoa() CASCADE;


-- ==========================================
-- 2. FUNÇÕES OPERACIONAIS (UTILITÁRIAS)
-- ==========================================

DROP FUNCTION IF EXISTS fn_atualiza_data_atualizacao() CASCADE;

DROP FUNCTION IF EXISTS fn_validar_periodo(anyelement, anyelement) CASCADE;

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

    SELECT "Pessoa"."tipo_pessoa" 
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

ALTER TABLE "Itinerario" DROP CONSTRAINT IF EXISTS "chk_data_hora" ;
ALTER TABLE "Reserva" DROP CONSTRAINT IF EXISTS "chk_data" ;

ALTER TABLE "Itinerario" 
    ADD CONSTRAINT "chk_data_hora" 
        CHECK (fn_validar_periodo("data_hora_inicio_utc", "data_hora_fim_utc"));

ALTER TABLE "Reserva"
    ADD CONSTRAINT "chk_data" 
        CHECK (fn_validar_periodo("data_inicio_viagem_utc","data_fim_viagem_utc"));



-- Gatilhos de atualização de timestamp
DROP TRIGGER IF EXISTS tg_atualiza_data_atualizacao_servico ON "Servico";
DROP TRIGGER IF EXISTS tg_atualiza_data_atualizacao_fornecedor_servico ON "Fornecedor_Servico";

-- Gatilho de validação de papéis
DROP TRIGGER IF EXISTS tg_verificar_papel_tipo_pessoa ON "Pessoa_Papel";

-- Gatilhos de gerenciamento de pacotes na reserva
DROP TRIGGER IF EXISTS tg_copiar_itens_pacote_reserva ON "Reserva";
DROP TRIGGER IF EXISTS tg_remover_itens_pacote_reserva ON "Reserva";

-- Gatilho de cálculo financeiro do total da reserva
DROP TRIGGER IF EXISTS tg_atualizar_total_reserva ON "Reserva_Item";

-- Gatilho de verificação de inadimplência/quitação
DROP TRIGGER IF EXISTS tg_marcar_reserva_como_concluido_ou_em_atraso ON "Pagamento";


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


CREATE OR REPLACE TRIGGER tg_copiar_itens_pacote_reserva
AFTER INSERT ON "Reserva"
FOR EACH ROW
WHEN (NEW."id_pacote" IS NOT NULL)
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


CREATE OR REPLACE TRIGGER tg_marcar_reserva_como_concluido_ou_em_atraso
AFTER UPDATE OR INSERT ON "Pagamento"
FOR EACH ROW
EXECUTE FUNCTION fn_marcar_reserva_como_concluido_ou_em_atraso();


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

