import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function FunctionSection({ numberSection }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">{numberSection}. FUNCTIONS</h2>
      <div className="grid gap-6">

        {/* --- CATEGORIA: OPERACIONAL & VALIDAÇÃO --- */}
        
        {/* FUNÇÃO 1 */}
        <Card>
          <CardHeader>
            <CardTitle>fn_validar_periodo</CardTitle>
            <Badge className="w-fit" variant="outline">Operacional / Validação</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong>Regra de Negócio:</strong> Garante a consistência cronológica do sistema. Utiliza o tipo genérico <code>ANYELEMENT</code> para validar se uma data/hora fim é maior ou igual à data/hora início, tratando nulos defensivamente com <code>COALESCE</code>. É marcada como <code>IMMUTABLE</code> para otimização extrema pelo otimizador de consultas do PostgreSQL.
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`CREATE OR REPLACE FUNCTION fn_validar_periodo(data_hora_inicio ANYELEMENT, data_hora_fim ANYELEMENT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(data_hora_fim >= data_hora_inicio, TRUE);
END;
$$ LANGUAGE plpgsql IMMUTABLE;`}
            </pre>
            <p className="text-xs text-muted-foreground"><strong>Exemplo de Uso:</strong> <code>SELECT fn_validar_periodo('2026-06-22 14:00'::TIMESTAMP, '2026-06-22 18:00'::TIMESTAMP);</code></p>
          </CardContent>
        </Card>

        {/* FUNÇÃO 2 */}
        <Card>
          <CardHeader>
            <CardTitle>fn_listar_servicos_por_municipio</CardTitle>
            <Badge className="w-fit" variant="secondary">Operacional / Filtros</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong>Regra de Negócio:</strong> Abstrai o cruzamento de dados entre serviços, municípios e categorias para fornecer uma listagem limpa para componentes front-end de busca geográfica, retornando um conjunto de registros estruturado (<code>RETURNS TABLE</code>).
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`CREATE OR REPLACE FUNCTION fn_listar_servicos_por_municipio(p_id_municipio INT)
RETURNS TABLE (
    id_servico INT,
    nome_servico VARCHAR,
    tipo_servico VARCHAR,
    status_servico tipo_status_servico,
    nome_municipio VARCHAR
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s."id",
        s."nome_oficial",
        ts."nome_tipo",
        s."status",
        m."nome"
    FROM 
        "Servico" s
    JOIN 
        "Municipio" m ON s."id_municipio" = m."id"
    JOIN 
        "Tipo_Servico" ts ON s."id_tipo" = ts."id"
    WHERE 
        s."id_municipio" = p_id_municipio; 
END;
$$;`}
            </pre>
            <p className="text-xs text-muted-foreground"><strong>Exemplo de Uso:</strong> <code>SELECT * FROM fn_listar_servicos_por_municipio(4204606);</code></p>
          </CardContent>
        </Card>

        {/* --- CATEGORIA: FINANCEIRO & BUSINESS INTELLIGENCE --- */}

        {/* FUNÇÃO 3 */}
        <Card>
          <CardHeader>
            <CardTitle>fn_calcular_lucro_periodo</CardTitle>
            <Badge className="w-fit">Financeiro / Auditoria</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong>Regra de Negócio:</strong> Fornece o lucro líquido da agência (Preço de Venda - Custo do Fornecedor) dentro de uma janela temporal. O cálculo ignora reservas canceladas ou em rascunho e valida estritamente os itens cujo itinerário foi efetivamente <code>'CONCLUIDO'</code>.
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`CREATE OR REPLACE FUNCTION fn_calcular_lucro_periodo(
    data_inicio DATE,
    data_fim DATE
)
RETURNS DECIMAL(13,4) AS $$
DECLARE
    v_lucro_total DECIMAL(13,4) := 0;
BEGIN
    SELECT COALESCE(SUM(ri."preco_venda" - ri."custo_fornecedor"), 0)
    INTO v_lucro_total
    FROM "Reserva_Item" ri
    JOIN "Reserva" r ON ri."id_reserva" = r."id"
    JOIN "Itinerario" i ON ri."id_reserva" = i."id_reserva" 
                        AND ri."id_fornecedor_servico" = i."id_fornecedor_servico"
    WHERE r."data_inicio_viagem_utc"::DATE BETWEEN data_inicio AND data_fim
      AND r."status" NOT IN ('RASCUNHO', 'CANCELADA')
      AND i."status" = 'CONCLUIDO';

    RETURN v_lucro_total;
END;
$$ LANGUAGE plpgsql;`}
            </pre>
            <p className="text-xs text-muted-foreground"><strong>Exemplo de Uso:</strong> <code>SELECT fn_calcular_lucro_periodo('2026-01-01', '2026-12-31');</code></p>
          </CardContent>
        </Card>

        {/* FUNÇÃO 4 */}
        <Card>
          <CardHeader>
            <CardTitle>fn_calcular_lucro_reserva</CardTitle>
            <Badge className="w-fit">Financeiro / Operações</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong>Regra de Negócio:</strong> Realiza a apuração do lucro individual de uma única reserva informada. Vincula diretamente as tabelas de itens e itinerários para garantir que valores pendentes ou cancelados na cadeia de execução não distorçam a receita líquida calculada.
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`CREATE OR REPLACE FUNCTION fn_calcular_lucro_reserva(
    p_id_reserva INT
)
RETURNS DECIMAL(13,4) AS $$
DECLARE
    v_lucro_reserva DECIMAL(13,4) := 0;
BEGIN
    SELECT COALESCE(SUM(ri."preco_venda" - ri."custo_fornecedor"), 0)
    INTO v_lucro_reserva
    FROM "Reserva_Item" ri
    JOIN "Itinerario" i ON ri."id_reserva" = i."id_reserva" 
                        AND ri."id_fornecedor_servico" = i."id_fornecedor_servico"
    WHERE ri."id_reserva" = p_id_reserva
      AND i."status" = 'CONCLUIDO';

    RETURN v_lucro_reserva;
END;
$$ LANGUAGE plpgsql;`}
            </pre>
            <p className="text-xs text-muted-foreground"><strong>Exemplo de Uso:</strong> <code>SELECT fn_calcular_lucro_reserva(105);</code></p>
          </CardContent>
        </Card>

      </div>
    </section>
  );
}