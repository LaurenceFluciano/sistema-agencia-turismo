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


ALTER TABLE "Passageiro" ADD FOREIGN KEY ("id_pessoa") REFERENCES "Pessoa" ("id");
ALTER TABLE "Passageiro" ADD FOREIGN KEY ("id_reserva") REFERENCES "Reserva" ("id");
ALTER TABLE "Itinerario" ADD FOREIGN KEY ("id_municipio") REFERENCES "Municipio" ("id");

ALTER TABLE "Itinerario" ADD FOREIGN KEY ("id_reserva", "id_fornecedor_servico") REFERENCES "Reserva_Item" ("id_reserva", "id_fornecedor_servico");

ALTER TABLE "Passageiro" ADD CONSTRAINT "fk_passageiro_pessoa_fisica"
  FOREIGN KEY ("id_pessoa") REFERENCES "Pessoa_Fisica" ("id_pessoa");


ALTER TABLE "Reserva_Item" ADD COLUMN "gerado_pelo_pacote" BOOLEAN DEFAULT FALSE;