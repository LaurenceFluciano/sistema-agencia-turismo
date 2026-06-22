'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

/*import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"*/


import { useState } from "react";
import { Button } from "../ui/button";
import { CalendarDays, DollarSign, MoreVertical, Package } from "lucide-react";
import ReservationDialog from "./ReservationDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import ReservationItemDialog from "./ReservationItemDialog";
import PackageDialog from "./PackageDialog";
import Link from "next/link";
import { deleteReservationById } from "@/services/reservas/reservation.repository";
import { useRouter } from "next/navigation";


export default function ReservationCard({
    reserva
}) {
    const [openEdit, setOpenEdit] = useState(false)
    const [selectedReservation, setSelectedReservation] = useState(null)

    const  router  = useRouter()


    const [itemDialogOpen, setItemDialogOpen] = useState(false);
    const [pkgOpen, setPkgOpen] = useState(false);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-BR');

    const statusColors = {
        'CONFIRMADA': "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        'PENDENTE': "bg-amber-500/10 text-amber-600 border-amber-500/20",
        'CANCELADA': "bg-red-500/10 text-red-600 border-red-500/20",
        'CONCLUIDA': "bg-blue-500/10 text-blue-600 border-blue-500/20",
        'RASCUNHO': "bg-slate-500/10 text-slate-600 border-slate-500/20"
    };


    return (
    <>
      <ReservationDialog
        reserva={selectedReservation}
        open={openEdit}
        onOpenChange={setOpenEdit}
      />
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md border-border">
          
          <CardHeader className="flex flex-row justify-between items-center py-4 mb-auto border-b border-border bg-muted/20">
              <CardTitle className="flex flex-row items-center justify-between py-2 px-4 rounded-md  bg-muted text-md font-bold">
                  ID: #{reserva.id}
              </CardTitle>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ml-auto mr-2 font-bold border ${statusColors[reserva.status] || statusColors['RASCUNHO']}`}>
                  {reserva.status}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger>
                    <MoreVertical className="cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" sideOffset={5}>
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault()
                            setSelectedReservation(reserva)
                            setOpenEdit(true)
                        }}
                    >
                    Editar
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                        className="text-red-400"
                        onClick={async () => {
                            const result = await deleteReservationById(reserva.id)

                            alert(result.message)
                            router.refresh()
                        }}
                    >
                    Remover
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
          </CardHeader>

          <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">Cliente: {reserva.nome_cliente || "N/A"}</p>
                    
                <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>{formatDate(reserva.data_inicio_viagem_utc)} até {formatDate(reserva.data_fim_viagem_utc)}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium text-foreground">Total: R$ {Number(reserva.preco_total).toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium text-foreground">Orçamento: R$ {Number(reserva.orcamento).toFixed(2)}</span>
                </div>


                <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>{reserva.nome_pacote || "Pacote personalizado"}</span>
                </div>
          </CardContent>

          <CardFooter className="flex my-auto px-4 justify-between">
            <Button 
                variant="outline" 
                className="text-md text-muted-foreground hover:text-primary" 
                onClick={() => setItemDialogOpen(true)}
            >
                Itens
            </Button>
            <Button 
                variant="outline" 
                className="text-md text-muted-foreground hover:text-primary"
                onClick={() => setPkgOpen(true)}
                >Pacotes</Button>
            <Button 
                variant="outline" 
                className="text-md text-muted-foreground hover:text-primary"
            >
                <Link href={`/itinerario/${reserva.id}`}>
                    Itinerários
                </Link>
        </Button>
          </CardFooter>
        </Card>

        <ReservationItemDialog 
            reservaId={reserva.id} 
            open={itemDialogOpen} 
            onOpenChange={setItemDialogOpen} 
        />

        <PackageDialog 
            reserva={reserva}
            open={pkgOpen} 
            onOpenChange={setPkgOpen} 
        />
    </>
    )
}