import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

dotenv.config();

/**
 * Script de inicialización de la base de datos.
 *
 * Se ejecuta automáticamente antes de `npm run dev` y `npm start`
 * (scripts `predev` / `prestart`). Lee las credenciales de MySQL
 * desde el archivo .env y ejecuta src/database/schema.sql, que
 * crea la base de datos, sus tablas y los datos semilla si aún
 * no existen. Es seguro repetirlo: el script es idempotente.
 */

const schemaPath = fileURLToPath(new URL("../database/schema.sql", import.meta.url));

async function initDatabase() {
  const schema = await readFile(schemaPath, "utf8");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true,
  });

  await connection.query(schema);
  await connection.end();
}

initDatabase()
  .then(() => {
    console.log("Base de datos inicializada correctamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error("No se pudo inicializar la base de datos:");
    console.error(`  - Revisa que MySQL esté encendido en ${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 3306}`);
    console.error("  - Revisa las credenciales (DB_USER y DB_PASSWORD) en el archivo .env");
    console.error(`  - Detalle técnico: ${error.message}`);
    process.exit(1);
  });
