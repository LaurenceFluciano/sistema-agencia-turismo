import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ItinerarioRegisterForm from "./ItinerarioRegisterForm";
import ItinerarioEditorForm from "./ItinerarioEditorForm";
import ItinerarioFilter from "./ItinerarioFilter";

export default function ItinerarioTabs({ reserva, children }) {
  const status = reserva[0]?.status;

  const isConfirmed = status === 'CONFIRMADA';
  const isFinal = ['CONCLUIDA', 'CANCELADA'].includes(status);


  return (
    <Tabs defaultValue="consultar" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="filtros">Filtros</TabsTrigger>
        

        <TabsTrigger value="criar" disabled={isConfirmed || isFinal}>Criar</TabsTrigger>
        <TabsTrigger 
          value="editar" disabled={isFinal}>Editar</TabsTrigger>
      </TabsList>

      <TabsContent value="filtros">
        <ItinerarioFilter />
      </TabsContent>

      <TabsContent value="criar">
        <ItinerarioRegisterForm 
            reservaId={reserva[0].id}
        />
      </TabsContent>

      <TabsContent value="editar">
        <ItinerarioEditorForm 
            reservaId={reserva[0].id}
            isReservaConfirmada={isConfirmed}
        />
      </TabsContent>
    </Tabs>
  )
}