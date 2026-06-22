import ItinerarioTable from "@/components/itinerario/ItinarioTable";
import ItinerarioTabs from "@/components/itinerario/ItinerariosTabs";
import { buildItinerarioFilters } from "@/services/itinerarios/itinerarios.filter";
import { fetchItinerarios } from "@/services/itinerarios/itinerarios.repository";
import { getReservationById } from "@/services/reservas/reservation.repository";


export default async function ItinerarioPage({ params, searchParams }) {
  const { id_reserva } = await params;
  const resolvedSearchParams = await searchParams;


  const filters = buildItinerarioFilters(resolvedSearchParams || {});
  
  const itinerarios = await fetchItinerarios(id_reserva, filters);
  const reserva = await getReservationById(id_reserva)


  return (
    <>
    <aside className="w-1/3 border-r p-6 bg-muted/20">
        <h2 className="font-bold mb-4">Gerenciar Itinerário</h2>

        <ItinerarioTabs 
            reserva={reserva}
        />
    </aside>

    <main className="flex-1 p-6">

        <h1 className="text-xl mb-4">Itinerários da Reserva {id_reserva}</h1>
        <ItinerarioTable
            data={itinerarios}
            idReserva={id_reserva}
        />

    </main>

    </>

  );
}