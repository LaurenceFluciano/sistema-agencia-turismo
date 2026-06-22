"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Input } from "../ui/input";

export default function SearchPacotes() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const queryParam = searchParams?.get("q") || "";
  const [value, setValue] = useState(queryParam);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setValue(queryParam);
  }, [queryParam]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function updateUrl(term) {
    const trimmed = term.trim();
    const params = new URLSearchParams();
    const currentStatus = searchParams?.get("status") || "";

    if (trimmed) params.set("q", trimmed);
    if (currentStatus) params.set("status", currentStatus);

    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    await router.push(url);
    router.refresh();
  }

  function handleChange(event) {
    const nextValue = event.target.value;
    setValue(nextValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      updateUrl(nextValue);
    }, 300);
  }

  return (
    <Input
      type="search"
      value={value}
      onChange={handleChange}
      placeholder="Buscar Pacotes..."
    />
  );
}