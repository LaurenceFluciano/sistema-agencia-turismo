'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ReservationForm } from "./ReservationForm";
import ReservationItemDialog from "./ReservationItemDialog";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { registerReservation } from "@/services/reservas/reservation.repository";

export default function ReservationDialog({ 
    reserva = null, 
    open,
    onOpenChange 
}) {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const router = useRouter();


    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [reservasItems, setReservasItems] = useState([])


    const [view, setView] = useState('form');

    const formatDecimal = (value) => {
        const num = parseFloat(value);
        return isNaN(num) ? "0.0000" : num.toFixed(4);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        
        const formData = Object.fromEntries(new FormData(e.currentTarget));

        const cliente = clienteSelecionado;

        console.log("CLIENTE NO SUBMIT:", cliente);

        if (!cliente?.id) {
            setError("Cliente não selecionado");
            return;
        }


        const payload = {
            id_cliente: clienteSelecionado?.id ?? null,
            id_pacote: null,
            data_inicio_viagem_utc: formData.inicio_viagem ? new Date(formData.inicio_viagem).toISOString() : null,
            data_fim_viagem_utc: formData.fim_viagem ? new Date(formData.fim_viagem).toISOString() : null,
            preco_total: formatDecimal(formData.orcamento),
            
            items: reservasItems.map(item => ({
                id_fornecedor_servico: item.id_fornecedor_servico,
                custo_fornecedor: formatDecimal(item.custo_fornecedor),
                preco_venda: formatDecimal(item.preco_venda)
            }))
        };

        

        console.log("Payload pronto para o banco:", payload);
            
        const response = await registerReservation(payload, payload.items);

        if(response.success) {
            setSuccess("Reserva salva com sucesso!");
            router.refresh();
        } else {
            setError(response.error);
        }
    }

    const handleUpdateItems = (updatedItems) => {
        setReservasItems(updatedItems);
    };

    return (
        
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`${view === 'items' ? '[&>button]:hidden' : ''} md:min-w-4xl sm:min-w-xl max-h-[90vh] flex flex-col p-0 overflow-hidden`}>

                {view === 'form' ? (

                    <>
                        <div className="p-6 pb-2">
                            <DialogHeader>
                                <DialogTitle>Criar Reserva</DialogTitle>
                            </DialogHeader>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <ReservationForm 
                                initialData={reserva}
                                reservasItems={reservasItems}
                                onUpdateItems={handleUpdateItems}
                                error={error}
                                success={success}
                                onSubmit={handleSubmit} 
                                onOpenItems={() => setView('items')}

                                clienteSelecionado={clienteSelecionado}
                                setClienteSelecionado={setClienteSelecionado}
                            />
                        </div>
                    </>
                ) : (

                    <>
                        <div className="p-6 border-b">
                            <DialogHeader className="flex flex-row items-center justify-between px-2">
                                <DialogTitle>Editar Itens da Reserva</DialogTitle>
                                <Button variant="ghost" size="sm" onClick={() => setView('form')}>
                                    <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
                                </Button>
                            </DialogHeader>
                        </div>
                        <div className="flex-1 overflow-y-auto overflow-x-hidden">
                            <ReservationItemDialog
                                setReservaItems={setReservasItems}
                                onBack={() => setView('form')}
                            />
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
            
    )
}