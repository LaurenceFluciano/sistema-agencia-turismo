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