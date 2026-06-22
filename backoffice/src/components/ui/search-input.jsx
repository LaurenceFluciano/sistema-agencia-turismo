import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchInput({ ...props }) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar..."
        className="pl-9"
        {...props}
      />
    </div>
  );
}