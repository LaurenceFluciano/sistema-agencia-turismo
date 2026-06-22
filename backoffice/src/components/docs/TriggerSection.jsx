import TriggerCard from "./TriggerCard";

export function TriggerSection({ numberSection }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">
        {numberSection}. TRIGGERS
      </h2>

      <div className="grid gap-8">

        <div>
            <h3 className="text-lg font-medium mb-3">
                Auditoria
            </h3>

            <div className="grid gap-4">
                {triggers.map((trigger) => (
                    <TriggerCard
                    key={trigger.name}
                    {...trigger}
                    />
                ))}
            </div>
        </div>

      </div>
    </section>
  );
}

export const triggers = [
  // =====================================================
  // AUDITORIA
  // =====================================================
  {
    category: "Auditoria",
    name: "tg_atualiza_data_atualizacao_servico",
    table: "Servico",
    event: "BEFORE UPDATE",
    functionName: "fn_atualiza_data_atualizacao()",
    objective: "Atualizar automaticamente a data da última modificação de um serviço.",
    rule: "Sempre que um serviço for alterado, o campo data_atualizacao recebe a data e hora atual.",
    sql: `CREATE OR REPLACE TRIGGER tg_atualiza_data_atualizacao_servico
BEFORE UPDATE ON "Servico"
FOR EACH ROW
EXECUTE FUNCTION fn_atualiza_data_atualizacao();`,
  },

  {
    category: "Auditoria",
    name: "tg_atualiza_data_atualizacao_fornecedor_servico",
    table: "Fornecedor_Servico",
    event: "BEFORE UPDATE",
    functionName: "fn_atualiza_data_atualizacao()",
    objective: "Atualizar automaticamente a data da última modificação de uma oferta comercial.",
    rule: "Garante o registro automático da última alteração realizada na oferta do fornecedor.",
    sql: `CREATE OR REPLACE TRIGGER tg_atualiza_data_atualizacao_fornecedor_servico
BEFORE UPDATE ON "Fornecedor_Servico"
FOR EACH ROW
EXECUTE FUNCTION fn_atualiza_data_atualizacao();`,
  },

  // =====================================================
  // PESSOAS E PAPÉIS
  // =====================================================

  {
    category: "Pessoas e Papéis",
    name: "tg_verificar_papel_tipo_pessoa",
    table: "Pessoa_Papel",
    event: "BEFORE INSERT OR UPDATE",
    functionName: "fn_validar_papel_pessoa()",
    objective: "Validar se o papel atribuído é compatível com o tipo da pessoa.",
    rule: "Impede que uma pessoa receba papéis não permitidos pela matriz Tipo_Pessoa_Papel.",
    sql: `CREATE OR REPLACE TRIGGER tg_verificar_papel_tipo_pessoa
BEFORE UPDATE OR INSERT ON "Pessoa_Papel"
FOR EACH ROW
EXECUTE FUNCTION fn_validar_papel_pessoa();`,
  },

  {
    category: "Pessoas e Papéis",
    name: "trg_check_pessoa_fisica",
    table: "Pessoa_Fisica",
    event: "BEFORE INSERT OR UPDATE",
    functionName: "check_pessoa_fisica_tipo()",
    objective: "Garantir que apenas pessoas físicas sejam cadastradas na tabela Pessoa_Fisica.",
    rule: "Bloqueia registros cujo tipo da pessoa não seja 'F'.",
    sql: `CREATE TRIGGER trg_check_pessoa_fisica
BEFORE INSERT OR UPDATE ON "Pessoa_Fisica"
FOR EACH ROW
EXECUTE FUNCTION check_pessoa_fisica_tipo();`,
  },

  {
    category: "Pessoas e Papéis",
    name: "trg_check_pessoa_juridica",
    table: "Pessoa_Juridica",
    event: "BEFORE INSERT OR UPDATE",
    functionName: "check_pessoa_juridica_tipo()",
    objective: "Garantir que apenas pessoas jurídicas sejam cadastradas na tabela Pessoa_Juridica.",
    rule: "Bloqueia registros cujo tipo da pessoa não seja 'J'.",
    sql: `CREATE TRIGGER trg_check_pessoa_juridica
BEFORE INSERT OR UPDATE ON "Pessoa_Juridica"
FOR EACH ROW
EXECUTE FUNCTION check_pessoa_juridica_tipo();`,
  },

  // =====================================================
  // RESERVAS
  // =====================================================

  {
    category: "Reservas",
    name: "tg_copiar_itens_pacote_reserva",
    table: "Reserva",
    event: "AFTER INSERT OR UPDATE OF id_pacote",
    functionName: "fn_copiar_itens_pacote_para_reserva()",
    objective: "Popular automaticamente os itens da reserva a partir de um pacote.",
    rule: "Ao associar um pacote à reserva, todos os itens do pacote são copiados para Reserva_Item.",
    sql: `CREATE TRIGGER tg_copiar_itens_pacote_reserva
AFTER INSERT OR UPDATE OF "id_pacote" ON "Reserva"
FOR EACH ROW
EXECUTE FUNCTION fn_copiar_itens_pacote_para_reserva();`,
  },

  {
    category: "Reservas",
    name: "tg_remover_itens_pacote_reserva",
    table: "Reserva",
    event: "AFTER UPDATE",
    functionName: "fn_remover_itens_pacote_da_reserva()",
    objective: "Remover itens gerados por pacote quando o vínculo for removido.",
    rule: "Ao definir id_pacote como NULL, os itens gerados automaticamente são removidos.",
    sql: `CREATE OR REPLACE TRIGGER tg_remover_itens_pacote_reserva
AFTER UPDATE ON "Reserva"
FOR EACH ROW
WHEN (NEW."id_pacote" IS NULL)
EXECUTE FUNCTION fn_remover_itens_pacote_da_reserva();`,
  },

  {
    category: "Reservas",
    name: "tg_atualizar_total_reserva",
    table: "Reserva_Item",
    event: "AFTER INSERT OR UPDATE OR DELETE",
    functionName: "fn_atualizar_total_reserva()",
    objective: "Manter o valor total da reserva sincronizado com seus itens.",
    rule: "Qualquer alteração em Reserva_Item recalcula automaticamente o preço total da reserva.",
    sql: `CREATE OR REPLACE TRIGGER tg_atualizar_total_reserva
AFTER UPDATE OR INSERT OR DELETE ON "Reserva_Item"
FOR EACH ROW
EXECUTE FUNCTION fn_atualizar_total_reserva();`,
  },

  {
    category: "Reservas",
    name: "trg_check_insert_reserva_item",
    table: "Reserva_Item",
    event: "BEFORE INSERT",
    functionName: "fn_check_insert_reserva_item()",
    objective: "Impedir inclusão de itens em reservas fora do estado de rascunho.",
    rule: "Somente reservas em RASCUNHO podem receber novos itens.",
    sql: `CREATE TRIGGER trg_check_insert_reserva_item
BEFORE INSERT ON "Reserva_Item"
FOR EACH ROW
EXECUTE FUNCTION fn_check_insert_reserva_item();`,
  },

  // =====================================================
  // ITINERÁRIOS
  // =====================================================

  {
    category: "Itinerários",
    name: "trg_check_insert_itinerario",
    table: "Itinerario",
    event: "BEFORE INSERT",
    functionName: "fn_check_insert_itinerario()",
    objective: "Controlar a criação de etapas operacionais da viagem.",
    rule: "Impede criar itinerários para reservas que não estejam em estado apropriado.",
    sql: `CREATE TRIGGER trg_check_insert_itinerario
BEFORE INSERT ON "Itinerario"
FOR EACH ROW
EXECUTE FUNCTION fn_check_insert_itinerario();`,
  },

  {
    category: "Itinerários",
    name: "trg_check_update_itinerario",
    table: "Itinerario",
    event: "BEFORE UPDATE OF status",
    functionName: "fn_check_update_itinerario()",
    objective: "Validar alterações de status dos itinerários.",
    rule: "Impede transições inválidas de estado durante a execução operacional da reserva.",
    sql: `CREATE TRIGGER trg_check_update_itinerario
BEFORE UPDATE OF status ON "Itinerario"
FOR EACH ROW
EXECUTE FUNCTION fn_check_update_itinerario();`,
  },

  // =====================================================
  // FLUXO DE STATUS DA RESERVA
  // =====================================================

  {
    category: "Fluxo da Reserva",
    name: "trg_reserva_confirmada",
    table: "Reserva",
    event: "AFTER UPDATE OF status",
    functionName: "fn_reserva_confirmada()",
    objective: "Executar ações automáticas quando a reserva for confirmada.",
    rule: "Atualiza entidades dependentes necessárias para iniciar a execução da viagem.",
    sql: `CREATE TRIGGER trg_reserva_confirmada
AFTER UPDATE OF status ON "Reserva"
FOR EACH ROW
WHEN (NEW.status = 'CONFIRMADA')
EXECUTE FUNCTION fn_reserva_confirmada();`,
  },

  {
    category: "Fluxo da Reserva",
    name: "trg_reserva_cancelada",
    table: "Reserva",
    event: "AFTER UPDATE OF status",
    functionName: "fn_reserva_cancelada()",
    objective: "Executar rotinas de cancelamento da reserva.",
    rule: "Remove ou atualiza registros dependentes conforme as regras de cancelamento.",
    sql: `CREATE TRIGGER trg_reserva_cancelada
AFTER UPDATE OF status ON "Reserva"
FOR EACH ROW
WHEN (NEW.status = 'CANCELADA')
EXECUTE FUNCTION fn_reserva_cancelada();`,
  },

  {
    category: "Fluxo da Reserva",
    name: "trg_reserva_concluida",
    table: "Reserva",
    event: "AFTER UPDATE OF status",
    functionName: "fn_reserva_concluida()",
    objective: "Finalizar automaticamente o fluxo operacional da reserva.",
    rule: "Atualiza os registros relacionados para refletir a conclusão da viagem.",
    sql: `CREATE TRIGGER trg_reserva_concluida
AFTER UPDATE OF status ON "Reserva"
FOR EACH ROW
WHEN (NEW.status = 'CONCLUIDA')
EXECUTE FUNCTION fn_reserva_concluida();`,
  },

  // =====================================================
  // PAGAMENTOS
  // =====================================================

  {
    category: "Pagamentos",
    name: "trg_validar_pagamento_pago",
    table: "Pagamento",
    event: "BEFORE INSERT OR UPDATE",
    functionName: "fn_validar_pagamento_pago()",
    objective: "Garantir consistência financeira dos pagamentos.",
    rule: "Pagamentos marcados como PAGO devem possuir valor positivo.",
    sql: `CREATE TRIGGER trg_validar_pagamento_pago
BEFORE INSERT OR UPDATE ON "Pagamento"
FOR EACH ROW
EXECUTE FUNCTION fn_validar_pagamento_pago();`,
  },

  {
    category: "Pagamentos",
    name: "trg_validar_status_reserva",
    table: "Pagamento",
    event: "BEFORE INSERT",
    functionName: "fn_validar_status_reserva_pagamento()",
    objective: "Impedir pagamentos em reservas inválidas.",
    rule: "Bloqueia pagamentos vinculados a reservas em RASCUNHO ou CANCELADA.",
    sql: `CREATE TRIGGER trg_validar_status_reserva
BEFORE INSERT ON "Pagamento"
FOR EACH ROW
EXECUTE FUNCTION fn_validar_status_reserva_pagamento();`,
  },
];