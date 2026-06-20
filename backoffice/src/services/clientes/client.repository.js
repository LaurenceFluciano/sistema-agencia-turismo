'use server'

import sql from "../db";


async function listClients(filters) {
    
    const clientes = await sql`
        SELECT 
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
        WHERE pp."id_papel" = 1 
        ${filters}
    `;


    return clientes;
}

async function registerClient(clientData) {
    try {
        const nome = clientData.nome || null;
        const telefone = clientData.telefone || null;
        const email = clientData.email || null;
        const tipo_pessoa = clientData.pessoa || "F";

        const cpf = clientData.cpf || null;
        const data_nascimento = clientData.data_nascimento || null;
        const razao_social = clientData.razao_social || null;
        const cnpj = clientData.cnpj || null;

        await sql`
            CALL pd_cadastrar_cliente(
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

        return { success: true, message: "Cliente cadastrado com sucesso!" };

    } catch (error) {
        console.error("Erro ao executar procedure:", error.message);
        return { success: false, error: error.message };
    }
}

export { listClients, registerClient };