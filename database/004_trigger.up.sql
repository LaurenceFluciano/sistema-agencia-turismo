CREATE OR REPLACE TRIGGER tg_atualiza_data_atualizacao_servico
BEFORE UPDATE ON "Servico"
FOR EACH ROW
EXECUTE FUNCTION fn_atualiza_data_atualizacao();


CREATE OR REPLACE TRIGGER tg_atualiza_data_atualizacao_fornecedor_servico
BEFORE UPDATE ON "Fornecedor_Servico"
FOR EACH ROW
EXECUTE FUNCTION fn_atualiza_data_atualizacao();


CREATE OR REPLACE TRIGGER tg_verificar_papel_tipo_pessoa
BEFORE UPDATE OR INSERT ON "Pessoa_Papel"
FOR EACH ROW
EXECUTE FUNCTION fn_validar_papel_pessoa();


CREATE TRIGGER tg_copiar_itens_pacote_reserva
AFTER INSERT OR UPDATE OF "id_pacote" ON "Reserva"
FOR EACH ROW
EXECUTE FUNCTION fn_copiar_itens_pacote_para_reserva();


CREATE OR REPLACE TRIGGER tg_remover_itens_pacote_reserva
AFTER UPDATE ON "Reserva"
FOR EACH ROW
WHEN (NEW."id_pacote" IS NULL)
EXECUTE FUNCTION fn_remover_itens_pacote_da_reserva();


CREATE OR REPLACE TRIGGER tg_atualizar_total_reserva
AFTER UPDATE OR INSERT OR DELETE ON "Reserva_Item"
FOR EACH ROW
EXECUTE FUNCTION fn_atualizar_total_reserva();


CREATE TRIGGER trg_check_pessoa_fisica
BEFORE INSERT OR UPDATE ON "Pessoa_Fisica"
FOR EACH ROW EXECUTE FUNCTION check_pessoa_fisica_tipo();

CREATE TRIGGER trg_check_pessoa_juridica
BEFORE INSERT OR UPDATE ON "Pessoa_Juridica"
FOR EACH ROW EXECUTE FUNCTION check_pessoa_juridica_tipo();


CREATE TRIGGER trg_validar_pagamento_pago
BEFORE INSERT OR UPDATE ON "Pagamento"
FOR EACH ROW EXECUTE FUNCTION fn_validar_pagamento_pago();


CREATE TRIGGER trg_validar_status_reserva
BEFORE INSERT ON "Pagamento"
FOR EACH ROW EXECUTE FUNCTION fn_validar_status_reserva_pagamento();


CREATE TRIGGER trg_check_insert_reserva_item
BEFORE INSERT ON "Reserva_Item"
FOR EACH ROW
EXECUTE FUNCTION fn_check_insert_reserva_item();


CREATE TRIGGER trg_check_insert_itinerario
BEFORE INSERT ON "Itinerario"
FOR EACH ROW
EXECUTE FUNCTION fn_check_insert_itinerario();


CREATE TRIGGER trg_reserva_confirmada
AFTER UPDATE OF status ON "Reserva"
FOR EACH ROW
WHEN (NEW.status = 'CONFIRMADA')
EXECUTE FUNCTION fn_reserva_confirmada();


CREATE TRIGGER trg_reserva_cancelada
AFTER UPDATE OF status ON "Reserva"
FOR EACH ROW
WHEN (NEW.status = 'CANCELADA')
EXECUTE FUNCTION fn_reserva_cancelada();


CREATE TRIGGER trg_reserva_concluida
AFTER UPDATE OF status ON "Reserva"
FOR EACH ROW
WHEN (NEW.status = 'CONCLUIDA')
EXECUTE FUNCTION fn_reserva_concluida();


CREATE TRIGGER trg_check_update_itinerario
BEFORE UPDATE OF status ON "Itinerario"
FOR EACH ROW
EXECUTE FUNCTION fn_check_update_itinerario();