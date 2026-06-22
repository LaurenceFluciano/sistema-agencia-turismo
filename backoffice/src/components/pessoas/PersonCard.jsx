'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, FileText, Ellipsis } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/toast";

import { useRouter } from "next/navigation"
import PersonDialog from "./PersonDialog";
import { useState } from "react";

export default function PersonCard({
    pessoa
}) {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(null)

    const getInitials = (name) => {
        return name ? name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() : "CL";
    };

    const router = useRouter()
    const toast = useToast();

    const isAtivo = pessoa.status?.toLowerCase() === "ativo";

    const handleDelete = async (personId) => {
      try {
        if (!personId) {
          throw new Error("ID de pessoa inválido no cliente.");
        }

        const response = await fetch(`/api/pessoas/${personId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Não foi possível excluir a pessoa.");
        }

        toast.add({
          title: "Pessoa excluída",
          description: data.message || "Exclusão realizada com sucesso.",
          type: "success",
        });

        router.refresh();
      } catch (error) {
        toast.add({
          title: "Erro ao excluir",
          description: String(error.message || error),
          type: "error",
        });
      }
    }

    return (
    <>
      <PersonDialog
        pessoa={selected}
        open={open}
        onOpenChange={setOpen}
      />
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md border-border">
          
          <CardHeader className="flex flex-row items-center gap-4 py-4 mb-auto border-b border-border bg-muted/20">
            <Avatar className="h-12 w-12 border border-border">

              <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-sm">
                {getInitials(pessoa.nome)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col flex-1 min-w-0">

              <CardTitle className="text-lg font-bold text-card-foreground truncate">
                {pessoa.nome}
              </CardTitle>
              
              
              <span className={`inline-flex items-center w-max px-2 py-0.5 mt-1 rounded-full text-xs font-medium border ${
                isAtivo 
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30" 
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400 dark:border-amber-500/30"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${isAtivo ? "bg-emerald-500" : "bg-amber-500"}`} />
                {pessoa.status}
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2.5 min-w-0">
              {pessoa.email ? (
                <>
                  <Mail className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                  <span className="truncate text-card-foreground">{pessoa.email}</span>
                </>
              ) : (
                <p className="text-xs text-muted-foreground italic">Email não informado</p>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              {pessoa.telefone ? (
                <>
                  <Phone className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                  <span className="text-card-foreground">{pessoa.telefone}</span>
                </>
              ) : (
                <p className="text-xs text-muted-foreground italic">Telefone não informado</p>
              )}
            </div>


            <div className="flex items-center gap-2.5 pt-2 border-t border-border text-xs font-mono">
              {(pessoa.cpf || pessoa.cnpj) ? (
                <>
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                  <span>
                    {pessoa.cpf ? `CPF: ${pessoa.cpf}` : `CNPJ: ${pessoa.cnpj}`}
                  </span>
                </>
              ) : (
                <p className="text-xs text-muted-foreground italic">CPF não informado</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="mt-auto">
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-auto">
                <Ellipsis className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end" sideOffset={5}>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                    setSelected(pessoa)
                    setOpen(true)
                  }}
                >
                  Editar
                </DropdownMenuItem>

                <DropdownMenuItem 
                  className="text-red-400" 
                  onSelect={() => handleDelete(pessoa.id)}
                >
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
    </>
    )
}