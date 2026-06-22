"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useToast } from "../ui/toast";
import { fixEncoding } from "@/lib/utils";

export function CardPacote({ id, nome, status, quantidadeReservada, pacote, onEdit }) {
  const disponivel = status === "DISPONÍVEL";
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  async function handleDelete() {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/pacotes/${encodeURIComponent(String(id))}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.add({ title: "Pacote excluído", description: "Pacote excluído com sucesso.", type: "success" });
        window.location.reload();
      } else {
        toast.add({ title: "Erro ao excluir", description: data.error || "Não foi possível excluir o pacote.", type: "error" });
      }
    } catch (error) {
      console.error("Erro ao excluir pacote:", error);
      toast.add({ title: "Erro ao excluir", description: String(error), type: "error" });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card key={id} className="overflow-hidden flex flex-col justify-between h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{fixEncoding(nome)}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        <Badge
          className={
            disponivel
              ? "border border-emerald-500 text-emerald-600 bg-emerald-500/10"
              : "border border-muted text-muted-foreground"
          }
        >
          {status}
        </Badge>

        <p className="text-sm text-muted-foreground">
          Quantidade Reservada: {quantidadeReservada}
        </p>
      </CardContent>

      <CardFooter className="mt-auto border-t border-dashed pt-4 flex justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Editar pacote" onClick={() => onEdit?.(pacote ?? { id, nome, status, quantidadeReservada })}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Visualizar pacote">
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Mais opções">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" sideOffset={5}>
            <DropdownMenuItem>Itens associados</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
              {isDeleting ? "Removendo..." : "Remover"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
