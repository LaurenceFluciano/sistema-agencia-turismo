"use client";

import { useEffect, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/select";

export default function FilterPacotes() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const initialStatus = searchParams?.get("status") || "";
  const [value, setValue] = useState(initialStatus);

  useEffect(() => {
    setValue(initialStatus);
  }, [initialStatus]);

  async function handleChange(val) {
    setValue(val);
    const q = searchParams?.get("q") || "";
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (val) params.set("status", val);
    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    await router.push(url);
    router.refresh();
  }

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="">Todos</SelectItem>
          <SelectItem value="DISPONIVEL">Disponível</SelectItem>
          <SelectItem value="INDISPONIVEL">Indisponível</SelectItem>
          <SelectItem value="ENCERRADO">Encerrado</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
