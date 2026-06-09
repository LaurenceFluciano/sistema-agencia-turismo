TRUNCATE TABLE
  Pessoa, Cliente, Fornecedor,
  "Local", Servico, Fornecedor_Oferta,
  Pacote, Pacote_Item, Reserva,
  Venda, Pagamento, Itinerario,
  Passageiro, Recomendacao
CASCADE;

INSERT INTO Pessoa (id, nome, telefone, email, data_cadastro) VALUES
(1, 'Joao Luciano', '48999990001', 'joaoluciano@unisatc.com', NOW()),
(2, 'Ana Silva', '48999990002', 'ana@email.com', NOW()),
(3, 'Bruno Souza', '48999990003', 'bruno@email.com', NOW()),
(4, 'Carla Costa', '48999990004', 'carla@email.com', NOW()),
(5, 'Diego Santos', '48999990005', 'diego@email.com', NOW()),
(6, 'Elena Ribeiro', '48999990006', 'elena@email.com', NOW()),
(7, 'Fabio Lima', '48999990007', 'fabio@email.com', NOW()),
(8, 'Gisele Almeida', '48999990008', 'gisele@email.com', NOW()),
(9, 'Heitor Peres', '48999990009', 'heitor@email.com', NOW()),
(10, 'Igor Nunes', '48999990010', 'igor@email.com', NOW());

INSERT INTO Pessoa (id, nome, telefone, email, data_cadastro) VALUES
(11, 'Copacabana Consolidadora', '1133330001', 'contato@copacabana.com.br', NOW()),
(12, 'Jequitibá Distribuição',   '2133330002', 'comercial@jequitiba.com.br', NOW()),
(13, 'Pocahontas Distribuição',  '3133330003', 'reservas@pocahontas.com.br', NOW()),
(14, 'Lauro Müller Hotelaria',   '4833330004', 'gerencia@lauromuller.com.br', NOW()),
(15, 'Dionisio Consolidadora',   '5133330005', 'diretoria@dionisio.com.br', NOW());

insert into fornecedor (pessoa_id, razao_social, cnpj)
values 
(11, 'Copacabana consolidadora de turismo LTDA', '62.586.183/0001-26' ),
(12, 'jequitiba distribuição de serviços de turismo LTDA', '04.254.475/0001-65' ),
(13, 'Pocahontas distribuição de serviços de turismo LTDA', '83.343.069/0001-45' ),
(14, 'Lauro Müller serviços de hotelaria LTDA', '13.390.775/0001-62' ),
(15, 'Dionisio consolidadora de turismo LTDA', '91.842.082/0001-77' );

INSERT INTO "Local" (id, nome_ponto, municipio, estado, pais) 
VALUES 
    (1, 'Serra do Rio do Rastro', 'Lauro Müller', 'SC', 'Brasil'),
    (2, 'Copacabana', 'Rio de Janeiro', 'RJ', 'Brasil'),
    (3, 'Marco Zero', 'Recife', 'PE', 'Brasil'),
    (4, 'Cataratas do Iguaçu', 'Foz do Iguaçu', 'PR', 'Brasil'),
    (5, 'Praça Cívica', 'Goiânia', 'GO', 'Brasil');

INSERT INTO Cliente (pessoa_id) VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10);

insert into servico(id, id_local, nome, tipo)
values
(01, 01, 'Hotel Rio do Rastro', 'Hotel'),  -- fornecedor 4
(02, 01, 'Hotel Rio Rocinha', 'Hotel'),   -- fornecedor 4
(03, 01, 'Hotelaria Casa do felipe', 'Hotel'),    -- fornecedor 4
(04, 01, 'Hostel Rio da vaca', 'Hotel'),  -- fornecedor 4
(05, 01, 'Hotel morro da palha', 'Hotel'), -- fornecedor 4
(06, 02, 'Hotel receba', 'Hotel'), -- fornecedor 2
(07, 01, 'Hotel trivago', 'Hotel'), -- fornecedor 2
(08, 05, 'hotel Mariana', 'Hotel'), -- fornecedor 1
(09, 04, 'Hotel Leeroy Jenkins', 'Hotel'),  -- fornecedor 1
(10, 03, 'Hotel Wano', 'Hotel'),  -- fornecedor 3
(11, 02, 'Joseph Joestar Companhias aereas', 'companhia aerea'), -- fornecedor 1
(12, 01, 'Bom Voo Companhias aereas', 'companhia aerea'), -- fornecedor 1
(13, 01, 'Paranagua Companhias aereas', 'companhia aerea'), -- fornecedor 2
(14, 03, 'Seriguela Companhias aereas', 'companhia aerea'), -- fornecedor 3
(15, 03, 'Opamecano Companhias aereas', 'companhia aerea'),-- fornecedor 5
(16, 04, 'Vá Rápido Translados', 'Translado'), -- fornecedor 1
(17, 02, 'Auto Locadora Roda Presa', 'Aluguel de Carros'), -- fornecedor 1
(18, 05, 'SafeTrip Seguros de Viagem', 'Seguro Viagem'), -- fornecedor 2
(19, 01, 'Money Câmbio e Moedas', 'Casa de Câmbio'), -- fornecedor 2
(20, 03, 'Guias Nativos da Região', 'Guia Turístico'), -- fornecedor 3
(21, 01, 'Lounge VIP Relax Aeroporto', 'Sala VIP'), -- fornecedor 3
(22, 04, 'Visto Sem Estresse Assessoria', 'Assessoria de Vistos'), -- fornecedor 3
(23, 02, 'Mundo Conectado Telecom', 'Chip de Internet Internacional'), --fornecedor 5
(24, 05, 'SafeBox Guarda-Volumes', 'Armazenamento de Bagagem'), --fornecedor 5
(25, 03, 'Brisa do Mar Locadora de Barcos', 'Locação de Veículos Marítimos');--fornecedor 5

INSERT INTO Servico (id, id_local, nome, tipo) 
VALUES
    
    (26, 1, 'Mirante da Serra do Rio do Rastro', 'Ponto Turístico'),
    (27, 2, 'Forte de Copacabana', 'Ponto Turístico'),
    (28, 3, 'Parque das Esculturas', 'Ponto Turístico'),
    (29, 4, 'Parque das Aves', 'Ponto Turístico'),
    (30, 5, 'Museu Zoroastro Artiaga', 'Ponto Turístico'),

    (31, 1, 'Churrascaria Tropeiro', 'Restaurante'),
    (32, 1, 'Café da Montanha', 'Restaurante'),
    (33, 1, 'Bistrô Lauro Müller', 'Restaurante'),
    (34, 1, 'Pizzaria da Serra', 'Restaurante'),
    
    
    (35, 2, 'Churrascaria Palace', 'Restaurante'),
    (36, 2, 'Boteco Belmonte Copacabana', 'Restaurante'),
    (37, 2, 'La Trattoria', 'Restaurante'),
    (38, 2, 'Restaurante Cervantes', 'Restaurante'),
    
  
    (39, 3, 'Parraxaxá', 'Restaurante'),
    (40, 3, 'Restaurante Leite', 'Restaurante'),
    (41, 3, 'Seu Boteco Marco Zero', 'Restaurante'),
    (42, 3, 'Bistrô do Cais', 'Restaurante'),
    
    
    (43, 4, 'Restaurante Porto Canoas', 'Restaurante'),
    (44, 4, 'Rafain Churrascaria Show', 'Restaurante'),
    (45, 4, 'Cabeça de Boi', 'Restaurante'),
    (46, 4, 'Churrascaria do Gaúcho', 'Restaurante'),
    
   
    (47, 5, 'Chão Nativo', 'Restaurante'),
    (48, 5, 'Restaurante Piquiras', 'Restaurante'),
    (49, 5, 'Carne de Sol 1008', 'Restaurante'),
    (50, 5, 'Panelinha Grill', 'Restaurante');

INSERT INTO Fornecedor_Oferta (id, fornecedor_id, servico_id, preco_estimado, disponibilidade, link_fonte, tipo_fonte, data_atualizacao, status, descricao) VALUES
-- Item 1: Hotel Rio Rocinha (Serviço 2) -> Fornecedor 14 (Lauro Müller)
(1, 14, 2, 1200.00, 'Imediata', 'http://api.lauromuller.com/hotel/rocinha', 'API JSON', NOW(), 'Ativo', 'Pacote 10 diárias completas'),

-- Item 5: Bom Voo Companhias Aéreas (Serviço 12) -> Fornecedor 11 (Copacabana Consolidadora)
(2, 11, 12, 500.00, 'Imediata', 'http://api.copacabana.com/voo/bomvoo', 'API JSON', NOW(), 'Ativo', 'Passagem Aérea Ida/Volta em Grupo'),

-- Item 3: Mirante da Serra (Serviço 26) -> Fornecedor 14 (Lauro Müller)
(3, 14, 26, 50.00, 'Imediata', 'http://api.lauromuller.com/tour/mirante', 'API JSON', NOW(), 'Ativo', 'Ingresso Acesso ao Mirante'),

-- Item 4: Churrascaria Tropeiro (Serviço 31) -> Fornecedor 14 (Lauro Müller)
(4, 14, 31, 100.00, 'Imediata', 'http://api.lauromuller.com/rest/tropeiro', 'API JSON', NOW(), 'Ativo', 'Almoço/Jantar Rodízio Tradicional'),

-- Item 2: Panelinha Grill (Serviço 50) -> Fornecedor 15 (Dionisio Consolidadora)
(5, 15, 50, 150.00, 'Imediata', 'http://api.dionisio.com/rest/panelinha', 'API JSON', NOW(), 'Ativo', 'Almoço Especial de Encerramento');





INSERT INTO Pacote (id, nome, data_inicio_viagem_utc, data_fim_viagem_utc, vagas_totais, vagas_disponiveis, custo_total_estimado, preco_venda_padrao, status)
VALUES
(1, 'Expedição Rocinha - Canion da ronda', '2026-12-15 10:00:00', '2026-12-25 18:00:00', 40, 38, 80000.00, 4200.00, 'Disponível');

INSERT INTO Pacote_Item (id, id_pacote, id_fornecedor_oferta, quantidade, descricao_ou_servico)
VALUES
(1, 1, 1, 40, 'Hospedagem no Hotel Rio Rocinha (10 diárias)'),
(2, 1, 5, 40, 'Almoço especial de encerramento no Panelinha Grill'),
(3, 1, 3, 40, 'Ingressos para o Mirante da Serra do Rio do Rastro'),
(4, 1, 4, 40, 'Jantar tradicional na Churrascaria Tropeiro'),
(5, 1, 2, 40, 'Passagens aéreas de ida e volta pela Bom Voo Companhias');


INSERT INTO Fornecedor_Oferta (id, fornecedor_id, servico_id, preco_estimado, disponibilidade, link_fonte, tipo_fonte, data_atualizacao, status, descricao) VALUES
-- Item 6: Hotel Leeroy Jenkins (Serviço 9)
(6, 13, 9, 800.00, 'Imediata', 'http://api.jequitiba.com/hotel/leeroy', 'API JSON', NOW(), 'Ativo', 'Combo 5 Noites Quarto Duplo Conforto'),

-- Item 7: Vá Rápido Translados (Serviço 16) 
(7, 13, 16, 100.00, 'Imediata', 'http://api.jequitiba.com/trans/varapido', 'API JSON', NOW(), 'Ativo', 'Translado In/Out Aeroporto IGU'),

-- Item 8: Parque das Aves (Serviço 29)
(8, 13, 29, 80.00, 'Imediata', 'http://api.jequitiba.com/tour/aves', 'API JSON', NOW(), 'Ativo', 'Ingresso Entrada Passaporte Parque das Aves'),

-- Item 9: Restaurante Porto Canoas (Serviço 43)
(9, 13, 43, 120.00, 'Imediata', 'http://api.jequitiba.com/rest/portocanoas', 'API JSON', NOW(), 'Ativo', 'Almoço com Vista para as Quedas');


INSERT INTO Pacote (id, nome, data_inicio_viagem_utc, data_fim_viagem_utc, vagas_totais, vagas_disponiveis, custo_total_estimado, preco_venda_padrao, status) 
VALUES 
(2, 'Aventura nas Cataratas do Iguaçu', '2027-01-10 08:00:00', '2027-01-15 18:00:00', 30, 30, 1500.00, 2800.00, 'Disponível');

INSERT INTO Pacote_Item (id, id_pacote, id_fornecedor_oferta, quantidade, descricao_ou_servico)
VALUES
(6, 2, 6, 30, '5 noites de Hospedagem no Hotel Leeroy Jenkins'),
(7, 2, 7, 30, 'Translado Aeroporto/Hotel com Vá Rápido Translados'),
(8, 2, 8, 30, 'Ingressos de visitação para o Parque das Aves'),
(9, 2, 9, 30, 'Almoço especial no Restaurante Porto Canoas');


INSERT INTO Reserva (id, id_cliente, id_pacote, data_inicio_viagem_utc, data_fim_viagem_utc, status, preco_total) VALUES
(1, 1, 1, '2026-12-15 10:00:00', '2026-12-25 18:00:00', 'Confirmada', 4200.00),
(2, 2, 1, '2026-12-15 10:00:00', '2026-12-25 18:00:00', 'Confirmada', 4200.00);

INSERT INTO Reserva (id, id_cliente, id_pacote, data_inicio_viagem_utc, data_fim_viagem_utc, status, preco_total) VALUES
(3, 3, 2, '2027-01-10 08:00:00', '2027-01-15 18:00:00', 'Confirmada', 2800.00),
(4, 4, 2, '2027-01-10 08:00:00', '2027-01-15 18:00:00', 'Confirmada', 2800.00);

-- ==============================================================================
-- 4. VENDAS (Corrigido para IDs Incrementais 1 a 5)
-- ==============================================================================
INSERT INTO Venda (id_reserva, id_fornecedor_oferta, custo_fornecedor_real, preco_venda_cliente) VALUES
-- Itens vendidos na Reserva 1
(1, 1, 800.00,  2400.00), -- ID 1: Hospedagem
(1, 2, 400.00,  1000.00), -- ID 2: Voo
(1, 3, 30.00,   100.00),  -- ID 3: Mirante
(1, 4, 70.00,   300.00),  -- ID 4: Tropeiro
(1, 5, 100.00,  400.00),  -- ID 5: Panelinha (Total: 4200.00)

-- Itens vendidos na Reserva 2
(2, 1, 800.00,  2400.00),
(2, 2, 400.00,  1000.00),
(2, 3, 30.00,   100.00),
(2, 4, 70.00,   300.00),
(2, 5, 100.00,  400.00);


-- ==============================================================================
-- 5. ITINERÁRIOS LOGÍSTICOS (Sincronizado com os Novos IDs e Locais)
-- ==============================================================================
INSERT INTO Itinerario (id_itinerario, id_reserva, id_fornecedor_oferta, id_local, data_hora_inicio_utc, data_hora_fim_utc, tipo_evento, voucher_codigo, descricao_itinerario, status) VALUES
-- Cronograma da Reserva 1
(1, 1, 2, 1, '2026-12-15 10:00:00', '2026-12-15 12:00:00', 'Voo',         'BV-101',  'Voo de Ida - Bom Voo', 'Confirmado'),
(2, 1, 1, 1, '2026-12-15 14:00:00', '2026-12-25 10:00:00', 'Hospedagem',  'HRR-99',  'Check-in Hotel Rio Rocinha', 'Confirmado'),
(3, 1, 3, 1, '2026-12-18 09:00:00', '2026-12-18 13:00:00', 'Passeio',     'MSRR-01', 'Tour Guiado no Mirante da Serra', 'Confirmado'),
(4, 1, 4, 1, '2026-12-20 20:00:00', '2026-12-20 23:00:00', 'Alimentação', 'CT-88',   'Jantar na Churrascaria Tropeiro', 'Confirmado'),
(5, 1, 5, 5, '2026-12-25 12:00:00', '2026-12-25 15:00:00', 'Alimentação', 'PG-77',   'Almoço de Encerramento no Panelinha Grill', 'Confirmado'),

-- Cronograma da Reserva 2
(6, 2, 2, 1, '2026-12-15 10:00:00', '2026-12-15 12:00:00', 'Voo',         'BV-102',  'Voo de Ida - Bom Voo', 'Confirmado'),
(7, 2, 1, 1, '2026-12-15 14:00:00', '2026-12-25 10:00:00', 'Hospedagem',  'HRR-100', 'Check-in Hotel Rio Rocinha', 'Confirmado'),
(8, 2, 3, 1, '2026-12-18 09:00:00', '2026-12-18 13:00:00', 'Passeio',     'MSRR-02', 'Tour Guiado no Mirante da Serra', 'Confirmado'),
(9, 2, 4, 1, '2026-12-20 20:00:00', '2026-12-20 23:00:00', 'Alimentação', 'CT-89',   'Jantar na Churrascaria Tropeiro', 'Confirmado'),
(10,2, 5, 5, '2026-12-25 12:00:00', '2026-12-25 15:00:00', 'Alimentação', 'PG-78',   'Almoço de Encerramento no Panelinha Grill', 'Confirmado');


-- OUTROS INSERTS

INSERT INTO Recomendacao (id, id_cliente, id_local_interesse, tipo_servico_interesse, data_registro) VALUES
(1, 1, 2, 'Hospedagem', NOW()),
(2, 2, 1, 'Transporte', NOW()),
(3, 3, 5, 'Hospedagem', NOW()),
(4, 4, 3, 'Lazer', NOW()),
(5, 5, 4, 'Alimentação', NOW());


-- ==============================================================================
-- 3. VENDAS (Financeiro rateado para bater exatamente o preço de venda de R$ 2800.00)
-- ==============================================================================
INSERT INTO Venda (id_reserva, id_fornecedor_oferta, custo_fornecedor_real, preco_venda_cliente) VALUES
-- Itens vendidos na Reserva 3 (Pacote 2)
(3, 6, 600.00,  2000.00), -- ID 6: Hospedagem Leeroy Jenkins
(3, 7, 70.00,   250.00),  -- ID 7: Translado Vá Rápido
(3, 8, 60.00,   150.00),  -- ID 8: Parque das Aves
(3, 9, 90.00,   400.00),  -- ID 9: Restaurante Porto Canoas (Total: R$ 2800.00)

-- Itens vendidos na Reserva 4 (Pacote 2)
(4, 6, 600.00,  2000.00),
(4, 7, 70.00,   250.00),
(4, 8, 60.00,   150.00),
(4, 9, 90.00,   400.00);


-- ==============================================================================
-- 4. ITINERÁRIOS LOGÍSTICOS (Cronograma físico em Foz do Iguaçu - Local 4)
-- ==============================================================================
INSERT INTO Itinerario (id_itinerario, id_reserva, id_fornecedor_oferta, id_local, data_hora_inicio_utc, data_hora_fim_utc, tipo_evento, voucher_codigo, descricao_itinerario, status) VALUES
-- Cronograma da Reserva 3
(11, 3, 7, 4, '2027-01-10 08:00:00', '2027-01-10 09:30:00', 'Translado',  'VR-FOZ31', 'Recepção no Aeroporto e Transfer In', 'Confirmado'),
(12, 3, 6, 4, '2027-01-10 14:00:00', '2027-01-15 11:00:00', 'Hospedagem', 'LJK-301',  'Check-in Hotel Leeroy Jenkins', 'Confirmado'),
(13, 3, 8, 4, '2027-01-12 09:00:00', '2027-01-12 13:00:00', 'Passeio',    'PAVES-01', 'Visitação Guiada ao Parque das Aves', 'Confirmado'),
(14, 3, 9, 4, '2027-01-12 13:30:00', '2027-01-12 15:30:00', 'Alimentação', 'PCANOAS-1', 'Almoço Especial Porto Canoas', 'Confirmado'),
(15, 3, 7, 4, '2027-01-15 15:00:00', '2027-01-15 16:30:00', 'Translado',  'VR-FOZ32', 'Transfer Out - Hotel para Aeroporto', 'Confirmado'),

-- Cronograma da Reserva 4
(16, 4, 7, 4, '2027-01-10 08:00:00', '2027-01-10 09:30:00', 'Translado',  'VR-FOZ41', 'Recepção no Aeroporto e Transfer In', 'Confirmado'),
(17, 4, 6, 4, '2027-01-10 14:00:00', '2027-01-15 11:00:00', 'Hospedagem', 'LJK-302',  'Check-in Hotel Leeroy Jenkins', 'Confirmado'),
(18, 4, 8, 4, '2027-01-12 09:00:00', '2027-01-12 13:00:00', 'Passeio',    'PAVES-02', 'Visitação Guiada ao Parque das Aves', 'Confirmado'),
(19, 4, 9, 4, '2027-01-12 13:30:00', '2027-01-12 15:30:00', 'Alimentação', 'PCANOAS-2', 'Almoço Especial Porto Canoas', 'Confirmado'),
(20, 4, 7, 4, '2027-01-15 15:00:00', '2027-01-15 16:30:00', 'Translado',  'VR-FOZ42', 'Transfer Out - Hotel para Aeroporto', 'Confirmado');


-- ==============================================================================
-- 1. FINANCEIRO: PAGAMENTOS (Quitando as Reservas 1, 2, 3 e 4)
-- ==============================================================================
INSERT INTO Pagamento (id, id_reserva, valor, forma_pagamento, status, data_pagamento_utc) VALUES
-- Reserva 1 (Pacote 1: R$ 4200.00) - Pago à vista no Pix
(1, 1, 4200.00, 'Pix', 'Concluído', NOW()),

-- Reserva 2 (Pacote 1: R$ 4200.00) - Pago no Cartão de Crédito
(2, 2, 4200.00, 'Cartão de Crédito', 'Concluído', NOW()),

-- Reserva 3 (Pacote 2: R$ 2800.00) - Pago à vista no Pix
(3, 3, 2800.00, 'Pix', 'Concluído', NOW()),

-- Reserva 4 (Pacote 2: R$ 2800.00) - Pago no Boleto Bancário
(4, 4, 2800.00, 'Boleto', 'Concluído', NOW());


-- ==============================================================================
-- 2. OPERAÇÃO: PASSAGEIROS DA VIAGEM
-- ==============================================================================
INSERT INTO Passageiro (id, id_reserva, nome_pessoa, documento_viagem) VALUES
-- Passageiro da Reserva 1 (Cliente 1: Joao Luciano)
(1, 1, 'Joao Luciano', 'RG1111111'),

-- Passageiro da Reserva 2 (Cliente 2: Ana Silva)
(2, 2, 'Ana Silva', 'RG2222222'),

-- Passageiro da Reserva 3 (Cliente 3: Bruno Souza)
(3, 3, 'Bruno Souza', 'RG3233333'),

-- Passageiro da Reserva 4 (Cliente 4: Carla Costa)
(4, 4, 'Carla Costa', 'RG4444444');
