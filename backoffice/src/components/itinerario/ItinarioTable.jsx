'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"; 
import { useState } from "react";
import { deleteItinerarios } from "@/services/itinerarios/itinerarios.repository";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function ItinerarioTable({ data, idReserva }) {
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState([]);

    const toggleSelect = (id) => {
        setSelectedIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const isAllSelected = data.length > 0 && selectedIds.length === data.length;

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(data.map(item => item.itinerario_id));
        }
    };

    return (
        <div className="rounded-md border">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead className="w-12">
                    <Checkbox 
                        checked={isAllSelected}
                        onCheckedChange={toggleSelectAll}
                    />
                </TableHead>
                <TableHead>Id</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Voucher</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Fim</TableHead>
                <TableHead>Status</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {data.map((item) => (
                <TableRow key={item.itinerario_id} className={selectedIds.includes(item.itinerario_id) ? "bg-slate-100/10" : ""}>
                    <TableCell>
                        <Checkbox 
                            checked={selectedIds.includes(item.itinerario_id)}
                            onCheckedChange={() => toggleSelect(item.itinerario_id)}
                        />
                    </TableCell>
                    <TableCell className="font-medium">{item.itinerario_id}</TableCell>
                    <TableCell className="font-medium">{item.ordem_passo}</TableCell>
                    <TableCell>{item.nome_servico}</TableCell>
                    <TableCell>{item.voucher_codigo}</TableCell>
                    <TableCell>{new Date(item.data_hora_inicio_utc).toLocaleString()}</TableCell>
                    <TableCell>{new Date(item.data_hora_fim_utc).toLocaleString()}</TableCell>
                    <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status_itinerario === 'CONFIRMADO' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {item.status_itinerario}
                        </span>
                    </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>


        {selectedIds.length > 0 && (
            <Button 
                variant="destructive" 
                onClick={async () => {
                    if (!idReserva) return alert("Erro: ID da reserva não encontrado");
                    await deleteItinerarios(selectedIds, idReserva);
                    setSelectedIds([]);
                    router.refresh();
                }}
                className="m-4"
            >
                Remover {selectedIds.length} selecionados
            </Button>
        )}
        </div>
    )
}