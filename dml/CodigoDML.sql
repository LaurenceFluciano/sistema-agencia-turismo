insert into fornecedor (pessoa_id, razao_social, cnpj)
values 
(01, 'Copacabana consolidadora de turismo LTDA', '62.586.183/0001-26' ),
(02, 'jequitiba distribuição de serviços de turismo LTDA', '04.254.475/0001-65' ),
(03, 'Pocahontas distribuição de serviços de turismo LTDA', '83.343.069/0001-45' ),
(04, 'Lauro Müller serviços de hotelaria LTDA', '13.390.775/0001-62' ),
(05, 'Dionisio consolidadora de turismo LTDA', '91.842.082/0001-77' );


insert into servico(id, id_local, nome, tipo)
values
(01, 01, 'Hotel Rio do Rastro', 'Hotel')  -- fornecedor 4
(02, 01, 'Hotel Rio Rocinha', 'Hotel')   -- fornecedor 4
(03, 01, 'Hotelaria Casa do felipe', 'Hotel')    -- fornecedor 4
(04, 01, 'Hostel Rio da vaca', 'Hotel')  -- fornecedor 4
(05, 01, 'Hotel morro da palha', 'Hotel') -- fornecedor 4
(06, 02, 'Hotel receba', 'Hotel') -- fornecedor 2
(07, 01, 'Hotel trivago', 'Hotel') -- fornecedor 2
(08, 05, 'hotel Mariana', 'Hotel') -- fornecedor 1
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
(25, 03, 'Brisa do Mar Locadora de Barcos', 'Locação de Veículos Marítimos'),--fornecedor 5
(26, 1, 'Mirante da Serra do Rio do Rastro', 'Ponto Turístico'), --Ponto turístico
(27, 2, 'Forte de Copacabana', 'Ponto Turístico'), --Ponto turístico
(28, 3, 'Parque das Esculturas', 'Ponto Turístico'), --Ponto turístico
(29, 4, 'Parque das Aves', 'Ponto Turístico'), --Ponto turístico
(30, 5, 'Museu Zoroastro Artiaga', 'Ponto Turístico'), --Ponto turístico
(31, 1, 'Churrascaria Tropeiro', 'Restaurante'), -- Serra SC
(32, 1, 'Café da Montanha', 'Restaurante'), -- Serra SC
(33, 1, 'Bistrô Lauro Müller', 'Restaurante'), -- Serra SC
(34, 1, 'Pizzaria da Serra', 'Restaurante'), -- Serra SC
(35, 2, 'Churrascaria Palace', 'Restaurante'), --Copacabana RJ
(36, 2, 'Boteco Belmonte Copacabana', 'Restaurante'), --Copacabana RJ
(37, 2, 'La Trattoria', 'Restaurante'), --Copacabana RJ
(38, 2, 'Restaurante Cervantes', 'Restaurante'), --Copacabana RJ
(39, 3, 'Parraxaxá', 'Restaurante'), --Marco zero PE
(40, 3, 'Restaurante Leite', 'Restaurante'), --Marco zero PE
(41, 3, 'Seu Boteco Marco Zero', 'Restaurante'), --Marco zero PE
(42, 3, 'Bistrô do Cais', 'Restaurante'), --Marco zero PE
(43, 4, 'Restaurante Porto Canoas', 'Restaurante'), --Cataratas do Iguaçu PR
(44, 4, 'Rafain Churrascaria Show', 'Restaurante'), --Cataratas do Iguaçu PR
(45, 4, 'Cabeça de Boi', 'Restaurante'), --Cataratas do Iguaçu PR
(46, 4, 'Churrascaria do Gaúcho', 'Restaurante'), --Cataratas do Iguaçu PR
(47, 5, 'Chão Nativo', 'Restaurante'), --Praça Civica GO
(48, 5, 'Restaurante Piquiras', 'Restaurante'), --Praça Civica GO
(49, 5, 'Carne de Sol 1008', 'Restaurante'), --Praça Civica GO
(50, 5, 'Panelinha Grill', 'Restaurante'); --Praça Civica GO

