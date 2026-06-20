import buildPersonFilters from "@/services/pessoas/person.filter";
import { listPeople } from "@/services/pessoas/person.repository"
import PersonCard from "@/components/pessoas/PersonCard";
import PersonActions from "@/components/pessoas/PersonActions";

export default async function Page({ searchParams }) {
  const params = await searchParams;

  const queryFilters = buildPersonFilters(params);
  const pessoas = await listPeople(queryFilters);

  return (
    <main className="max-w-7xl mx-auto p-6 md:p-12 min-h-screen bg-background text-foreground">
      <div className="mb-8 flex">
        <h1 className="text-3xl font-extrabold tracking-tight">Pessoas</h1>
        <PersonActions />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pessoas.length <= 0 && 
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-5">
            Não encontramos resultados para os filtros aplicados.
          </p>
        }
        {pessoas.length > 0 && pessoas.map((pessoa) => (
          <PersonCard key={pessoa.id} pessoa={pessoa} />
        ))}
      </div>

      
    </main>
  );
}
