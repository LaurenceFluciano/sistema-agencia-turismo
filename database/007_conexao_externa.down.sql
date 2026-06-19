ALTER TABLE "Fornecedor_Servico" DROP COLUMN IF EXISTS "provedor_nome" VARCHAR(50); -- ex: 'BOOKING_API', 'SABRE_V_API', 'PROPRIO'
ALTER TABLE "Fornecedor_Servico" DROP COLUMN IF EXISTS "codigo_id_externo" VARCHAR(255); -- ex: 'hotel_xyz_7761'


ALTER TABLE "Reserva" DROP COLUMN IF EXISTS "orcamento" DECIMAL(13,4);