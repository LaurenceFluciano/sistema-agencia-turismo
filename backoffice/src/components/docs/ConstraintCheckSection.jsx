import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ConstraintCheckSection({
  numberSection,
}) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">
        {numberSection}. CHECK CONSTRAINTS
      </h2>

      <div className="grid gap-4">
        {checkConstraints.map((constraint) => (
          <ConstraintCard
            key={constraint.name}
            {...constraint}
          />
        ))}
      </div>
    </section>
  );
}

function ConstraintCard({
  name,
  table,
  expression,
  objective,
  rule,
  sql,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{name}</CardTitle>

        <div className="flex gap-2 mt-1 flex-wrap">
          <Badge variant="outline">CHECK</Badge>
          <Badge variant="secondary">{table}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <h4 className="font-medium">Expressão</h4>
          <p className="text-sm text-muted-foreground font-mono">
            {expression}
          </p>
        </div>

        <div>
          <h4 className="font-medium">Objetivo</h4>
          <p className="text-sm text-muted-foreground">
            {objective}
          </p>
        </div>

        <div>
          <h4 className="font-medium">Regra de Negócio</h4>
          <p className="text-sm text-muted-foreground">
            {rule}
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Definição</h4>

          <pre className="bg-muted p-3 rounded text-xs font-mono overflow-x-auto">
            <code>{sql}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}


export const checkConstraints = [
  {
    name: "chk_lucro_positivo",
    table: "Reserva_Item",
    expression: '"preco_venda" >= "custo_fornecedor"',
    objective:
      "Garantir que o preço de venda não seja inferior ao custo do fornecedor.",
    rule:
      "Impede que a agência registre prejuízo direto em um item da reserva.",
    sql: `ALTER TABLE "Reserva_Item"
ADD CONSTRAINT "chk_lucro_positivo"
CHECK ("preco_venda" >= "custo_fornecedor");`,
  },

  {
    name: "chk_preco_venda_positivo",
    table: "Reserva_Item",
    expression: '"preco_venda" >= 0',
    objective:
      "Garantir que o preço de venda seja um valor válido.",
    rule:
      "Não permite preços negativos para serviços vendidos ao cliente.",
    sql: `ALTER TABLE "Reserva_Item"
ADD CONSTRAINT "chk_preco_venda_positivo"
CHECK ("preco_venda" >= 0);`,
  },

  {
    name: "chk_custo_fornecedor_positivo",
    table: "Reserva_Item",
    expression: '"custo_fornecedor" >= 0',
    objective:
      "Garantir que o custo informado pelo fornecedor seja válido.",
    rule:
      "Impede o cadastro de custos negativos.",
    sql: `ALTER TABLE "Reserva_Item"
ADD CONSTRAINT "chk_custo_fornecedor_positivo"
CHECK ("custo_fornecedor" >= 0);`,
  },

  {
    name: "chk_preco_totoal_positivo",
    table: "Reserva",
    expression: '"preco_total" >= 0',
    objective:
      "Garantir consistência financeira da reserva.",
    rule:
      "O valor total da reserva nunca pode ser negativo.",
    sql: `ALTER TABLE "Reserva"
ADD CONSTRAINT "chk_preco_totoal_positivo"
CHECK ("preco_total" >= 0);`,
  },

  {
    name: "chk_valor_positivo",
    table: "Pagamento",
    expression: '"valor" >= 0',
    objective:
      "Garantir que pagamentos possuam valores válidos.",
    rule:
      "Não permite registrar pagamentos com valores negativos.",
    sql: `ALTER TABLE "Pagamento"
ADD CONSTRAINT "chk_valor_positivo"
CHECK ("valor" >= 0);`,
  },

  {
    name: "chk_tipo_pessoa",
    table: "Tipo_Pessoa_Papel",
    expression: `"tipo_pessoa" IN ('F', 'J')`,
    objective:
      "Restringir os tipos de pessoa permitidos.",
    rule:
      "Somente pessoas físicas (F) ou jurídicas (J) podem ser associadas aos papéis do sistema.",
    sql: `CONSTRAINT "chk_tipo_pessoa"
CHECK ("tipo_pessoa" IN ('F', 'J'))`,
  },

  {
    name: "Pessoa.tipo",
    table: "Pessoa",
    expression: `"tipo" IN ('F', 'J')`,
    objective:
      "Definir o tipo base da entidade Pessoa.",
    rule:
      "Uma pessoa cadastrada deve ser classificada como Física ou Jurídica.",
    sql: `CHECK ("tipo" IN ('F', 'J'))`,
  },

  {
    name: "Log_Auditoria.operacao",
    table: "Log_Auditoria",
    expression: `"operacao" IN ('INSERT', 'UPDATE', 'DELETE')`,
    objective:
      "Restringir os tipos de operações auditadas.",
    rule:
      "Somente operações de inserção, atualização ou exclusão podem ser registradas na auditoria.",
    sql: `CHECK ("operacao" IN ('INSERT', 'UPDATE', 'DELETE'))`,
  },

  {
    name: "chk_data_hora",
    table: "Itinerario",
    expression:
      'fn_validar_periodo("data_hora_inicio_utc","data_hora_fim_utc")',
    objective:
      "Garantir coerência temporal dos eventos do itinerário.",
    rule:
      "A data de término deve ser igual ou posterior à data de início.",
    sql: `ALTER TABLE "Itinerario"
ADD CONSTRAINT "chk_data_hora"
CHECK (
  fn_validar_periodo(
    "data_hora_inicio_utc",
    "data_hora_fim_utc"
  )
);`,
  },

  {
    name: "chk_data",
    table: "Reserva",
    expression:
      'fn_validar_periodo("data_inicio_viagem_utc","data_fim_viagem_utc")',
    objective:
      "Garantir consistência do período da viagem.",
    rule:
      "A data final da viagem não pode ocorrer antes da data inicial.",
    sql: `ALTER TABLE "Reserva"
ADD CONSTRAINT "chk_data"
CHECK (
  fn_validar_periodo(
    "data_inicio_viagem_utc",
    "data_fim_viagem_utc"
  )
);`,
  },
];