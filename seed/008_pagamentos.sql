
INSERT INTO "Pagamento" (
    "id",
    "id_reserva",
    "valor",
    "forma_pagamento",
    "status",
    "data_pagamento_utc"
)
VALUES
(
    1,
    1,
    500.00,
    'PIX',
    'PAGO',
    NOW() - INTERVAL '2 days'
),

(
    2,
    1,
    300.00,
    'CARTAO',
    'PAGO',
    NOW() - INTERVAL '1 day'
),

(
    3,
    1,
    200.00,
    'BOLETO',
    'PENDETE',
    NOW() - INTERVAL '10 days'
);