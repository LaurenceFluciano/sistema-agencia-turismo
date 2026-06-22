import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, Layers, Target } from "lucide-react";

export function ProblemSection() {
  return (
    <div className="space-y-12 mb-12">
      {/* --- CABEÇALHO DA SEÇÃO --- */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">1. DEFINIÇÃO DO PROBLEMA & ESCOPO</h1>
        <p className="text-muted-foreground text-lg">
          Análise das dores de negócio no setor de agenciamento de turismo e a fundamentação da arquitetura do banco de dados.
        </p>
      </div>

      {/* --- AS DORES DE NEGÓCIO VS SOLUÇÃO --- */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" /> Dores Identificadas & Contramedidas
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex justify-between items-start">
                <span>Erros e Retrabalho</span>
                <Badge variant="destructive">Prejuízo Financeiro</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Problema:</strong> Falhas manuais no controle de reservas, emissão de bilhetes e cálculos de margem que geram prejuízos operacionais.</p>
              <p className="text-foreground bg-muted p-2 rounded"><strong>Solução Automatizada:</strong> O motor de banco de dados assume cálculos complexos de forma semiautomática via <code>Procedures</code> e <code>Triggers</code> de atualização de preço, isolando o erro humano.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex justify-between items-start">
                <span>Perda de Tempo</span>
                <Badge variant="destructive">Gargalo de Produtividade</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Problema:</strong> Equipes gastam dezenas de horas cotando e organizando viagens de forma manual através de e-mails e anotações.</p>
              <p className="text-foreground bg-muted p-2 rounded"><strong>Solução Automatizada:</strong> Modelagem de Catálogo (Ofertas de Serviços) estruturada com interfaces CRUD aceleradas, reduzindo o tempo de montagem do roteiro.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex justify-between items-start">
                <span>Falta de Mobilidade</span>
                <Badge variant="destructive">Limitação Logística</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Problema:</strong> Dificuldade extrema para agentes acessarem dados de clientes, vouchers e cronograma operacional fora do escritório.</p>
              <p className="text-foreground bg-muted p-2 rounded"><strong>Solução Automatizada:</strong> Centralização atômica nas tabelas de <code>Itinerario</code> e <code>Reserva_Item</code>, permitindo consultas dinâmicas de rastreabilidade de eventos e vouchers em qualquer lugar.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex justify-between items-start">
                <span>Dados Descentralizados</span>
                <Badge variant="destructive">Inconsistência</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Problema:</strong> Histórico de viagens, preferências de clientes e contatos espalhados em planilhas locais, destruindo a capacidade de fidelização.</p>
              <p className="text-foreground bg-muted p-2 rounded"><strong>Solução Automatizada:</strong> Implantação de uma infraestrutura relacional normalizada com integridade referencial polimórfica estrita.</p>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* --- O ESCOPO: NÍVEL 1 --- */}
      <Card className="border-primary/20 bg-primary/[0.01]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />Primeira Versão da Agência de Turismo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            Garantir o minimo essencial para o sistema resolver os principais problemas. Nesse momento será pensado em um sistema mais interno para garantir o controle operacional e financeiro do negócio. Em outras palavras, um sistema que registra decisões humanas garantindo os seguintes pontos:
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Garantia de existência de Reserva.
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Itens de Reserva referenciando serviços exatos.
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Itinerários mantendo a ordem sequencial lógica.
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Serviços fortemente amarrados a seus respectivos fornecedores.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- MATRIZ DE ENTREGAS DE VALOR --- */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" /> Impacto Direto do Nível Atual
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Mitigação de Erros</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Elimina erros de digitação e duplicações.</li>
              <li>Zera erros de cálculo manual de preço de venda.</li>
              <li>Consistência de dados financeiros e margens de lucro.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Eficiência Operacional</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Montagem ágil de viagens por interfaces centralizadas.</li>
              <li>Reduzir o uso de planilhas e anotações externas.</li>
              <li>Centralização integral da operação em um único repositório.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Rastreabilidade e BI</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Consulta em tempo real de viagens vendidas e status.</li>
              <li>Rastreamento cronológico de eventos e serviços.</li>
              <li>Histórico imutável de modificações e auditoria.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}