import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();


const { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;

if (!DATABASE_HOST || !DATABASE_PORT || !DATABASE_NAME || !DATABASE_USERNAME || !DATABASE_PASSWORD) {
  throw new Error(
    "Faltam variáveis de ambiente para a conexão com o banco de dados. " +
    "Verifique se o seu arquivo .env possui DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME e DATABASE_PASSWORD."
  );
}

const sql = postgres({
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  database: DATABASE_NAME,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
});

export default sql;
