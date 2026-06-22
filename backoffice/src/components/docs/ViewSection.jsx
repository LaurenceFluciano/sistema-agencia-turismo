import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


export function ViewSection({ numberSection }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">{numberSection}. VIEWS</h2>
      <div className="grid gap-6">
        
        {/* VIEW 1 */}
        <Card>
          <CardHeader>
            <CardTitle>vw_fornecedor_servico_completo</CardTitle>
            <Badge className="w-fit">Consulta de Parceiros</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground"><strong>Regra de Negócio:</strong> Agrega dados de fornecedores e seus respectivos serviços, permitindo uma listagem unificada com localidade e tipo de serviço para o front-end.</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`CREATE OR REPLACE VIEW vw_fornecedor_servico_completo AS
SELECT 
    fs."id" AS id_fornecedor_servico, fs."titulo_comercial" AS nome_comercial,
    p."nome" AS nome_fornecedor_parceiro, s."nome_oficial" AS nome_oficial_servico,
    ts."nome_tipo" AS tipo_servico, fs."status" AS status_fornecedor,
    m."nome" AS municipio_cidade, e."nome" AS nome_estado, e."sigla" AS sigla_estado
FROM "Fornecedor_Servico" fs
JOIN "Pessoa" p ON fs."id_pessoa" = p."id"
JOIN "Servico" s ON fs."id_servico" = s."id"
JOIN "Tipo_Servico" ts ON s."id_tipo" = ts."id"
JOIN "Municipio" m ON s."id_municipio" = m."id"
JOIN "Estado" e ON m."id_estado" = e."id";`}
            </pre>
            <p className="text-xs text-muted-foreground"><strong>Exemplo:</strong> <code>SELECT * FROM vw_fornecedor_servico_completo WHERE status_fornecedor = 'ATIVO';</code></p>
          </CardContent>
        </Card>

        {/* VIEW 2 */}
        <Card>
          <CardHeader>
            <CardTitle>vw_relatorio_itinerario_completo</CardTitle>
            <Badge className="w-fit">Relatório de Itinerários</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground"><strong>Regra de Negócio:</strong> Visão denormalizada dos itinerários. Crucial para exibir detalhes da reserva, nome do cliente e dados do serviço em um único painel.</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`CREATE OR REPLACE VIEW vw_relatorio_itinerario_completo AS
SELECT i."id" AS itinerario_id, r."id" AS reserva_id, p."nome" AS nome_cliente,
       s."nome_oficial" AS nome_servico, i."data_hora_inicio_utc", i."status" AS status_itinerario
FROM "Itinerario" i
JOIN "Reserva" r ON i."id_reserva" = r."id"
JOIN "Pessoa" p ON r."id_cliente" = p."id"
JOIN "Servico" s ON i."id_fornecedor_servico" = s."id";`}
            </pre>
            <p className="text-xs text-muted-foreground"><strong>Exemplo:</strong> <code>SELECT * FROM vw_relatorio_itinerario_completo WHERE reserva_id = 10;</code></p>
          </CardContent>
        </Card>

        {/* VIEW 3 */}
        <Card>
          <CardHeader>
            <CardTitle>vw_pacotes_mais_reservados</CardTitle>
            <Badge className="w-fit">Business Intelligence</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground"><strong>Regra de Negócio:</strong> Indicador de desempenho comercial. Exclui reservas inativas para calcular a receita real de cada pacote.</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`CREATE OR REPLACE VIEW vw_pacotes_mais_reservados AS
SELECT pa."id" AS pacote_id, pa."nome" AS nome_pacote, 
       COUNT(r."id") AS total_reservas, SUM(r."preco_total") AS receita_total_gerada
FROM "Pacote" pa
JOIN "Reserva" r ON r."id_pacote" = pa."id"
WHERE r."status" NOT IN ('CANCELADA', 'RASCUNHO') 
GROUP BY pa."id", pa."nome"
ORDER BY total_reservas DESC;`}
            </pre>
            <p className="text-xs text-muted-foreground"><strong>Exemplo:</strong> <code>SELECT * FROM vw_pacotes_mais_reservados LIMIT 5;</code></p>
          </CardContent>
        </Card>

      </div>
    </section>
  );
}