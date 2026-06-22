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

  // filter by papel (role) - e.g., CLIENTE or FORNECEDOR
  if (searchParams.papel) {
    const papel = String(searchParams.papel).trim().toUpperCase();
    if (papel === "CLIENTE") {
      filters.push(sql`AND pp."id_papel" = ${1}`);
    } else if (papel === "FORNECEDOR") {
      filters.push(sql`AND pp."id_papel" = ${2}`);
    } else if (!Number.isNaN(Number(papel))) {
      // allow numeric papel id
      filters.push(sql`AND pp."id_papel" = ${Number(papel)}`);
    } else {
      console.warn(`Papel inválido ignorado: ${searchParams.papel}`);
    }
  }

  return filters.length > 0 ? sql`${filters}` : sql``;
}

export default buildPersonFilters;