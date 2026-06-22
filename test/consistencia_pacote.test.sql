-- 1. Tentar criar uma reserva com pacote 1
INSERT INTO "Reserva" (id_cliente, status, id_pacote) VALUES (1, 'RASCUNHO', 1);

-- 2. Verificar se os itens do pacote foram populados automaticamente na Reserva_Item
SELECT count(*) FROM "Reserva_Item" WHERE id_reserva = (SELECT max(id) FROM "Reserva");
-- Esperado: O número de itens deve ser igual ao número de itens que o pacote 1 possui.

-- 3. Alterar o pacote da reserva para o id 2
UPDATE "Reserva" SET id_pacote = 2 WHERE id = (SELECT max(id) FROM "Reserva");

-- 4. Verificar se a Reserva_Item trocou os itens (Delete antigo + Insert novo)
-- Esperado: A contagem deve refletir os itens do pacote 2.

-- 5. Remover o pacote da reserva (setar NULL)
UPDATE "Reserva" SET id_pacote = NULL WHERE id = (SELECT max(id) FROM "Reserva");

-- 6. Verificar se os itens foram removidos
SELECT count(*) FROM "Reserva_Item" WHERE id_reserva = (SELECT max(id) FROM "Reserva") AND gerado_pelo_pacote = TRUE;
-- Esperado: 0