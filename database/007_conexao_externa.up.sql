ALTER TABLE "Fornecedor_Servico" ADD COLUMN "provedor_nome" VARCHAR(50); -- ex: 'BOOKING_API', 'SABRE_V_API', 'PROPRIO'
ALTER TABLE "Fornecedor_Servico" ADD COLUMN "codigo_id_externo" VARCHAR(255); -- ex: 'hotel_xyz_7761'


ALTER TABLE "Reserva" ADD COLUMN "orcamento" DECIMAL(13,4);