import buildPersonFilters from "@/services/clientes/client.filter";
import listClients from "@/services/clientes/client.repository";
import ClientCard from "@/components/organism/ClientCard";

export default async function Page({ searchParams }) {
  const params = await searchParams;

  const queryFilters = buildPersonFilters(params);
  const clientes = await listClients(queryFilters);

  return (
    <main className="max-w-7xl mx-auto p-6 md:p-12 min-h-screen bg-background text-foreground">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Clientes</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientes.length <= 0 && 
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-5">
            Não encontramos resultados para os filtros aplicados.
          </p>
        }
        {clientes.length > 0 && clientes.map((cliente) => (
          <ClientCard key={cliente.id} cliente={cliente} />
        ))}
      </div>
    </main>
  );
}
