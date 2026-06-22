'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";

export function ItinerarioDetailsDialog({ item }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detalhes: {item.nome_servico}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">Tipo de Evento</h4>
                        <p>{item.tipo_evento || "Não especificado"}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">Roteiro</h4>
                        <p className="text-sm p-3 bg-muted rounded-md">{item.descricao_evento || "Sem descrição disponível."}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}