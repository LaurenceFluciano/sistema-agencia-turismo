-- Início: 007_conexao_externa.down.sql



-- Início: 006_procedure.down.sql
DROP PROCEDURE IF EXISTS pd_definir_preco_da_reserva(
    INT,
    INT,
    DECIMAL(13,4),
    NUMERIC(5,2)
);

DROP PROCEDURE IF EXISTS pd_adicionar_passageiro_na_viagem(
    VARCHAR(255),
    INT
);

DROP PROCEDURE IF EXISTS pd_criar_oferta_comercial(
    INT,
    VARCHAR(255),
    INT,
    INT,
    VARCHAR(256)
);

DROP PROCEDURE IF EXISTS pd_cadastrar_cliente(
    VARCHAR(255),
    VARCHAR(15),
    VARCHAR(320),
    CHAR(1),
    CHAR(11),
    DATE,
    VARCHAR(255),
    CHAR(14)
);

DROP PROCEDURE IF EXISTS pd_rotina_cancelar_pagamentos_vencidos();

DROP PROCEDURE IF EXISTS pd_atualizar_cliente(
    INT,
    VARCHAR(255),
    VARCHAR(15),
    VARCHAR(320),
    CHAR(1),
    CHAR(11),
    DATE,
    VARCHAR(255),
    CHAR(14)
)
-- Início: 005_view.down.sql
DROP VIEW IF EXISTS vw_fornecedor_servico_completo CASCADE;

DROP VIEW IF EXISTS vw_relatorio_itinerario_completo CASCADE;

DROP VIEW IF EXISTS vw_pacotes_mais_reservados CASCADE;

-- Início: 004_trigger.down.sql
-- Gatilhos de atualização de timestamp
DROP TRIGGER IF EXISTS tg_atualiza_data_atualizacao_servico ON "Servico";
DROP TRIGGER IF EXISTS tg_atualiza_data_atualizacao_fornecedor_servico ON "Fornecedor_Servico";

-- Gatilho de validação de papéis
DROP TRIGGER IF EXISTS tg_verificar_papel_tipo_pessoa ON "Pessoa_Papel";

-- Gatilhos de gerenciamento de pacotes na reserva
DROP TRIGGER IF EXISTS tg_copiar_itens_pacote_reserva ON "Reserva";
DROP TRIGGER IF EXISTS tg_remover_itens_pacote_reserva ON "Reserva";

-- Gatilho de cálculo financeiro do total da reserva
DROP TRIGGER IF EXISTS tg_atualizar_total_reserva ON "Reserva_Item";

-- Gatilho de verificação de inadimplência/quitação
DROP TRIGGER IF EXISTS tg_marcar_reserva_como_concluido_ou_em_atraso ON "Pagamento";

DROP TRIGGER IF EXISTS  trg_check_pessoa_fisica ON "Pessoa_Fisica";
DROP TRIGGER IF EXISTS  trg_check_pessoa_juridica ON "Pessoa_Juridica";
-- Início: 003_constraint.down.sql


-- Início: 002_funcao.down.sql
-- ==========================================
-- 1. FUNÇÕES DE NEGÓCIO
-- ==========================================

-- Controle Financeiro e Status da Reserva
DROP FUNCTION IF EXISTS fn_marcar_reserva_como_concluido_ou_em_atraso() CASCADE;

-- Cálculo de Totais da Reserva (Disparada por itens da reserva)
DROP FUNCTION IF EXISTS fn_atualizar_total_reserva() CASCADE;

-- Gerenciamento de Itens Vinculados a Pacotes
DROP FUNCTION IF EXISTS fn_remover_itens_pacote_da_reserva() CASCADE;
DROP FUNCTION IF EXISTS fn_copiar_itens_pacote_para_reserva() CASCADE;

-- Validação de Regras de Atores/Papéis
DROP FUNCTION IF EXISTS fn_validar_papel_pessoa() CASCADE;

-- Pegar serviços por id da cidade
DROP FUNCTION IF EXISTS fn_listar_servicos_por_municipio(INT) CASCADE;

-- Cálculo de juros
DROP FUNCTION IF EXISTS fn_calcular_lucro_periodo(DATE, DATE) CASCADE;
DROP FUNCTION IF EXISTS fn_calcular_lucro_reserva(INT) CASCADE;


-- ==========================================
-- 2. FUNÇÕES OPERACIONAIS (UTILITÁRIAS)
-- ==========================================

DROP FUNCTION IF EXISTS fn_atualiza_data_atualizacao() CASCADE;

DROP FUNCTION IF EXISTS fn_validar_periodo(anyelement, anyelement) CASCADE;

-- Início: 001_ddl.down.sql
DROP TABLE IF EXISTS "Passageiro" CASCADE;
DROP TABLE IF EXISTS "Itinerario" CASCADE;
DROP TABLE IF EXISTS "Pagamento" CASCADE;
DROP TABLE IF EXISTS "Reserva_Item" CASCADE;
DROP TABLE IF EXISTS "Reserva" CASCADE;
DROP TABLE IF EXISTS "Pacote_Item" CASCADE;
DROP TABLE IF EXISTS "Pacote" CASCADE;
DROP TABLE IF EXISTS "Fornecedor_Servico" CASCADE;
DROP TABLE IF EXISTS "Servico" CASCADE;
DROP TABLE IF EXISTS "Tipo_Servico" CASCADE;
DROP TABLE IF EXISTS "Municipio" CASCADE;
DROP TABLE IF EXISTS "Estado" CASCADE;
DROP TABLE IF EXISTS "Pais" CASCADE;
DROP TABLE IF EXISTS "Pessoa_Juridica" CASCADE;
DROP TABLE IF EXISTS "Pessoa_Fisica" CASCADE;
DROP TABLE IF EXISTS "Pessoa_Papel" CASCADE;
DROP TABLE IF EXISTS "Tipo_Pessoa_Papel" CASCADE;
DROP TABLE IF EXISTS "Papel" CASCADE;
DROP TABLE IF EXISTS "Pessoa" CASCADE;

-- Início: 000_tipos.down.sql
DROP TYPE IF EXISTS tipo_status_pessoa CASCADE;
DROP TYPE IF EXISTS tipo_status_pacote CASCADE;
DROP TYPE IF EXISTS tipo_status_reserva CASCADE;
DROP TYPE IF EXISTS tipo_status_pagamento CASCADE;
DROP TYPE IF EXISTS tipo_status_fornecedor_servico CASCADE;
DROP TYPE IF EXISTS tipo_status_itinerario CASCADE;
DROP TYPE IF EXISTS tipo_status_servico CASCADE;
