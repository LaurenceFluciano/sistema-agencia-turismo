/*
* Cadastro e Gestão de Contatos/Atores
*/

CREATE TYPE pessoa_tipo AS ENUM ('ativo', 'inativo');
CREATE TYPE pacote_status AS ENUM ('template');
CREATE TYPE tipo_status_reserva AS ENUM ('RASCUNHO', 'CONFIRMADA', 'CANCELADA', 'PENDENTE', 'CONCLUIDA');
CREATE TYPE tipo_pagamento_status AS ENUM ('PAGO', 'PENDENTE', 'VENCIDO');

CREATE TABLE "Pessoa" (
  "id" INT,
  "nome" VARCHAR(255),
  "telefone" VARCHAR(15),
  "email" VARCHAR(320),
  "data_cadastro" TIMESTAMP,
  "status" pessoa_tipo,

  CONSTRAINT "pk_pessoa" PRIMARY KEY ("id")
);

CREATE TABLE "Papel" (
  "id" INT,
  "nome_papel" VARCHAR(50),

  CONSTRAINT "pk_papel" PRIMARY KEY ("id")
);

CREATE TABLE "Pessoa_Papel" (
  "id_pessoa" INT,
  "id_papel" INT,

  CONSTRAINT "pk_pessoa_papel" PRIMARY KEY ("id_pessoa", "id_papel")
);

CREATE TABLE "Pessoa_Fisica" (
  "pessoa_id" INT,
  "cpf" CHAR(11),
  "data_nascimento" DATE,

  CONSTRAINT "pk_pessoa_fisica" PRIMARY KEY ("pessoa_id")
);

CREATE TABLE "Pessoa_Juridica" (
  "pessoa_id" INT,
  "razao_social" VARCHAR(255),
  "cnpj" CHAR(14),

  CONSTRAINT "pk_pessoa_juridica" PRIMARY KEY ("pessoa_id")
);

/*
* Cátalogo
*/

CREATE TABLE "Local" (
  "id" INT,
  "nome_ponto" VARCHAR(255),
  "estado" VARCHAR(255),
  "pais" VARCHAR(255),
  "municipio" VARCHAR(255),

  CONSTRAINT "pk_local" PRIMARY KEY ("id")
);

CREATE TABLE "Tipo_Recurso_Turistico" (
  "id" INT,
  "nome_tipo" VARCHAR(255),

  CONSTRAINT "pk_tipo_recurso_turistico" PRIMARY KEY ("id")
);

CREATE TABLE "Recurso_Turistico" (
  "id" INT,
  "nome_oficial" VARCHAR(255),
  "id_local" INT,
  "data_atualizacao" TIMESTAMP,
  "status" VARCHAR(25),
  "id_tipo" INT,

  CONSTRAINT "pk_recurso_turistico" PRIMARY KEY ("id")
);

CREATE TABLE "Oferta" (
  "id" INT,
  "id_pessoa" INT NOT NULL,
  "id_recurso_turistico" INT NOT NULL,
  "titulo_comercial" VARCHAR(256),
  "preco_base" DECIMAL NOT NULL,
  "moeda" CHAR(3),
  "data_inicio_vigencia" DATE NOT NULL,
  "data_fim_vigencia" DATE NOT NULL,
  "tipo_cobranca" VARCHAR(25),
  "status" VARCHAR(25),
  "vagas_totais" INT,
  "vagas_disponiveis" INT,
  "detalhes" JSONB,
  "data_atualizacao" TIMESTAMP,

  CONSTRAINT "pk_oferta" PRIMARY KEY ("id")
);

/*
* Módulo Pacotes
*/

CREATE TABLE "Pacote" (
  "id" INT,
  "nome" VARCHAR(255),
  "tipo_pacote" VARCHAR(50),
  "status" pacote_status,
  CONSTRAINT "pk_pacote" PRIMARY KEY ("id")
);

CREATE TABLE "Pacote_Item" (
  "id_pacote" INT,
  "id_oferta" INT,
  CONSTRAINT "pk_pacote_item" PRIMARY KEY ("id_pacote", "id_oferta")
);

/* 
* MÓDULO RESERVAS E FINANCEIRO
*/

CREATE TABLE "Reserva" (
  "id" INT,
  "id_cliente" INT,
  "id_pacote" INT,
  "data_inicio_viagem_utc" TIMESTAMP,
  "data_fim_viagem_utc" TIMESTAMP,
  "status" tipo_status_reserva,
  "preco_total" DECIMAL,

  CONSTRAINT "pk_reserva" PRIMARY KEY ("id")
);

CREATE TABLE "Reserva_Item" (
  "id_reserva" INT,
  "id_oferta" INT,
  "custo_fornecedor" DECIMAL,
  "preco_venda" DECIMAL,
  CONSTRAINT "pk_reserva_item" PRIMARY KEY ("id_reserva", "id_oferta")
);

CREATE TABLE "Pagamento" (
  "id" INT PRIMARY KEY,
  "id_reserva" INT,
  "valor" DECIMAL,
  "forma_pagamento" VARCHAR(50),
  "status" tipo_pagamento_status,
  "data_pagamento_utc" TIMESTAMP
);

/*
* MÓDULO ORGANIZAÇÃO VIAGEM
*/

CREATE TABLE "Itinerario" (
  "id" INT,
  "id_reserva" INT NOT NULL,
  "id_oferta" INT NOT NULL,
  "id_local" INT NOT NULL,
  "ordem_passo" INT,
  "voucher_codigo" VARCHAR(255),
  "data_hora_inicio_utc" TIMESTAMP,
  "data_hora_fim_utc" TIMESTAMP,
  "tipo_evento" VARCHAR(255),
  "descricao_evento" TEXT,
  "status" VARCHAR(255),
  CONSTRAINT "pk_itinerario" PRIMARY KEY ("id")
);

CREATE TABLE "Passageiro" (
  "id_reserva" INT,
  "id_pessoa" INT,
  "documento_viagem" TEXT,
  CONSTRAINT "pk_passageiro" PRIMARY KEY ("id_reserva", "id_pessoa")
);

CREATE INDEX ON "Itinerario" ("id_reserva", "id_oferta");

/*
* CONSTRAINTS DE INTEGRIDADE REFERENCIAL 
*/

ALTER TABLE "Pessoa_Fisica" ADD FOREIGN KEY ("pessoa_id") REFERENCES "Pessoa" ("id");
ALTER TABLE "Pessoa_Juridica" ADD FOREIGN KEY ("pessoa_id") REFERENCES "Pessoa" ("id");


ALTER TABLE "Pessoa_Papel" ADD FOREIGN KEY ("id_papel") REFERENCES "Papel" ("id");
ALTER TABLE "Pessoa_Papel" ADD FOREIGN KEY ("id_pessoa") REFERENCES "Pessoa" ("id");

ALTER TABLE "Recurso_Turistico" ADD FOREIGN KEY ("id_local") REFERENCES "Local" ("id");
ALTER TABLE "Recurso_Turistico" ADD FOREIGN KEY ("id_tipo") REFERENCES "Tipo_Recurso_Turistico" ("id");


ALTER TABLE "Oferta" ADD FOREIGN KEY ("id_pessoa") REFERENCES "Pessoa" ("id");
ALTER TABLE "Oferta" ADD FOREIGN KEY ("id_recurso_turistico") REFERENCES "Recurso_Turistico" ("id");


ALTER TABLE "Pacote_Item" ADD FOREIGN KEY ("id_oferta") REFERENCES "Oferta" ("id");
ALTER TABLE "Pacote_Item" ADD FOREIGN KEY ("id_pacote") REFERENCES "Pacote" ("id");


ALTER TABLE "Reserva" ADD FOREIGN KEY ("id_pacote") REFERENCES "Pacote" ("id");
ALTER TABLE "Reserva" ADD FOREIGN KEY ("id_cliente") REFERENCES "Pessoa" ("id");
ALTER TABLE "Pagamento" ADD FOREIGN KEY ("id_reserva") REFERENCES "Reserva" ("id");


ALTER TABLE "Reserva_Item" ADD FOREIGN KEY ("id_reserva") REFERENCES "Reserva" ("id");
ALTER TABLE "Reserva_Item" ADD FOREIGN KEY ("id_oferta") REFERENCES "Oferta" ("id");


ALTER TABLE "Passageiro" ADD FOREIGN KEY ("id_pessoa") REFERENCES "Pessoa" ("id");
ALTER TABLE "Passageiro" ADD FOREIGN KEY ("id_reserva") REFERENCES "Reserva" ("id");
ALTER TABLE "Itinerario" ADD FOREIGN KEY ("id_local") REFERENCES "Local" ("id");


ALTER TABLE "Itinerario" ADD FOREIGN KEY ("id_reserva", "id_oferta") REFERENCES "Reserva_Item" ("id_reserva", "id_oferta");
