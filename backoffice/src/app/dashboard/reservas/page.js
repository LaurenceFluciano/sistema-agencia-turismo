import ReservationActions from "@/components/reservas/ReservationActions";
import ReservationCard from "@/components/reservas/ReservationCard";
import { buildReservationFilters } from "@/services/reservas/reservation.filter";
import { listReservations } from "@/services/reservas/reservation.repository";

export default async function Page({ searchParams }) {
  const params = await searchParams;

  const queryFilters = buildReservationFilters(params);
  const reservas = await listReservations(queryFilters);
  
  return (
    <main className="max-w-7xl mx-auto p-6 md:p-12 min-h-screen bg-background text-foreground">
          <div className="mb-8 flex">
            <h1 className="text-3xl font-extrabold tracking-tight">Reservas</h1>
            <ReservationActions />
          </div>
    
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservas.length <= 0 && 
              <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-5">
                Não encontramos resultados para os filtros aplicados.
              </p>
            }
            {reservas.length > 0 && reservas.map((reserva) => (
              <ReservationCard key={reserva.id} reserva={reserva} />
            ))}
          </div>
    
          
        </main>
  );
}
