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

export default listClients;