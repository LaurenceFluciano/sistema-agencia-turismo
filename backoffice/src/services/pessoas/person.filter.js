import sql from "../db";
import { z } from "zod";

const statusValidos = ["ATIVO", "INATIVO"];
const tipoPessoaValidos = ["FISICA", "JURIDICA"];

function buildPersonFilters(searchParams) {
  const filters = [];

  if (searchParams.nome) {
    const name = `%${searchParams.nome}%`;
    filters.push(sql`AND pe.nome ILIKE ${name}`);
  }

  if (searchParams.status) {
    
    const statusSchema = z
      .string()
      .trim()
      .transform((val) => val.toUpperCase())

    const result = statusSchema.safeParse(searchParams.status);
 

    if (result.success && statusValidos.includes(result.data)) {
      const statusSanitizado = result.data;
      
      filters.push(sql`AND pe.status = ${statusSanitizado}`);
    } else {
      console.warn(`Status inválido bloqueado: ${searchParams.status}`);
    }
  }

  if (searchParams.tipo) {
    const typePerson = z
      .string()
      .trim();
    
    const result = typePerson.safeParse(searchParams.tipo);

    if (result.success && tipoPessoaValidos.includes(result.data)) {
      const tipoPessoaSanitizado = result.data === "FISICA" ? "F" : "J";

      filters.push(sql`AND pe.tipo = ${tipoPessoaSanitizado}`)
    }
  }

  return filters.length > 0 ? sql`${filters}` : sql``;
}

export default buildPersonFilters;