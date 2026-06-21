'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ReservationForm } from "./ReservationForm";

import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { listReservationItemsByReservationId, registerReservation, updateReservation } from "@/services/reservas/reservation.repository";
import OffersItemDialog from "./OffersItemDialog";

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
    const [dataFim, setDataFim] = useState(null)
    const [dataInicio, setDataInicio] = useState(null)
    const [orcamento, setOrcamento] = useState("")

    const [view, setView] = useState('form');


    useEffect(() => {
        if (!reserva) return;

        if (reserva.id_cliente) {
            const cliente = {
                id: reserva.id_cliente,
                nome_cliente: reserva.nome_cliente,
                cpf: reserva?.cpf,
                email: reserva?.email
            }

            setClienteSelecionado(cliente);
        } else {
            setClienteSelecionado(null);
        }


        setDataInicio(
            reserva.data_inicio_viagem_utc
                ? new Date(reserva.data_inicio_viagem_utc)
                : null
        );

        setDataFim(
            reserva.data_fim_viagem_utc
                ? new Date(reserva.data_fim_viagem_utc)
                : null
        );

        setOrcamento(reserva.orcamento ?? "");

    }, [reserva]);

    useEffect(() => {
        async function adicionarItemsReserva() {
            if (!reserva?.id) return;

            const items = await listReservationItemsByReservationId(reserva.id);

            if (items?.length > 0) {
                setReservasItems(items);
            } else {
                setReservasItems([]);
            }
        }

        adicionarItemsReserva();

        return () => {}
    }, [reserva?.id]);

    const formatDecimal = (value) => {
        const num = parseFloat(value);
        return isNaN(num) ? "0.0000" : num.toFixed(4);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        
        const isEdit = !!reserva?.id;

        const cliente = clienteSelecionado;

        if (!cliente?.id) {
            setError("Cliente não selecionado");
            return;
        }

        const itemsParaSalvar = reservasItems.filter(item => !item.gerado_pelo_pacote);

        const payload = {
            id_reserva: reserva?.id ?? null,
            id_cliente: clienteSelecionado?.id ?? null,
            data_inicio_viagem_utc: dataInicio ? new Date(dataInicio).toISOString() : null,
            data_fim_viagem_utc: dataFim ? new Date(dataFim).toISOString() : null,
            orcamento: formatDecimal(orcamento),
            
            items: itemsParaSalvar.map(item => ({
                id_fornecedor_servico: item.id_fornecedor_servico,
                custo_fornecedor: 0,
                preco_venda: 0,
                gerado_pelo_pacote: false
            }))
        };

        

        console.log("Payload pronto para o banco:", payload);
                
        const response = isEdit
            ? await updateReservation(payload, payload.items)
            : await registerReservation(payload, payload.items);

            if(response.success) {
                setSuccess("Reserva salva com sucesso!");
                router.refresh();

                setDataInicio(null);
                setDataFim(null);
                setOrcamento("");
                setClienteSelecionado(null);
                setReservasItems([])
            } else {
                setError(response.error);
            }
    }

    const handleUpdateItems = (items) => {
        setReservasItems(items)
    }


    return (
        
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`${view === 'items' ? '[&>button]:hidden' : ''} md:min-w-4xl sm:min-w-xl max-h-[90vh] flex flex-col p-0 overflow-hidden`}>

                {view === 'form' && (

                    <>
                        <div className="p-6 pb-2">
                            <DialogHeader>
                                <DialogTitle>{ !!reserva ?  ( "Editar Reserva" ) : ( "Criar Reserva" )  }</DialogTitle>
                            </DialogHeader>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <ReservationForm 
                                reservasItems={reservasItems}
                                error={error}
                                success={success}
                                onSubmit={handleSubmit} 

                                onOpenItems={() => setView('items')}

                                clienteSelecionado={clienteSelecionado}
                                setClienteSelecionado={setClienteSelecionado}

                                onUpdateItems={handleUpdateItems}

                                dataFim={dataFim}
                                dataInicio={dataInicio}
                                setDataFim={setDataFim}
                                setDataInicio={setDataInicio}

                                orcamento={orcamento}
                                setOrcamento={setOrcamento}
                            />
                        </div>
                    </>
                )}
                
                {view === "items" && (

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
                            <OffersItemDialog
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