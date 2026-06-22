import PacoteManager from "../../../components/pacotes/PacoteManager";
import { listPacotes } from "../../../services/pacotes/package.repository";
import SearchPacotes from "../../../components/pacotes/SearchPacotes";
import FilterPacotes from "../../../components/pacotes/FilterPacotes";

export default async function PacotesPage({ searchParams }) {
  // In some Next.js runtimes `searchParams` itself can be a Promise.
  // Await the object first, then read its properties.
  const sp = await searchParams;
  const query = sp?.q ?? "";
  const status = sp?.status ?? "";
  let pacotes = [];
  try {
    pacotes = await listPacotes(query, status);
  } catch (error) {
    console.error("Erro ao carregar pacotes:", error);
    pacotes = [];
  }

  return (
    <main className="max-w-7xl mx-auto p-6 md:p-12 min-h-screen bg-background text-foreground">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight">Pacotes</h1>
        <div className="ml-auto" />
      </div>

      <div className="bg-secondary/50 p-2 rounded-md flex flex-col gap-2 md:flex-row md:items-center md:justify-between mt-6">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <SearchPacotes />
          <FilterPacotes />
        </div>
      </div>

      <PacoteManager pacotes={pacotes} />
    </main>
  );
}
