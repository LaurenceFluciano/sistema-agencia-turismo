'use client'
import { useFilters } from "@/lib/useFilters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";

export default function ItinerarioFilter() {
    const { setFilter } = useFilters();

    return (
        <div className="flex flex-wrap gap-4 p-4 border rounded-lg">
            
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Buscar Roteiro</label>
                <Input 
                    placeholder="Nome do serviço ou evento..."
                    onChange={(e) => setFilter("searchByRoteiro", e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Status</label>
                <Select onValueChange={(value) => setFilter("status", value === "all" ? undefined : value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="RASCUNHO">Rascunho</SelectItem>
                        <SelectItem value="AGENDADO">Agendado</SelectItem>
                        <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                        <SelectItem value="CANCELADO">Cancelado</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}