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

(1, 16, 4, 1, 
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
