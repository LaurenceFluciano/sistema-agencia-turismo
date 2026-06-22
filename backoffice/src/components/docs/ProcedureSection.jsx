import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProcedureSection({ numberSection }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">{numberSection}. PROCEDURES</h2>
      <div className="grid gap-6">

        {/* --- CATEGORIA: PRECIFICAÇÃO E FINANCEIRO --- */}

        {/* PROCEDURE 1 */}
        <Card>
          <CardHeader>
            <CardTitle>pd_definir_preco_da_reserva</CardTitle>
            <Badge className="w-fit" variant="default">Financeiro / Margem de Lucro</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong>Regra de Negócio:</strong> Automatiza o cálculo de precificação de um item dentro de uma reserva. Aplica dinamicamente a margem baseada em um percentual de aumento sobre o custo repassado pelo fornecedor parceiro. Se o item não for localizado, emite um aviso em tempo de execução com <code>RAISE WARNING</code> para evitar falhas silenciosas.
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`CREATE OR REPLACE PROCEDURE pd_definir_preco_da_reserva(
    pd_id_reserva INT,
    pd_id_fornecedor_servico INT,
    pd_preco_fornecedor DECIMAL(13,4),
    pd_percentual_aumento NUMERIC(5,2)
)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE "Reserva_Item"
    SET "custo_fornecedor" = pd_preco_fornecedor,
        "preco_venda" = pd_preco_fornecedor * (1 + pd_percentual_aumento / 100.0)
    WHERE "id_reserva" = pd_id_reserva AND "id_fornecedor_servico" = pd_id_fornecedor_servico;

    IF NOT FOUND THEN
        RAISE WARNING 'Reserva % e serviço % não encontrados.', pd_id_reserva, pd_id_fornecedor_servico;
    END IF;
END;
$$;`}
            </pre>
            <p className="text-xs text-muted-foreground"><strong>Exemplo de Uso:</strong> <code>CALL pd_definir_preco_da_reserva(101, 15, 250.00, 15.5);</code></p>
          </CardContent>
        </Card>

        {/* PROCEDURE 2 */}
        <Card>
          <CardHeader>
            <CardTitle>pd_rotina_mudar_pagamentos_cancelados_para_vencidos</CardTitle>
            <Badge className="w-fit" variant="default">Financeiro / Rotina</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong>Regra de Negócio:</strong> Executa a varredura e atualização em lote (batch processing) dos registros de pagamentos. Transforma transações com status <code>PENDENTE</code> cuja data limite expirou em relação ao timestamp atual (<code>NOW()</code>) para o estado de <code>VENCIDO</code>. Ideal para cronjobs e automações noturnas da agência.
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`CREATE OR REPLACE PROCEDURE pd_rotina_mudar_pagamentos_cancelados_para_vencidos()
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE "Pagamento"
    SET "status" = 'VENCIDO'::tipo_status_pagamento
    WHERE "status" = 'PENDENTE'::tipo_status_pagamento 
      AND "data_pagamento_utc" < NOW();

    RAISE NOTICE 'Rotina concluída: Pagamentos atrasados devidamente cancelados.';
END;
$$;`}
            </pre>
            <p className="text-xs text-muted-foreground"><strong>Exemplo de Uso:</strong> <code>CALL pd_rotina_mudar_pagamentos_cancelados_para_vencidos();</code></p>
          </CardContent>
        </Card>

        {/* --- CATEGORIA: OPERACIONAL E PROVEDORES --- */}

        {/* PROCEDURE 3 */}
        <Card>
          <CardHeader>
            <CardTitle>pd_criar_oferta_comercial</CardTitle>
            <Badge className="w-fit" variant="secondary">Operacional / Catálogo</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong>Regra de Negócio:</strong> Garante a idempotência no cadastro do catálogo de ofertas. Primeiramente verifica se o serviço oficial correspondente já existe na base geográfica e tipificada especificada. Caso contrário, realiza o insert dinâmico na tabela pai (<code>Servico</code>) capturando o ID gerado via <code>RETURNING</code>, e em seguida vincula a oferta comercial ao fornecedor.
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`CREATE OR REPLACE PROCEDURE pd_criar_oferta_comercial(
    pd_id_fornecedor INT,
    pd_nome_servico VARCHAR(255),
    pd_id_tipo_servico INT,
    pd_id_municipio INT,
    pd_titulo_comercial VARCHAR(256)
)
LANGUAGE plpgsql AS $$
DECLARE v_id_servico INT;
BEGIN
    SELECT s."id" INTO v_id_servico FROM "Servico" s
    WHERE s."nome_oficial" = pd_nome_servico AND s."id_tipo" = pd_id_tipo_servico AND s."id_municipio" = pd_id_municipio;

    IF NOT FOUND THEN
        INSERT INTO "Servico" ("nome_oficial", "id_tipo", "id_municipio")
        VALUES (pd_nome_servico, pd_id_tipo_servico, pd_id_municipio)
        RETURNING "id" INTO v_id_servico;
    END IF;

    INSERT INTO "Fornecedor_Servico" ("id_pessoa", "id_servico", "titulo_comercial")
    VALUES (pd_id_fornecedor, v_id_servico, pd_titulo_comercial);
END;
$$;`}
            </pre>
            <p className="text-xs text-muted-foreground"><strong>Exemplo de Uso:</strong> <code>CALL pd_criar_oferta_comercial(2, 'Voo Executivo POA-FLN', 1, 4204606, 'Aéreo Executivo Sul');</code></p>
          </CardContent>
        </Card>

        {/* --- CATEGORIA: ENTIDADES E POLIMORFISMO DE PESSOAS --- */}

        {/* PROCEDURE 4 */}
        <Card>
          <CardHeader>
            <CardTitle>pd_cadastrar_pessoa</CardTitle>
            <Badge className="w-fit" variant="outline">Entidade / Polimorfismo</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong>Regra de Negócio:</strong> Gerencia o polimorfismo estrutural (Tabela Base e Subtabelas). Realiza a inserção na tabela pai <code>Pessoa</code> e, conforme a flag discriminadora (<code>F</code> para Física ou <code>J</code> para Jurídica), popula a respectiva extensão relacional. Finaliza iterando sobre um array de inteiros utilizando a estrutura <code>FOREACH</code> para mapear os múltiplos papéis associados.
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`CREATE OR REPLACE PROCEDURE pd_cadastrar_pessoa(
    p_nome VARCHAR(255), p_telefone VARCHAR(15), p_email VARCHAR(320), p_tipo CHAR(1), p_ids_papeis INT[],
    p_cpf CHAR(11) DEFAULT NULL, p_data_nascimento DATE DEFAULT NULL,
    p_razao_social VARCHAR(255) DEFAULT NULL, p_cnpj CHAR(14) DEFAULT NULL
)
LANGUAGE plpgsql AS $$
DECLARE v_id_pessoa INT; v_papel INT;
BEGIN
    INSERT INTO "Pessoa" ("nome", "telefone", "email", "tipo")
    VALUES (p_nome, p_telefone, p_email, p_tipo) RETURNING "id" INTO v_id_pessoa;

    IF p_tipo = 'F' THEN
        INSERT INTO "Pessoa_Fisica" ("id_pessoa", "cpf", "data_nascimento") VALUES (v_id_pessoa, p_cpf, p_data_nascimento);
    ELSIF p_tipo = 'J' THEN
        INSERT INTO "Pessoa_Juridica" ("id_pessoa", "razao_social", "cnpj") VALUES (v_id_pessoa, p_razao_social, p_cnpj);
    ELSE
        RAISE EXCEPTION 'Tipo inválido. Use F ou J.';
    END IF;

    FOREACH v_papel IN ARRAY p_ids_papeis LOOP
        INSERT INTO "Pessoa_Papel" ("id_pessoa", "id_papel") VALUES (v_id_pessoa, v_papel) ON CONFLICT DO NOTHING;
    END LOOP;
END;
$$;`}
            </pre>
          </CardContent>
        </Card>

        {/* PROCEDURE 5 */}
        <Card>
          <CardHeader>
            <CardTitle>pd_atualizar_pessoa</CardTitle>
            <Badge className="w-fit" variant="outline">Entidade / Mutação polimórfica</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong>Regra de Negócio:</strong> Trata de forma segura a mutação de dados e herança. Ao alterar uma pessoa, ela sincroniza a tabela genérica e avalia dinamicamente os dados específicos. Utiliza a instrução <code>ON CONFLICT (...) DO UPDATE</code> para atualizar dados legados e realiza o <code>DELETE</code> profilático na tabela oposta, garantindo integridade exclusiva.
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`CREATE OR REPLACE PROCEDURE pd_atualizar_pessoa(
    p_id_pessoa INT, p_nome VARCHAR(255), p_telefone VARCHAR(15), p_email VARCHAR(320), p_tipo CHAR(1),
    p_cpf CHAR(11) DEFAULT NULL, p_data_nascimento DATE DEFAULT NULL,
    p_razao_social VARCHAR(255) DEFAULT NULL, p_cnpj CHAR(14) DEFAULT NULL
)
LANGUAGE plpgsql AS $$
BEGIN
    -- ... verificação de existência ...
    UPDATE "Pessoa" SET nome = p_nome, telefone = p_telefone, email = p_email, tipo = p_tipo WHERE id = p_id_pessoa;

    IF p_tipo = 'F' THEN
        INSERT INTO "Pessoa_Fisica" ("id_pessoa", "cpf", "data_nascimento") VALUES (p_id_pessoa, p_cpf, p_data_nascimento)
        ON CONFLICT ("id_pessoa") DO UPDATE SET cpf = EXCLUDED.cpf, data_nascimento = EXCLUDED.data_nascimento;
        DELETE FROM "Pessoa_Juridica" WHERE "id_pessoa" = p_id_pessoa;
    ELSIF p_tipo = 'J' THEN
        INSERT INTO "Pessoa_Juridica" ("id_pessoa", "razao_social", "cnpj") VALUES (p_id_pessoa, p_razao_social, p_cnpj)
        ON CONFLICT ("id_pessoa") DO UPDATE SET razao_social = EXCLUDED.razao_social, cnpj = EXCLUDED.cnpj;
        DELETE FROM "Pessoa_Fisica" WHERE "id_pessoa" = p_id_pessoa;
    END IF;
END;
$$;`}
            </pre>
          </CardContent>
        </Card>

        {/* PROCEDURE 6 */}
        <Card>
          <CardHeader>
            <CardTitle>pd_atualizar_papeis_pessoa</CardTitle>
            <Badge className="w-fit" variant="outline">Entidade / Relacionamentos</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong>Regra de Negócio:</strong> Limpa de forma atômica a tabela associativa n:m para a entidade selecionada (evitando órfãos ou inconsistências históricas) e reconstrói a matriz de autorizações/papéis através de carga em array parametrizada.
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`CREATE OR REPLACE PROCEDURE pd_atualizar_papeis_pessoa(
    p_id_pessoa INT,
    p_ids_papeis INT[]
)
LANGUAGE plpgsql AS $$
DECLARE v_papel INT;
BEGIN
    DELETE FROM "Pessoa_Papel" WHERE "id_pessoa" = p_id_pessoa;

    FOREACH v_papel IN ARRAY p_ids_papeis LOOP
        INSERT INTO "Pessoa_Papel" ("id_pessoa", "id_papel") VALUES (p_id_pessoa, v_papel);
    END LOOP;
END;
$$;`}
            </pre>
          </CardContent>
        </Card>

      </div>
    </section>
  );
}