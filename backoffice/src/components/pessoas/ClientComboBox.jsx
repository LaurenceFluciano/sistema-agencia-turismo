'use client'
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function ClientCombobox({ clientes, value, onChange, onSearch }) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);


  React.useEffect(() => {
    setMounted(true);
  }, []);


  if (!mounted) {
    return (
      <Button variant="outline" className="w-full justify-between">
        Carregando...
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
     <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {value?.nome ?? "Selecione um cliente..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar cliente..." onValueChange={onSearch} />
          <CommandList>
            <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
            <CommandGroup>
              {clientes.map((cliente, index) => (
                <CommandItem
                  className="flex flex-col items-start justify-start gap-0"
                  key={`${cliente.id}-${index}`}
                  value={cliente.nome}
                  onSelect={() => {
                    onChange(cliente)
                    setOpen(false)
                  }}
                >
                  <span className="text-md">{cliente.nome}</span> 
                  { cliente.email && (<span className="text-xs text-muted-foreground">email: {cliente.email}</span>)}
                  { cliente.cpf && (<span className="text-xs text-muted-foreground">cpf: {cliente.cpf}</span>)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}