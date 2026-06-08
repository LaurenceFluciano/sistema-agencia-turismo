-- CRM

CREATE TABLE Pessoa (
  id INTEGER PRIMARY KEY,
  nome VARCHAR,
  telefone VARCHAR,
  email VARCHAR,
  data_cadastro TIMESTAMP
);

CREATE TABLE Cliente (
  pessoa_id INTEGER PRIMARY KEY,

  -- Uma pessoa pode ser cadastrada como cliente.
  FOREIGN KEY (pessoa_id) REFERENCES Pessoa(id)
);

CREATE TABLE Fornecedor (
  pessoa_id INTEGER PRIMARY KEY,
  razao_social VARCHAR,
  cnpj VARCHAR,

  -- Uma pessoa pode ser cadastrada como fornecedor.
  FOREIGN KEY (pessoa_id) REFERENCES Pessoa(id)
);

-- Catálogo

CREATE TABLE "Local" (
  id INTEGER PRIMARY KEY,
  nome_ponto VARCHAR,
  estado VARCHAR,
  pais VARCHAR,
  municipio VARCHAR,
  longitude DECIMAL,
  latitude DECIMAL
);

-- Um local pode possuir vários serviços.
CREATE TABLE Servico (
  id INTEGER PRIMARY KEY,
  id_local INTEGER,
  nome VARCHAR,
  tipo VARCHAR,

  FOREIGN KEY (id_local)
    REFERENCES "Local"(id)
);



CREATE TABLE Fornecedor_Oferta (

  -- Um mesmo serviço pode ter variações como:
  -- Serviço: Hotel Copacabana;
  -- Fornecedor: Joao
  -- Primeira Oferta: Por diária
  -- Segundo Orferta: Pacote 3 dias com janta inclusa
  -- Terceira Oferta: Pacote 3 dias
  id INTEGER PRIMARY KEY,
  fornecedor_id INTEGER,
  servico_id INTEGER,

  preco_estimado DECIMAL,
  disponibilidade VARCHAR,
  link_fonte VARCHAR,
  tipo_fonte VARCHAR,
  data_atualizacao TIMESTAMP,
  status VARCHAR,
  descricao TEXT,

  -- Um serviço pode ser ofertado por vários fornecedores.
  FOREIGN KEY (fornecedor_id)
    REFERENCES Fornecedor(pessoa_id),

  FOREIGN KEY (servico_id)
    REFERENCES Servico(id)
);


-- Pacotes

CREATE TABLE Pacote (
  id INTEGER PRIMARY KEY,
  nome VARCHAR,
  data_inicio_viagem_utc TIMESTAMP,
  data_fim_viagem_utc TIMESTAMP,
  vagas_totais INTEGER,
  vagas_disponiveis INTEGER,
  custo_total_estimado DECIMAL,
  preco_venda_padrao DECIMAL,
  status VARCHAR
);

CREATE TABLE Pacote_Item (
  -- A mesma oferta pode aparecer em vários pacotes.
  id INTEGER PRIMARY KEY,
  id_pacote INTEGER,
  id_fornecedor_oferta INTEGER,
  quantidade INTEGER,
  descricao_ou_servico VARCHAR,
 
  -- Um pacote tem vários itens de pacotes
  FOREIGN KEY (id_pacote)
    REFERENCES Pacote(id),

  FOREIGN KEY (id_fornecedor_oferta)
    REFERENCES Fornecedor_Oferta(id)
);


-- Reserva e Financeiro Básico

CREATE TABLE Reserva (
  id INTEGER PRIMARY KEY,
  id_cliente INTEGER,

  -- Uma reserva ela pode ou ser ou não um pacote
  -- Em casos de viagem personalizada, é comum ser serviços avulsos.
  id_pacote INTEGER NULL,

  data_inicio_viagem_utc TIMESTAMP,
  data_fim_viagem_utc TIMESTAMP,

  status VARCHAR,
  preco_total DECIMAL,

  FOREIGN KEY (id_cliente)
    REFERENCES Cliente(pessoa_id),

  FOREIGN KEY (id_pacote)
    REFERENCES Pacote(id)
);

CREATE TABLE Venda (
  id_reserva INTEGER,
  id_fornecedor_oferta INTEGER,

  custo_fornecedor_real DECIMAL,
  preco_venda_cliente DECIMAL,
  
  -- Uma reserva pode possuir várias vendas de ofertas diferentes.
  FOREIGN KEY (id_reserva)
    REFERENCES Reserva(id),

  -- A mesma oferta pode ser vendida várias vezes em reserevas diferentes.
  FOREIGN KEY (id_fornecedor_oferta)
    REFERENCES Fornecedor_Oferta(id),

  -- Uma venda de uma oferta de uma reserva ocorre estritamente uma unica vez.
  PRIMARY KEY (id_reserva, id_fornecedor_oferta)
);

CREATE TABLE Pagamento (
  id INTEGER PRIMARY KEY,
  id_reserva INTEGER,

  valor DECIMAL,
  forma_pagamento VARCHAR,
  status VARCHAR,
  data_pagamento_utc TIMESTAMP,

  FOREIGN KEY (id_reserva)
    REFERENCES Reserva(id)
);


-- Organização da Viagem

CREATE TABLE Itinerario (
  -- Uma venda pode gerar vários eventos de itinerário.
  id_itinerario INTEGER PRIMARY KEY,

  -- Herda a chave composta da tabela Venda
  id_reserva INTEGER,
  id_fornecedor_oferta INTEGER,


  id_local INTEGER,

  data_hora_inicio_utc TIMESTAMP,
  data_hora_fim_utc TIMESTAMP,

  tipo_evento VARCHAR,
  voucher_codigo VARCHAR,

  descricao_itinerario TEXT,
  status VARCHAR,

  -- Um itinerário da viagem esta relacionado com um item da venda.
  FOREIGN KEY (id_reserva, id_fornecedor_oferta)
    REFERENCES Venda(id_reserva, id_fornecedor_oferta),


  -- Um local pode aparecer em vários itinerários.
  -- Local (1) -------- (N) Itinerario
  FOREIGN KEY (id_local)
    REFERENCES "Local"(id)
);

CREATE TABLE Passageiro (
  id INTEGER,
  id_reserva INTEGER,

  nome_pessoa VARCHAR,
  documento_viagem VARCHAR,

  PRIMARY KEY (id_reserva, id),


  -- Um passageiro pertence a uma reserva
  FOREIGN KEY (id_reserva)
    REFERENCES Reserva(id)
);
-- RN > Um passageiro não pode estar em duas reservas em um mesmo dia
