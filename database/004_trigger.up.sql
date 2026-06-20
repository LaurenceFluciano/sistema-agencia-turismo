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


CREATE OR REPLACE TRIGGER tg_copiar_itens_pacote_reserva
AFTER INSERT ON "Reserva"
FOR EACH ROW
WHEN (NEW."id_pacote" IS NOT NULL)
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


CREATE OR REPLACE TRIGGER tg_marcar_reserva_como_concluido_ou_em_atraso
AFTER UPDATE OR INSERT ON "Pagamento"
FOR EACH ROW
EXECUTE FUNCTION fn_marcar_reserva_como_concluido_ou_em_atraso();

CREATE TRIGGER trg_check_pessoa_fisica
BEFORE INSERT OR UPDATE ON "Pessoa_Fisica"
FOR EACH ROW EXECUTE FUNCTION check_pessoa_fisica_tipo();

CREATE TRIGGER trg_check_pessoa_juridica
BEFORE INSERT OR UPDATE ON "Pessoa_Juridica"
FOR EACH ROW EXECUTE FUNCTION check_pessoa_juridica_tipo();