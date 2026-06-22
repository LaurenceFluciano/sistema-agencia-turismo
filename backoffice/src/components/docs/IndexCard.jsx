import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function IndexSection({
  numberSection,
}) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">
        {numberSection}. ÍNDICES
      </h2>

      <div className="grid gap-4">
        {indexes.map((index) => (
          <IndexCard
            key={index.name}
            {...index}
          />
        ))}
      </div>
    </section>
  );
}

function IndexCard({
  name,
  table,
  columns,
  objective,
  type,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{name}</CardTitle>

        <div className="flex gap-2 mt-1 flex-wrap">
          <Badge variant="outline">
            {type ?? "BTREE"}
          </Badge>

          <Badge variant="secondary">
            {table}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <h4 className="font-medium">Colunas</h4>

          <div className="flex gap-2 flex-wrap mt-2">
            {columns.map((column) => (
              <Badge
                key={column}
                variant="outline"
              >
                {column}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium">Objetivo</h4>
          <p className="text-sm text-muted-foreground">
            {objective}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export const indexes = [
  {
    name: "idx_pagamento_id_reserva",
    table: "Pagamento",
    columns: ["id_reserva"],
    objective:
      "Otimizar consultas de pagamentos por reserva.",
  },

  {
    name: "idx_reserva_id_cliente",
    table: "Reserva",
    columns: ["id_cliente"],
    objective:
      "Otimizar consultas de reservas por cliente.",
  },

  {
    name: "idx_itinerario_reserva",
    table: "Itinerario",
    columns: ["id_reserva"],
    objective:
      "Acelerar buscas de itinerários vinculados a uma reserva.",
  },

  {
    name: "idx_itinerario_status",
    table: "Itinerario",
    columns: ["status"],
    objective:
      "Melhorar filtros por status operacional.",
  },

  {
    name: "idx_servico_municipio",
    table: "Servico",
    columns: ["id_municipio"],
    objective:
      "Acelerar pesquisas de serviços por município.",
  },

  {
    name: "idx_servico_tipo",
    table: "Servico",
    columns: ["id_tipo"],
    objective:
      "Acelerar pesquisas de serviços por categoria.",
  },

  {
    name: "idx_reserva_item_reserva",
    table: "Reserva_Item",
    columns: ["id_reserva"],
    objective:
      "Melhorar a recuperação dos itens pertencentes a uma reserva.",
  },

  {
    name: "idx_fornecedor_servico_pessoa",
    table: "Fornecedor_Servico",
    columns: ["id_pessoa"],
    objective:
      "Acelerar consultas de serviços ofertados por um fornecedor.",
  },

  {
    name: "idx_log_auditoria_tabela",
    table: "Log_Auditoria",
    columns: ["nome_tabela"],
    objective:
      "Facilitar auditorias por tabela.",
  },

  {
    name: "idx_log_auditoria_data",
    table: "Log_Auditoria",
    columns: ["data_hora"],
    objective:
      "Acelerar pesquisas cronológicas de auditoria.",
  },

  {
    name: "idx_log_auditoria_dados_novos",
    table: "Log_Auditoria",
    columns: ["dados_novos"],
    type: "GIN",
    objective:
      "Permitir buscas eficientes dentro dos documentos JSONB auditados.",
  },

  {
    name: "itinerario_id_reserva_id_fornecedor_servico_idx",
    table: "Itinerario",
    columns: ["id_reserva", "id_fornecedor_servico"],
    objective:
      "Otimizar junções e validações envolvendo Reserva_Item.",
  },
];