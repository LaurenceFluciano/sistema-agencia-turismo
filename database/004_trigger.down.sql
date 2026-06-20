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