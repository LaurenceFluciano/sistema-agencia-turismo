'use server'

import sql from "../db";


async function listPeople(filters) {
    
    const pessoas = await sql`
        SELECT
            pe.id,
            pe.nome,
            pe.email,
            pe.telefone,
            pe.status,
            pf.cpf,
            pj.cnpj,
            ARRAY_AGG(DISTINCT pp."id_papel") AS papeis
        FROM "Pessoa" pe
        JOIN "Pessoa_Papel" pp ON pp."id_pessoa" = pe."id"
        LEFT JOIN "Pessoa_Fisica" pf ON pf."id_pessoa" = pe."id"
        LEFT JOIN "Pessoa_Juridica" pj ON pj."id_pessoa" = pe."id"
        WHERE 1 = 1
        ${filters}
        GROUP BY
            pe.id,
            pe.nome,
            pe.email,
            pe.telefone,
            pe.status,
            pf.cpf,
            pj.cnpj
    `;

    return pessoas;
}

async function registerPerson(personData) {
    try {
        const nome = personData.nome || null;
        const telefone = personData.telefone || null;
        const email = personData.email || null;
        const tipo_pessoa = personData.pessoa || "F";

        const cpf = personData.cpf || null;
        const data_nascimento = personData.data_nascimento || null;
        const razao_social = personData.razao_social || null;
        const cnpj = personData.cnpj || null;
        const id_papeis = personData.papel ? [Number(personData.papel)] : [1];

        await sql`
            CALL pd_cadastrar_pessoa(
                ${nome}, 
                ${telefone}, 
                ${email}, 
                ${tipo_pessoa},
                ${id_papeis}, 
                ${cpf}, 
                ${data_nascimento}, 
                ${razao_social}, 
                ${cnpj}
            )
        `;

        return { success: true, message: "Cliente cadastrado com sucesso!" };

    } catch (error) {
        console.error("Erro ao executar procedure:", error.message);
        return { success: false, error: error.message };
    }
}

async function updatePerson(personData, id) {
    try {
        const nome = personData.nome || null;
        const telefone = personData.telefone || null;
        const email = personData.email || null;
        const tipo_pessoa = personData.pessoa || "F";

        const cpf = personData.cpf || null;
        const data_nascimento = personData.data_nascimento || null;
        const razao_social = personData.razao_social || null;
        const cnpj = personData.cnpj || null;
        const id_papeis = personData.papel ? [Number(personData.papel)] : null;

        await sql`
            CALL pd_atualizar_pessoa(
                ${id},
                ${nome}, 
                ${telefone}, 
                ${email}, 
                ${tipo_pessoa},
                ${cpf}, 
                ${data_nascimento}, 
                ${razao_social}, 
                ${cnpj}
            )
        `;

        if (id_papeis) {
            await sql`
                CALL pd_atualizar_papeis_pessoa(
                    ${id},
                    ${id_papeis}
                )
            `;
        }

        return { success: true, message: "Pessoa atualizada com sucesso!" };

    } catch (error) {
        console.error("Erro ao executar procedure:", error.message);
        return { success: false, error: error.message };
    }
}



async function deletePerson(id) {
    const pessoaId = typeof id === "string" ? Number(id) : id;

    if (!Number.isInteger(pessoaId) || pessoaId <= 0) {
        throw new Error("ID de pessoa inválido.");
    }

    try {
        const [hasReservation] = await sql`
            SELECT EXISTS (
                SELECT 1 FROM "Reserva" WHERE "id_cliente" = ${pessoaId}
            ) AS has_reservation
        `;

        const [hasSupplierService] = await sql`
            SELECT EXISTS (
                SELECT 1 FROM "Fornecedor_Servico" WHERE "id_pessoa" = ${pessoaId}
            ) AS has_supplier_service
        `;

        if (hasReservation?.has_reservation || hasSupplierService?.has_supplier_service) {
            throw new Error("Não é possível excluir: Esta pessoa possui reservas ou ofertas vinculadas.");
        }

        await sql`DELETE FROM "Pessoa" WHERE id = ${pessoaId}`;

        return { success: true, message: "Pessoa removida com sucesso." };
    } catch (error) {
        console.error("Erro ao executar a query: ", error.message);
        throw error;
    }
}

async function searchClientsByName(name) {
    const searchTerm = `%${name}%`;
    const clientes = await sql`
        SELECT
            pe.id,
            pe.nome as nome_cliente,
            pf.cpf,
            pe.email
        FROM "Pessoa" pe
        LEFT JOIN "Pessoa_Fisica" pf ON pe."id" = pf."id_pessoa"
        JOIN "Pessoa_Papel" pp ON pp."id_pessoa" = pe."id"
        WHERE pe."nome" ILIKE ${searchTerm}
        AND "id_papel" = 1
    `

    return clientes
}

export { listPeople, registerPerson, deletePerson, updatePerson, searchClientsByName };