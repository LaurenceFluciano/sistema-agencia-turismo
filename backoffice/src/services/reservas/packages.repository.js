'use server'
import sql from "../db";


async function listPackages() {
    const packages = await sql`
        SELECT 
            id as id_pacote,
            nome as nome_pacote, 
            status as status_pacote
        FROM "Pacote";
    `

    return packages
}

async function fetchItemsFromPackage(id_pacote) {
    const items = await sql`
        SELECT 
            fs."id" AS id_fornecedor_servico,
            fs."titulo_comercial" AS "nomeOferta",
            m."nome" AS cidade,
            e."nome" AS estado
        FROM "Pacote_Item" pi
        JOIN "Fornecedor_Servico" fs 
            ON fs."id" = pi."id_fornecedor_servico"
        JOIN "Servico" s 
            ON s."id" = fs."id_servico"
        JOIN "Municipio" m 
            ON m."id" = s."id_municipio"
        JOIN "Estado" e 
            ON e."id" = m."id_estado"
        WHERE pi."id_pacote" = ${id_pacote}
    `;

    return items;
}

export async function updateReservationPackage(reservaId, newPackageId) {
    try {
        await sql`
            UPDATE "Reserva"
            SET "id_pacote" = ${newPackageId}
            WHERE "id" = ${reservaId}
        `;
        return { success: true };
    } catch (err) {
        return { success: false, message: err.message };
    }
}

export { listPackages, fetchItemsFromPackage, updateReservationPackage  }