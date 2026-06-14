
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
