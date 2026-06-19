
INSERT INTO "Papel" ("nome_papel") 
VALUES  ('Cliente'),
        ('Fornecedor'),
        ('Empresa');


/*
Os recursos turísticos são classificados seguindo padrões 
internacionais (como os da Organização Mundial do Turismo - OMT) e 
nacionais (como o do Ministério do Turismo no Brasil). 
*/
INSERT INTO "Tipo_Servico" ("nome_tipo") 
VALUES  ('Natural'),
        ('Cultural'),
        ('Entretenimento'),
        ('Transporte'),
        ('Hospedagem'),
        ('Suporte'),
        ('Alimentacao');
-- OBS:
-- Para fins didáticos e para manter a modelagem compatível com
-- o escopo da disciplina de Banco de Dados II, transporte,
-- hospedagem e alimentação foram tratados como recursos turísticos.
--
-- Em uma modelagem mais especializada do domínio turístico,
-- esses elementos poderiam ser separados em categorias próprias
-- de serviços de apoio à viagem, distintas dos atrativos turísticos.


INSERT INTO "Tipo_Pessoa_Papel" ("tipo_pessoa", "id_papel")
VALUES  ('F',1),
        ('F',2),
        ('J',1),
        ('J',2),
        ('J',3);



TRUNCATE TABLE
  "Pessoa_Papel", "Pessoa_Fisica", "Pessoa_Juridica", "Pessoa"
CASCADE;

INSERT INTO "Pessoa" (
    "nome",
    "telefone",
    "email",
    "tipo_pessoa"
) VALUES
('Joao Luciano', '48999990001', 'joaoluciano@unisatc.com', 'F'),
('Ana Silva', '48999990002', 'ana@email.com', 'F'),
('Bruno Souza', '48999990003', 'bruno@email.com', 'F'),
('Carla Costa', '48999990004', 'carla@email.com', 'F'),
('Diego Santos', '48999990005', 'diego@email.com', 'F'),
('Elena Ribeiro', '48999990006', 'elena@email.com', 'F'),
('Fabio Lima', '48999990007', 'fabio@email.com', 'F'),
('Gisele Almeida', '48999990008', 'gisele@email.com', 'F'),
('Heitor Peres', '48999990009', 'heitor@email.com', 'F'),
( 'Igor Nunes', '48999990010', 'igor@email.com', 'F');

INSERT INTO "Pessoa"(
    "nome",
    "telefone",
    "email",
    "tipo_pessoa"
) VALUES 
('Copacabana Consolidadora', '1133330001', 'contato@copacabana.com.br', 'J'),
('Jequitibá Distribuição',   '2133330002', 'comercial@jequitiba.com.br', 'J'),
('Pocahontas Distribuição',  '3133330003', 'reservas@pocahontas.com.br', 'J'),
('Lauro Müller Hotelaria',   '4833330004', 'gerencia@lauromuller.com.br', 'J'),
('Dionisio Consolidadora',   '5133330005', 'diretoria@dionisio.com.br', 'J');

INSERT INTO "Pessoa_Fisica" (
    "id_pessoa"
) VALUES 
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10);

INSERT INTO "Pessoa_Juridica" (
    "id_pessoa",
    "razao_social",
    "cnpj"
) VALUES 
(11, 'Copacabana Consolidadora de Turismo LTDA', '62586183000126' ),
(12, 'Jequitiba Distribuição de Serviços de Turismo LTDA', '04254475000165' ),
(13, 'Pocahontas Distribuição de Serviços de Turismo LTDA', '83343069000145' ),
(14, 'Lauro Müller Serviços de Hotelaria LTDA', '13390775000162' ),
(15, 'Dionisio Consolidadora de Turismo LTDA', '91842082000177' );

INSERT INTO "Pessoa_Papel" (
    "id_pessoa",
    "id_papel"
) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(4, 2),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 2),
(11, 2),
(12, 2),
(13, 2),
(14, 2),
(15, 2);


INSERT INTO "Pais" ("nome") VALUES ('Brasil');

INSERT INTO "Estado" ("id_pais", "nome", "sigla") VALUES
(1, 'Santa Catarina', 'SC'),
(1, 'Rio de Janeiro', 'RJ'),
(1, 'Pernambuco', 'PE'),
(1, 'Paraná', 'PR'),
(1, 'Goiás', 'GO');

INSERT INTO "Municipio" ("id_estado", "nome") VALUES
(1, 'Lauro Müller'),
(2, 'Rio de Janeiro'),
(3, 'Recife'),
(4, 'Foz do Iguaçu'),
(5, 'Goiânia');

INSERT INTO "Servico" (
    "id_municipio",
    "nome_oficial",
    "id_tipo",
    "status"
)
VALUES
    (1, 'Hotel Rio do Rastro', 5, 'ATIVO'),
    (1, 'Hotel Rio Rocinha', 5, 'ATIVO'),
    (1, 'Hotelaria Casa do Felipe', 5, 'ATIVO'),
    (1, 'Hostel Rio da vaca', 5, 'ATIVO'),
    (1, 'Hotel morro da palha', 5, 'ATIVO'),
    (2, 'Hotel Receba', 5, 'ATIVO'),
    (1, 'Hotel Trivago', 5, 'ATIVO'),
    (5, 'hotel Mariana', 5, 'ATIVO'),
    (4, 'Hotel Leeroy Jenkins', 5, 'ATIVO'),
    (3, 'Hotel Wano', 5, 'ATIVO'),
    (2, 'Joseph Joestar Companhias aereas', 4, 'ATIVO'),
    (1, 'Bom Voo Companhias aereas', 4, 'ATIVO'),
    (1, 'Paranagua Companhias aereas', 4, 'ATIVO'),
    (3, 'Seriguela Companhias aereas', 4, 'ATIVO'),
    (3, 'Opamecano Companhias aereas', 4, 'ATIVO'),
    (4, 'Vá Rápido Translados', 4, 'ATIVO'),
    (2, 'Auto Locadora Roda Presa', 4, 'ATIVO'),
    (5, 'SafeTrip Seguros de Viagem', 6, 'ATIVO'),
    (1, 'Money Câmbio e Moedas', 6, 'ATIVO'),
    (3, 'Guias Nativos da Região', 6, 'ATIVO'),
    (1, 'Lounge VIP Relax Aeroporto', 6, 'ATIVO'),
    (4, 'Visto Sem Estresse Assessoria', 6, 'ATIVO'),
    (2, 'Mundo Conectado Telecom', 6, 'ATIVO'),
    (5, 'SafeBox Guarda-Volumes', 6, 'ATIVO'),
    (3, 'Brisa do Mar Locadora de Barcos', 6, 'ATIVO'),
    (1, 'Mirante da Serra do Rio do Rastro', 1, 'ATIVO'),
    (2, 'Forte de Copacabana', 2, 'ATIVO'),
    (3, 'Parque das Esculturas', 2, 'ATIVO'),
    (4, 'Parque das Aves', 2, 'ATIVO'),
    (5, 'Museu Zoroastro Artiaga', 2, 'ATIVO'),
    (1, 'Churrascaria Tropeiro', 7, 'ATIVO'),
    (1, 'Café da Montanha', 7, 'ATIVO'),
    (1, 'Bistrô Lauro Müller', 7, 'ATIVO'),
    (1, 'Pizzaria da Serra', 7, 'ATIVO'),
    (2, 'Churrascaria Palace', 7, 'ATIVO'),
    (2, 'Boteco Belmonte Copacabana', 7, 'ATIVO'),
    (2, 'La Trattoria', 7, 'ATIVO'),
    (2, 'Restaurante Cervantes', 7, 'ATIVO'),
    (3, 'Parraxaxá', 7, 'ATIVO'),
    (3, 'Restaurante Leite', 7, 'ATIVO'),
    (3, 'Seu Boteco Marco Zero', 7, 'ATIVO'),
    (3, 'Bistrô do Cais', 7, 'ATIVO'),
    (4, 'Restaurante Porto Canoas', 7, 'ATIVO'),
    (4, 'Rafain Churrascaria Show', 7, 'ATIVO'),
    (4, 'Cabeça de Boi', 7, 'ATIVO'),
    (4, 'Churrascaria do Gaúcho', 7, 'ATIVO'),
    (5, 'Chão Nativo', 7, 'ATIVO'),
    (5, 'Restaurante Piquiras', 7, 'ATIVO'),
    (5, 'Carne de Sol 1008', 7, 'ATIVO'),
    (5, 'Panelinha Grill', 7, 'ATIVO');


INSERT INTO "Fornecedor_Servico" (
    "id_pessoa",
    "id_servico",
    "titulo_comercial",
    "status"
) VALUES

-- HOTÉIS (JEQUITIBÁ)
(12, 1, 'Hospedagem Serra Premium', 'ATIVO'),
(12, 2, 'Pacote Hotel Rio Rocinha', 'ATIVO'),
(12, 3, 'Fim de Semana Casa do Felipe', 'ATIVO'),
(12, 4, 'Hostel Econômico Serra', 'ATIVO'),
(12, 5, 'Pacote Morro da Palha', 'ATIVO'),
(12, 6, 'Hospedagem Hotel Receba', 'ATIVO'),
(12, 7, 'Hotel Trivago Executivo', 'ATIVO'),

-- HOTÉIS PREMIUM (LAURO MÜLLER HOTELARIA)
(14, 8, 'Hotel Mariana Premium', 'ATIVO'),
(14, 9, 'Pacote Leeroy Jenkins Resort', 'ATIVO'),
(14, 10, 'Experiência Hotel Wano', 'ATIVO'),

-- COMPANHIAS AÉREAS (POCAHONTAS)
(13, 11, 'Passagem Joseph Joestar', 'ATIVO'),
(13, 12, 'Passagem Bom Voo', 'ATIVO'),
(13, 13, 'Passagem Paranaguá', 'ATIVO'),
(13, 14, 'Passagem Seriguela', 'ATIVO'),
(13, 15, 'Passagem Opamecano', 'ATIVO'),

-- TRANSPORTE E LOCAÇÃO
(13, 16, 'Transfer Vá Rápido', 'ATIVO'),
(13, 17, 'Locação Roda Presa', 'ATIVO'),

-- SERVIÇOS DE APOIO (DIONISIO)
(15, 18, 'Seguro Viagem SafeTrip', 'ATIVO'),
(15, 19, 'Câmbio Money', 'ATIVO'),
(15, 20, 'Guia Regional Especializado', 'ATIVO'),
(15, 21, 'Acesso Lounge VIP', 'ATIVO'),
(15, 22, 'Assessoria para Vistos', 'ATIVO'),
(15, 23, 'Chip Internacional', 'ATIVO'),
(15, 24, 'Guarda Volumes SafeBox', 'ATIVO'),
(15, 25, 'Passeio Náutico Exclusivo', 'ATIVO'),

-- ATRAÇÕES TURÍSTICAS (COPACABANA)
(11, 26, 'Excursão Serra do Rio do Rastro', 'ATIVO'),
(11, 27, 'Tour Forte de Copacabana', 'ATIVO'),
(11, 28, 'Visita Parque das Esculturas', 'ATIVO'),
(11, 29, 'Passeio Parque das Aves', 'ATIVO'),
(11, 30, 'Tour Museu Zoroastro Artiaga', 'ATIVO'),

-- RESTAURANTES (COPACABANA)
(11, 31, 'Jantar Churrascaria Tropeiro', 'ATIVO'),
(11, 32, 'Café Colonial da Montanha', 'ATIVO'),
(11, 33, 'Experiência Bistrô Lauro Müller', 'ATIVO'),
(11, 34, 'Rodízio Pizzaria da Serra', 'ATIVO'),
(11, 35, 'Jantar Churrascaria Palace', 'ATIVO'),
(11, 36, 'Happy Hour Belmonte', 'ATIVO'),
(11, 37, 'Jantar Italiano La Trattoria', 'ATIVO'),
(11, 38, 'Experiência Cervantes', 'ATIVO'),
(11, 39, 'Almoço Regional Parraxaxá', 'ATIVO'),
(11, 40, 'Jantar Tradicional Restaurante Leite', 'ATIVO'),
(11, 41, 'Boteco Marco Zero', 'ATIVO'),
(11, 42, 'Bistrô do Cais Premium', 'ATIVO'),
(11, 43, 'Almoço Porto Canoas', 'ATIVO'),
(11, 44, 'Show Rafain Churrascaria', 'ATIVO'),
(11, 45, 'Jantar Cabeça de Boi', 'ATIVO'),
(11, 46, 'Churrascaria do Gaúcho', 'ATIVO'),
(11, 47, 'Experiência Chão Nativo', 'ATIVO'),
(11, 48, 'Jantar Restaurante Piquiras', 'ATIVO'),
(11, 49, 'Especial Carne de Sol 1008', 'ATIVO'),
(11, 50, 'Almoço Panelinha Grill', 'ATIVO');


INSERT INTO "Pacote" (
    "nome", 
    "status") 
VALUES
('Expedição Rocinha - Canion da ronda', 'DISPONIVEL'), 
('Aventura nas Cataratas do Iguaçu', 'DISPONIVEL');


INSERT INTO "Pacote_Item" (
    "id_pacote", 
    "id_fornecedor_servico"
)
VALUES
    (2, 12),  -- Passagem Bom Voo
    (2, 9),   -- Pacote Leeroy Jenkins Resort
    (2, 29),  -- Passeio Parque das Aves
    (2, 44);  -- Show Rafain Churrascaria

INSERT INTO "Pacote_Item" (
    "id_pacote", 
    "id_fornecedor_servico"
)
VALUES  
    (1, 2),   -- Pacote Hotel Rio Rocinha
    (1, 16),  -- Transfer Vá Rápido
    (1, 26),  -- Excursão Serra do Rio do Rastro
    (1, 32);  -- Café Colonial da Montanha


DELETE FROM "Reserva_Item";
DELETE FROM "Reserva";
ALTER SEQUENCE "Reserva_id_seq" RESTART WITH 1;


INSERT INTO "Reserva" (
    "id_cliente",
    "id_pacote",
    "data_inicio_viagem_utc",
    "data_fim_viagem_utc",
    "status",
    "preco_total"

) VALUES
    (
        1,1, 
        NOW() + INTERVAL '7 days', 
        NOW() + INTERVAL '8 days',
        'RASCUNHO',
        0
    ),
    (
        2,1, 
        NOW() + INTERVAL '7 days', 
        NOW() + INTERVAL '8 days',
        'RASCUNHO',
        0
    ),
    (
        3,2, 
        NOW() + INTERVAL '10 days', 
        NOW() + INTERVAL '12 days',
        'RASCUNHO',
        0
    );

CALL pd_definir_preco_da_reserva(1,2,800,15);
CALL pd_definir_preco_da_reserva(1,16,450,20);
CALL pd_definir_preco_da_reserva(1,26,600,10);
CALL pd_definir_preco_da_reserva(1,32,90,15);

CALL pd_definir_preco_da_reserva(2,2,1600,15);
CALL pd_definir_preco_da_reserva(2,16,900,20);
CALL pd_definir_preco_da_reserva(2,26,1200,10);
CALL pd_definir_preco_da_reserva(2,32,180,15);

CALL pd_definir_preco_da_reserva(3,12,7536,15);
CALL pd_definir_preco_da_reserva(3,9,3600,15);
CALL pd_definir_preco_da_reserva(3,29,1600,15);
CALL pd_definir_preco_da_reserva(3,44,640,15);

CALL pd_adicionar_passageiro_na_viagem('Maria Hofman', 1);
CALL pd_adicionar_passageiro_na_viagem('Paulo Ricardo', 1);

CALL pd_adicionar_passageiro_na_viagem('Jorge', 2);
CALL pd_adicionar_passageiro_na_viagem('Joao', 2);
CALL pd_adicionar_passageiro_na_viagem('Luis', 2);
CALL pd_adicionar_passageiro_na_viagem('Antonio', 2);

CALL pd_adicionar_passageiro_na_viagem('Lucas Martins', 3);
CALL pd_adicionar_passageiro_na_viagem('Beatriz Souza', 3);
CALL pd_adicionar_passageiro_na_viagem('Carlos Eduardo', 3);
CALL pd_adicionar_passageiro_na_viagem('Fernanda Lima', 3);
CALL pd_adicionar_passageiro_na_viagem('Rafael Almeida', 3);
CALL pd_adicionar_passageiro_na_viagem('Camila Rocha', 3);
CALL pd_adicionar_passageiro_na_viagem('Zelda do Santos', 3);
CALL pd_adicionar_passageiro_na_viagem('Juliana Costa', 3);



INSERT INTO "Itinerario" (
  "id_reserva",
  "id_fornecedor_servico",
  "id_municipio",
  "ordem_passo",
  "voucher_codigo",
  "data_hora_inicio_utc",
  "data_hora_fim_utc",
  "tipo_evento",
  "descricao_evento",
  "status"
) VALUES

-- Chegada / Transfer
(1, 16, 4, 1, 
    'VCH-RES1-TRF', 
    NOW() + INTERVAL '7 days 02:00', 
    NOW() + INTERVAL '7 days 03:00', 
    'TRANSFER', 
    'Chegada e deslocamento inicial', 
    'AGENDADO'
),

-- Hotel
(1, 2, 1, 2, 
    'VCH-RES1-HOT', 
    NOW() + INTERVAL '7 days 03:30', 
    NOW() + INTERVAL '8 days 09:00', 
    'HOSPEDAGEM', 
    'Check-in: 03:30;\nCheck-out: 09:00;', 
    'AGENDADO'
),

-- Excursão
(1, 26, 1, 3, 
    'VCH-RES1-EXC', 
    NOW() + INTERVAL '7 days 09:00', 
    NOW() + INTERVAL '7 days 17:00', 
    'TOUR', 
    'Excursão Serra do Rio do Rastro', 
    'AGENDADO'),

-- Café (experiência final)
(1, 32, 1, 4, 
    'VCH-RES1-CFE', 
    NOW() + INTERVAL '7 days 18:00', 
    NOW() + INTERVAL '7 days 19:30', 
    'ALIMENTACAO', 
    'Café colonial na serra', 
    'AGENDADO'),

(1, 16, 4, 5, 
    'VCH-RES2-TRF', 
    NOW() + INTERVAL '8 days 09:30', 
    NOW() + INTERVAL '8 days 10:30', 
    'TRANSFER', 
    'Volta para casa.', 
    'AGENDADO');

UPDATE "Reserva" SET 
    "status" = 'CONFIRMADA', 
    "data_inicio_viagem_utc" = NOW() + INTERVAL '7 days 02:00', 
    "data_fim_viagem_utc" = NOW() + INTERVAL '8 days 10:30'
    WHERE "id" = 1;



INSERT INTO "Pagamento" (
    "id",
    "id_reserva",
    "valor",
    "forma_pagamento",
    "status",
    "data_pagamento_utc"
)
VALUES
(
    1,
    1,
    500.00,
    'PIX',
    'PAGO',
    NOW() - INTERVAL '2 days'
),

(
    2,
    1,
    300.00,
    'CARTAO',
    'PAGO',
    NOW() - INTERVAL '1 day'
),

(
    3,
    1,
    200.00,
    'BOLETO',
    'PENDENTE',
    NOW() - INTERVAL '10 days'
);