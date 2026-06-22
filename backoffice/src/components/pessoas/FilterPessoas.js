"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "../ui/select";
import { useEffect, useState } from "react";

export default function FilterPessoas() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const initial = searchParams?.get("papel") || "";
  const [value, setValue] = useState(initial);

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  async function handleChange(val) {
    setValue(val);
    const params = new URLSearchParams();
    // preserve other search params if present
    for (const [k, v] of Object.entries(Object.fromEntries(searchParams))) {
      if (k === "papel") continue;
      if (v) params.set(k, v);
    }
    if (val) params.set("papel", val);

    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    await router.replace(url);
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
          <SelectItem value="CLIENTE">CLIENTE</SelectItem>
          <SelectItem value="FORNECEDOR">FORNECEDOR</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
