import { pool } from "../config/db.js";

/**
 * Modelo de PQRS.
 *
 * Gestiona el acceso, creación, actualización y eliminación
 * de solicitudes PQRS (Peticiones, Quejas, Reclamos y
 * Sugerencias) persistidas en MySQL.
 *
 * Todos los métodos son asíncronos y usan consultas preparadas.
 */
export const PqrsModel = {
  // Retorna todas las solicitudes registradas.
  /**
   * @returns {Promise<Array>} Las solicitudes PQRS.
   */
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT id, type, description, status, created_at AS createdAt FROM pqrs ORDER BY id"
    );
    return rows;
  },

  // Busca una solicitud por su identificador.
  /**
   * @param {number} id Identificador único de la solicitud.
   * @returns {Promise<object|undefined>} La solicitud o `undefined`.
   */
  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT id, type, description, status, created_at AS createdAt FROM pqrs WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  // Crea una nueva solicitud.
  /**
   * @param {{type: string, description: string}} newPqrs Datos de la solicitud.
   * @returns {Promise<object>} La solicitud creada con su ID.
   */
  create: async (newPqrs) => {
    const [result] = await pool.query(
      "INSERT INTO pqrs (type, description) VALUES (?, ?)",
      [newPqrs.type, newPqrs.description]
    );
    return {
      id: result.insertId,
      type: newPqrs.type,
      description: newPqrs.description,
      status: "abierta",
    };
  },

  // Actualiza parcialmente una solicitud (estado o descripción).
  /**
   * @param {number} id Identificador único de la solicitud.
   * @param {object} partialFields Campos a actualizar (PATCH).
   * @returns {Promise<object|null>} La solicitud actualizada o `null`.
   */
  patch: async (id, partialFields) => {
    const fields = Object.keys(partialFields);
    if (fields.length === 0) return { id, ...partialFields };

    const sets = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => partialFields[field]);

    const [result] = await pool.query(
      `UPDATE pqrs SET ${sets} WHERE id = ?`,
      [...values, id]
    );
    if (result.affectedRows === 0) return null;
    return { id, ...partialFields };
  },

  // Elimina una solicitud por su identificador.
  /**
   * @param {number} id Identificador único de la solicitud.
   * @returns {Promise<boolean>} `true` si se eliminó, `false` si no existía.
   */
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM pqrs WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
