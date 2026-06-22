import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TriggerCard({
  name,
  table,
  event,
  functionName,
  objective,
  rule,
  sql,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{name}</CardTitle>

        <div className="flex flex-wrap gap-2 mt-1">
          <Badge variant="outline">{event}</Badge>
          <Badge variant="secondary">{table}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <h4 className="font-medium">Função Executada</h4>
          <p className="text-sm text-muted-foreground">{functionName}</p>
        </div>

        <div>
          <h4 className="font-medium">Objetivo</h4>
          <p className="text-sm text-muted-foreground">{objective}</p>
        </div>

        <div>
          <h4 className="font-medium">Regra de Negócio</h4>
          <p className="text-sm text-muted-foreground">{rule}</p>
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