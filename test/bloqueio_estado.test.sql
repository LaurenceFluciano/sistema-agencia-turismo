-- 1. Criar reserva e confirmar
INSERT INTO "Reserva" (id_cliente, status) VALUES (2, 'RASCUNHO');
UPDATE "Reserva" SET status = 'CONFIRMADA' WHERE id = (SELECT max(id) FROM "Reserva");

-- 2. Tentar inserir um item em reserva CONFIRMADA (Deve falhar!)
INSERT INTO "Reserva_Item" (id_reserva, id_fornecedor_servico) VALUES ((SELECT max(id) FROM "Reserva"), 1);
-- Esperado: RAISE EXCEPTION 'Não é permitido inserir Reserva_Item...'

-- 3. Tentar inserir um itinerário em reserva CONFIRMADA (Deve falhar!)
INSERT INTO "Itinerario" (id_reserva, id_fornecedor_servico, id_municipio, status) VALUES ((SELECT max(id) FROM "Reserva"), 1, 1, 'AGENDADO');
-- Esperado: RAISE EXCEPTION 'Não é permitido inserir Itinerário...'