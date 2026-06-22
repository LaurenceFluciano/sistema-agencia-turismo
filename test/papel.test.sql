-- ID 1 é Pessoa Física
INSERT INTO "Pessoa_Papel" (id_pessoa, id_papel) VALUES (1, 3); -- Onde 3 = Papel 'Empresa'
-- Esperado: RAISE EXCEPTION 'Papel não permitido para Tipo de Pessoa'