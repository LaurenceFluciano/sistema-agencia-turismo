
INSERT INTO "Papel" ("nome_papel") 
VALUES  ('Cliente'),
        ('Fornecedor'),
        ('Empresa');


/*
Os recursos turísticos são classificados seguindo padrões 
internacionais (como os da Organização Mundial do Turismo - OMT) e 
nacionais (como o do Ministério do Turismo no Brasil). 
*/
INSERT INTO "Tipo_Servico" ("nome_tipo") 
VALUES  ('Natural'),
        ('Cultural'),
        ('Entretenimento'),
        ('Transporte'),
        ('Hospedagem'),
        ('Suporte'),
        ('Alimentacao');
-- OBS:
-- Para fins didáticos e para manter a modelagem compatível com
-- o escopo da disciplina de Banco de Dados II, transporte,
-- hospedagem e alimentação foram tratados como recursos turísticos.
--
-- Em uma modelagem mais especializada do domínio turístico,
-- esses elementos poderiam ser separados em categorias próprias
-- de serviços de apoio à viagem, distintas dos atrativos turísticos.


INSERT INTO "Tipo_Pessoa_Papel" ("tipo_pessoa", "id_papel")
VALUES  ('F',1),
        ('F',2),
        ('J',1),
        ('J',2),
        ('J',3);