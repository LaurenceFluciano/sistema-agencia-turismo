ALTER TABLE "Itinerario" 
    ADD CONSTRAINT "chk_data_hora" 
        CHECK (fn_validar_periodo("data_hora_inicio_utc", "data_hora_fim_utc"));

ALTER TABLE "Reserva"
    ADD CONSTRAINT "chk_data" 
        CHECK (fn_validar_periodo("data_inicio_viagem_utc","data_fim_viagem_utc"));