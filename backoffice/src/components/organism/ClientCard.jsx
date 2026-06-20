import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, FileText } from "lucide-react";

export default function ClientCard({
    cliente
}) {
    const getInitials = (name) => {
        return name ? name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() : "CL";
    };

    const isAtivo = cliente.status?.toLowerCase() === "ativo";

    return (
         <Card className="overflow-hidden transition-all duration-200 hover:shadow-md border-border">
             
              <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-border bg-muted/20">
                <Avatar className="h-12 w-12 border border-border">

                  <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-sm">
                    {getInitials(cliente.nome)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col flex-1 min-w-0">

                  <CardTitle className="text-lg font-bold text-card-foreground truncate">
                    {cliente.nome}
                  </CardTitle>
                  
                 
                  <span className={`inline-flex items-center w-max px-2 py-0.5 mt-1 rounded-full text-xs font-medium border ${
                    isAtivo 
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30" 
                      : "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400 dark:border-amber-500/30"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${isAtivo ? "bg-emerald-500" : "bg-amber-500"}`} />
                    {cliente.status}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-5 space-y-3 text-sm text-muted-foreground">
                {cliente.email && (
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                    <span className="truncate text-card-foreground">{cliente.email}</span>
                  </div>
                )}
                
                {cliente.telefone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                    <span className="text-card-foreground">{cliente.telefone}</span>
                  </div>
                )}
                
                {(cliente.cpf || cliente.cnpj) && (
                  <div className="flex items-center gap-2.5 pt-2 border-t border-border text-xs font-mono">
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                    <span>
                      {cliente.cpf ? `CPF: ${cliente.cpf}` : `CNPJ: ${cliente.cnpj}`}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
    )
}