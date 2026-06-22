DELETE FROM "Reserva" WHERE id = (SELECT max(id) FROM "Reserva");
SELECT * FROM "Reserva";


-- 1. Criar reserva, itens e itinerários
INSERT INTO "Reserva" (id_cliente, status) VALUES (3, 'CONFIRMADA');

-- 1.1. Mudar status da reserva
UPDATE "Reserva" SET "status" = 'RASCUNHO' WHERE "id" = (SELECT max(id) FROM "Reserva");
UPDATE "Reserva" SET "status" = 'CONFIRMADA' WHERE "id" = (SELECT max(id) FROM "Reserva");
UPDATE "Reserva" SET "status" = 'CONCLUIDA' WHERE "id" = (SELECT max(id) FROM "Reserva");

-- 2. Tentar inserir itinerarios
INSERT INTO "Reserva_Item" (id_reserva, id_fornecedor_servico, preco_venda, custo_fornecedor) VALUES ((SELECT max(id) FROM "Reserva"), 1, 1000.00, 600.00);
INSERT INTO "Itinerario" (id_reserva, id_fornecedor_servico, id_municipio, status) VALUES ((SELECT max(id) FROM "Reserva"), 1, 1, 'AGENDADO');

-- Calcular lucro (deve ser 0, pois o itinerário não está CONCLUIDO)
SELECT fn_calcular_lucro_reserva((SELECT max(id) FROM "Reserva"));
-- Esperado: 0.0000


SELECT * FROM "Itinerario" WHERE "id_reserva" = (SELECT max(id) FROM "Reserva");



