import { listarAuditorias } from "@/services/auditoria/audit.repository";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const getOperacaoBadge = (operacao) => {
  const ops = {
    'INSERT': { variant: 'default', label: 'INSERT', className: 'bg-green-600 hover:bg-green-700 text-white' },
    'UPDATE': { variant: 'secondary', label: 'UPDATE', className: 'bg-amber-500 hover:bg-amber-600 text-white' },
    'DELETE': { variant: 'destructive', label: 'DELETE', className: 'bg-red-600 hover:bg-red-700 text-white' }
  };
  return ops[operacao.trim()] || { variant: 'outline', label: operacao };
};

export default async function Page() {
  const logs = await listarAuditorias({ limite: 50 });

  return (
    <main className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Trilha de Auditoria</CardTitle>
          <CardDescription>
            Logs transacionais capturados em tempo real por Triggers no PostgreSQL com persistência em JSONB e indexação GIN.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID Log</TableHead>
                  <TableHead>Tabela</TableHead>
                  <TableHead>Operação SQL</TableHead>
                  <TableHead>Usuário DB</TableHead>
                  <TableHead>Data / Hora (UTC)</TableHead>
                  <TableHead className="text-right">Estrutura JSONB</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Nenhum registro de auditoria encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => {
                    const badgeConfig = getOperacaoBadge(log.operacao);
                    return (
                      <TableRow key={log.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono font-medium text-muted-foreground">
                          #{log.id}
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">
                          {log.nome_tabela}
                        </TableCell>
                        <TableCell>
                          <Badge className={badgeConfig.className}>
                            {badgeConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.usuario_db}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(log.data_hora).toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-xs font-mono bg-muted p-1.5 rounded border border-border inline-block max-w-[200px] truncate" title="Dados gravados de forma dinâmica">
                            {log.operacao.trim() === 'DELETE' 
                              ? JSON.stringify(log.dados_antigos) 
                              : JSON.stringify(log.dados_novos)}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
