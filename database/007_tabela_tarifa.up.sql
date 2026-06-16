CREATE TABLE "Tarifario_Servico" (
    "id" SERIAL,
    "id_fornecedor_servico" INT NOT NULL,

    "valor_custo" DECIMAL(10,2) NOT NULL,

    "data_inicio_validade" DATE NOT NULL,
    "data_fim_validade" DATE NOT NULL,

    CONSTRAINT "pk_tarifario" PRIMARY KEY ("id"),
    CONSTRAINT "fk_tarifario_fornecedor"
        FOREIGN KEY ("id_fornecedor_servico")
        REFERENCES "Fornecedor_Servico"("id")
);