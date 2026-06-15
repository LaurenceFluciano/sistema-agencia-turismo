DELETE FROM "Reserva_Item";
DELETE FROM "Reserva";
ALTER SEQUENCE "Reserva_id_seq" RESTART WITH 1;


INSERT INTO "Reserva" (
    "id_cliente",
    "id_pacote",
    "data_inicio_viagem_utc",
    "data_fim_viagem_utc",
    "status",
    "preco_total"

) VALUES
    (
        1,1, 
        NOW() + INTERVAL '7 days', 
        NOW() + INTERVAL '8 days',
        'CONFIRMADA',
        0
    ),
    (
        2,1, 
        NOW() + INTERVAL '7 days', 
        NOW() + INTERVAL '8 days',
        'RASCUNHO',
        0
    ),
    (
        3,2, 
        NOW() + INTERVAL '10 days', 
        NOW() + INTERVAL '12 days',
        'RASCUNHO',
        0
    );

CALL pd_definir_preco_da_reserva(1,2,800,15);
CALL pd_definir_preco_da_reserva(1,16,450,20);
CALL pd_definir_preco_da_reserva(1,26,600,10);
CALL pd_definir_preco_da_reserva(1,32,90,15);

CALL pd_definir_preco_da_reserva(2,2,1600,15);
CALL pd_definir_preco_da_reserva(2,16,900,20);
CALL pd_definir_preco_da_reserva(2,26,1200,10);
CALL pd_definir_preco_da_reserva(2,32,180,15);

CALL pd_definir_preco_da_reserva(3,12,7536,15);
CALL pd_definir_preco_da_reserva(3,9,3600,15);
CALL pd_definir_preco_da_reserva(3,29,1600,15);
CALL pd_definir_preco_da_reserva(3,44,640,15);

CALL pd_adicionar_passageiro_na_viagem('Maria Hofman', 1);
CALL pd_adicionar_passageiro_na_viagem('Paulo Ricardo', 1);

CALL pd_adicionar_passageiro_na_viagem('Jorge', 2);
CALL pd_adicionar_passageiro_na_viagem('Joao', 2);
CALL pd_adicionar_passageiro_na_viagem('Luis', 2);
CALL pd_adicionar_passageiro_na_viagem('Antonio', 2);

CALL pd_adicionar_passageiro_na_viagem('Lucas Martins', 3);
CALL pd_adicionar_passageiro_na_viagem('Beatriz Souza', 3);
CALL pd_adicionar_passageiro_na_viagem('Carlos Eduardo', 3);
CALL pd_adicionar_passageiro_na_viagem('Fernanda Lima', 3);
CALL pd_adicionar_passageiro_na_viagem('Rafael Almeida', 3);
CALL pd_adicionar_passageiro_na_viagem('Camila Rocha', 3);
CALL pd_adicionar_passageiro_na_viagem('Zelda do Santos', 3);
CALL pd_adicionar_passageiro_na_viagem('Juliana Costa', 3);

