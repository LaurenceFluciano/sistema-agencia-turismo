/**
 * SUÍTE DE TESTES E VALIDAÇÃO - PROCEDURES E NEGÓCIO
 */

-- 1. TESTE DE CADASTRO E ATUALIZAÇÃO DE PESSOA
-- 1.1 Cadastro completo de Pessoa Física (Papéis: 1=Cliente, 2=Fornecedor)
CALL pd_cadastrar_pessoa('João Silva', '11999998888', 'joao@email.com', 'F', ARRAY[1, 2], '12345678901', '1990-01-01');

-- 1.2 Cadastro completo de Pessoa Jurídica
CALL pd_cadastrar_pessoa('Tech Solutions', '1133334444', 'contato@tech.com', 'J', ARRAY[3], NULL, NULL, 'Tech LTDA', '12345678000199');

-- 1.3 Atualização (Mudando dados de pessoa existente)
CALL pd_atualizar_pessoa(1, 'João Silva Neto', '11988887777', 'joao.neto@email.com', 'F', '12345678901', '1990-01-01');

-- 1.4 Atualização de Papéis (Remover um, adicionar outro)
CALL pd_atualizar_papeis_pessoa(1, ARRAY[1]); -- Mantém apenas como Cliente


-- 2. TESTE DE GESTÃO DE OFERTAS
-- 2.1 Cadastros de Ofertas Comercial (Cria serviço se não existir)
CALL pd_criar_oferta_comercial(12, 'Hotel Plaza Paulista', 1, 1, 'Hotel Plaza Paulista - Tarifa Corporativa');
CALL pd_criar_oferta_comercial(12, 'Hotel Plaza Paulista', 1, 1, 'Hotel Plaza Paulista - Fim de Semana');

-- 2.2 Verificar se as ofertas foram criadas
SELECT * FROM "Fornecedor_Servico" WHERE "titulo_comercial" LIKE 'Hotel Plaza Paulista%';


-- 3. TESTE DE PRECIFICAÇÃO (RESERVA_ITEM)

-- 3.1. Criar reserva, itens e itinerários

INSERT INTO "Reserva" (id_cliente, status) VALUES (3, 'RASCUNHO');
INSERT INTO "Reserva_Item" (id_reserva, id_fornecedor_servico, preco_venda, custo_fornecedor) VALUES ((SELECT max(id) FROM "Reserva"), 1, 1000.00, 600.00);
INSERT INTO "Itinerario" (id_reserva, id_fornecedor_servico, id_municipio, status) VALUES ((SELECT max(id) FROM "Reserva"), 1, 1, 'AGENDADO');

-- 3.2 Definir preço com aumento
-- pd_id_reserva, pd_id_fornecedor_servico, pd_preco_fornecedor, pd_percentual_aumento

SELECT max(id) FROM "Reserva";
CALL pd_definir_preco_da_reserva(9, 1, 500.00, 20.00); 
-- Preço venda esperado: 600.00 (500 + 20%)

-- 3.2 Verificar o cálculo na tabela
SELECT "custo_fornecedor", "preco_venda" FROM "Reserva_Item" 
WHERE "id_reserva" = 9 AND 
"id_fornecedor_servico" = 1;


-- 4. TESTE DE ROTINAS FINANCEIRAS
-- 4.1 Rodar a rotina de cancelamento (Processa pagamentos com data < NOW())
CALL pd_rotina_mudar_pagamentos_cancelados_para_vencidos();

-- 4.2 Verificação pós-execução
-- (Verificar se a reserva mudou para 'CANCELADA' e o pagamento para 'VENCIDO')
SELECT "id", "status" FROM "Reserva" WHERE "status" = 'CANCELADA';
SELECT "id", "status" FROM "Pagamento" WHERE "status" = 'VENCIDO';





