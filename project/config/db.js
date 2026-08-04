import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

/**
 * Configuración de la conexión con MySQL.
 *
 * Crea un pool de conexiones reutilizables a partir de las
 * variables definidas en el archivo .env.
 */
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "backend_actividad2",
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

export const DB_NAME = process.env.DB_NAME || "backend_actividad2";
