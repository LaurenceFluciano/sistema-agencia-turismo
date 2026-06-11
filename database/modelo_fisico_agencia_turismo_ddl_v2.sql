/*
* V2 - Garantindo consistência nas especializações
*/

ALTER TABLE "Pessoa" ADD COLUMN "tipo_pessoa" CHAR(1) NOT NULL CHECK ("tipo_pessoa" IN ('F', 'J'));
ALTER TABLE "Pessoa" ADD CONSTRAINT "id_tipo_pessoa_unique" UNIQUE ("id", "tipo_pessoa");


ALTER TABLE "Pessoa_Fisica" ADD COLUMN "tipo_pessoa" CHAR(1) DEFAULT 'F' NOT NULL CHECK ("tipo_pessoa" = 'F');
ALTER TABLE "Pessoa_Fisica" ADD CONSTRAINT "fk_pessoa_fisica" 
  FOREIGN KEY ("pessoa_id", "tipo_pessoa") REFERENCES "Pessoa" ("id", "tipo_pessoa");


ALTER TABLE "Pessoa_Juridica" ADD COLUMN "tipo_pessoa" CHAR(1) DEFAULT 'J' NOT NULL CHECK ("tipo_pessoa" = 'J');
ALTER TABLE "Pessoa_Juridica" ADD CONSTRAINT "fk_pessoa_juridica" 
  FOREIGN KEY ("pessoa_id", "tipo_pessoa") REFERENCES "Pessoa" ("id", "tipo_pessoa");