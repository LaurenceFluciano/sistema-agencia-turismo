import { useFilters } from "@/lib/useFilters";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SearchInput } from "../ui/search-input";


export default function ReservationFiltersAction(){
    const {getFilter, setFilter, clearFilters} = useFilters()
    
    return (
        <div className="flex flex-row">

            <div className="flex flex-col ml-8">
                <h3>Status</h3>
                <Select 
                    defaultValue="todos"
                    onValueChange={(value) => {
                        setFilter("status", value === "all" ? undefined : value);
                    }}
                >
                    <SelectTrigger>
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem
                                value="todos"
                            >
                                Todos
                            </SelectItem>

                            <SelectItem
                                value="rascunho"
                            >
                                Rascunho
                            </SelectItem>

                            <SelectItem
                                value="confirmada"
                            >
                                Confirmada
                            </SelectItem>

                            <SelectItem
                                value="cancelada"
                            >
                                Cancelada
                            </SelectItem>

                            <SelectItem
                                value="pendente"
                            >
                                Pendente
                            </SelectItem>

                            <SelectItem
                                value="concluida"
                            >
                                Concluida
                            </SelectItem>

                            <SelectItem
                                value="em_atraso"
                            >
                                Em Atraso
                            </SelectItem>
                            
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col ml-8">
                <h3>Buscar pelo nome do cliente</h3>
                <SearchInput 
                    onChange={(e) => setFilter("searchByClientName", e.target.value)}
                />
            </div>

        </div>
    )
}