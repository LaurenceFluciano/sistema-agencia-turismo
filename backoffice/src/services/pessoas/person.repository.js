'use server'

import sql from "../db";


async function listPeople(filters) {
    
    const pessoas = await sql`
        SELECT DISTINCT
        pe.id, 
        pe.nome, 
        pe.email, 
        pe.telefone, 
        pe.status, 
        pf.cpf, 
        pj.cnpj
        FROM "Pessoa" pe
        JOIN "Pessoa_Papel" pp ON pp."id_pessoa" = pe."id"
        LEFT JOIN "Pessoa_Fisica" pf ON pf."id_pessoa" = pe."id"
        LEFT JOIN "Pessoa_Juridica" pj ON pj."id_pessoa" = pe."id"
        WHERE 1 = 1 
        ${filters}
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
        const id_papeis = personData.papel || [1];

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

        return { success: true, message: "Pessoa atualizado com sucesso!" };

    } catch (error) {
        console.error("Erro ao executar procedure:", error.message);
        return { success: false, error: error.message };
    }
}



async function deletePerson(id) {
    // Melhoria: [ ] Soft Delete
    try {
        await sql`DELETE FROM "Pessoa" WHERE id = ${id}`;

        return { success: true, message: "Pessoa removido com sucesso." }
    } catch (error) {
        console.error("Erro ao executar a query: ", error.message);
        return { success: false, message: "Erro ao remover o cliente" }
    }
}

export { listPeople, registerPerson, deletePerson, updatePerson };