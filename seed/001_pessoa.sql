TRUNCATE TABLE
  "Pessoa_Papel", "Pessoa_Fisica", "Pessoa_Juridica", "Pessoa"
CASCADE;

INSERT INTO "Pessoa" (
    "nome",
    "telefone",
    "email",
    "tipo"
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
    "tipo"
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