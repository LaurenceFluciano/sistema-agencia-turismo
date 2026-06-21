'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

/*import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"*/


import { useRouter } from "next/navigation"
import { useState } from "react";
import { Button } from "../ui/button";
import { CalendarDays, DollarSign, Package } from "lucide-react";


export default function ReservationCard({
    reserva
}) {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(null)
    const router = useRouter()

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
      {/*<ReservationCard
        pessoa={selected}
        open={open}
        onOpenChange={setOpen}
      />*/}
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md border-border">
          
          <CardHeader className="flex flex-row justify-between items-center py-4 mb-auto border-b border-border bg-muted/20">
              <CardTitle className="flex flex-row items-center justify-between py-2 px-4 rounded-md  bg-muted text-md font-bold">
                  ID: #{reserva.id}
              </CardTitle>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[reserva.status] || statusColors['RASCUNHO']}`}>
                  {reserva.status}
              </span>
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
                  <Package className="h-4 w-4" />
                  <span>{reserva.nome_pacote || "Pacote personalizado"}</span>
              </div>
          </CardContent>

          <CardFooter className="flex my-auto px-4 justify-between">
            <Button variant="outline" className="text-md text-muted-foreground hover:text-primary">Itens</Button>
            <Button variant="outline" className="text-md text-muted-foreground hover:text-primary">Passageiros</Button>
            <Button variant="outline" className="text-md text-muted-foreground hover:text-primary">Itinerários</Button>
          </CardFooter>
        </Card>
    </>
    )
}