import { pool } from "../config/db.js";

/**
 * Modelo de usuarios.
 *
 * Gestiona el acceso, creación, actualización y eliminación
 * de usuarios persistidos en MySQL.
 *
 * Nota de diseño: cada método es asíncrono y usa consultas
 * preparadas (?) para evitar inyección SQL.
 */
export const UserModel = {
  // Retorna todos los usuarios registrados.
  /**
   * @returns {Promise<Array<{id: number, name: string, email: string}>>} Los usuarios.
   */
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT id, name, email, created_at AS createdAt FROM users ORDER BY id"
    );
    return rows;
  },

  // Busca un usuario por su identificador.
  /**
   * @param {number} id Identificador único del usuario.
   * @returns {Promise<object|undefined>} El usuario o `undefined`.
   */
  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT id, name, email, created_at AS createdAt FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  // Busca un usuario por su correo electrónico.
  /**
   * @param {string} email Correo a consultar.
   * @returns {Promise<object|undefined>} El usuario con ese correo.
   */
  findByEmail: async (email) => {
    const [rows] = await pool.query(
      "SELECT id, name, email FROM users WHERE email = ?",
      [email]
    );
    return rows[0];
  },

  // Crea un nuevo usuario.
  // La columna `password` es NOT NULL en la BD existente; se usa un
  // valor por defecto mientras este módulo no implemente autenticación.
  /**
   * @param {{name: string, email: string, password?: string}} userData Datos del usuario.
   * @returns {Promise<{id: number, name: string, email: string}>} Usuario creado.
   * @throws {Error} Si el correo ya está registrado (ER_DUP_ENTRY).
   */
  create: async (userData) => {
    const password = userData.password || "cambiar123";
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [userData.name, userData.email, password]
    );
    return { id: result.insertId, name: userData.name, email: userData.email };
  },

  // Actualiza los datos de un usuario existente.
  /**
   * @param {number} id Identificador único del usuario.
   * @param {{name: string, email: string}} updatedFields Campos a actualizar.
   * @returns {Promise<object|null>} El usuario actualizado o `null`.
   */
  update: async (id, updatedFields) => {
    const [result] = await pool.query(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [updatedFields.name, updatedFields.email, id]
    );
    if (result.affectedRows === 0) return null;
    return { id, name: updatedFields.name, email: updatedFields.email };
  },

  // Elimina un usuario por su identificador.
  /**
   * @param {number} id Identificador único del usuario.
   * @returns {Promise<boolean>} `true` si se eliminó, `false` si no existía.
   */
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
