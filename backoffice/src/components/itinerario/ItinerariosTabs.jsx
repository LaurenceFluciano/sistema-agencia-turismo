import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ItinerarioRegisterForm from "./ItinerarioRegisterForm";
import ItinerarioEditorForm from "./ItinerarioEditorForm";

export default function ItinerarioTabs({ reserva, children }) {
  const isConcluido = reserva[0]?.status === 'CONCLUIDO' || reserva[0]?.status === 'CONFIRMADA';

  return (
    <Tabs defaultValue="consultar" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="filtros">Filtros</TabsTrigger>
        

        <TabsTrigger value="criar" disabled={isConcluido}>Criar</TabsTrigger>
        <TabsTrigger value="editar" disabled={isConcluido}>Editar</TabsTrigger>
      </TabsList>

      <TabsContent value="filtros">
        {/* Sua Tabela de consulta */}
      </TabsContent>

      <TabsContent value="criar">
        <ItinerarioRegisterForm 
            reservaId={reserva[0].id}
        />
      </TabsContent>

      <TabsContent value="editar">
        <ItinerarioEditorForm 
            reservaId={reserva[0].id}
        />
      </TabsContent>
    </Tabs>
  )
}