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
