DROP TRIGGER IF EXISTS trg_auditoria_pagamento ON "Pagamento";
DROP TRIGGER IF EXISTS trg_auditoria_reserva ON "Reserva";
DROP FUNCTION IF EXISTS fn_log_auditoria();
DROP TABLE IF EXISTS "Log_Auditoria" CASCADE;

