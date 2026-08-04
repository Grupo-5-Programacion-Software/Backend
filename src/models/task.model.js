import { pool } from "../config/db.js";

/**
 * Modelo de tareas.
 *
 * Gestiona el acceso, creación, actualización y eliminación
 * de tareas persistidas en MySQL, incluyendo la asignación
 * a un usuario (`user_id`) mediante una clave foránea.
 *
 * Todos los métodos son asíncronos y usan consultas preparadas.
 */
export const TaskModel = {
  // Retorna todas las tareas con el nombre del usuario asignado.
  // Soporta filtros opcionales: status, userId y búsqueda de texto (q).
  // El WHERE se construye dinámicamente con consultas preparadas (?).
  /**
   * @param {{status?: string, userId?: number, q?: string}} [filters] Filtros opcionales.
   * @returns {Promise<Array>} Las tareas que coinciden con los filtros.
   */
  findAll: async (filters = {}) => {
    const conditions = [];
    const values = [];

    if (filters.status) {
      conditions.push("t.status = ?");
      values.push(filters.status);
    }

    if (filters.userId) {
      conditions.push("t.user_id = ?");
      values.push(filters.userId);
    }

    if (filters.q) {
      conditions.push("(t.title LIKE ? OR t.description LIKE ?)");
      values.push(`%${filters.q}%`, `%${filters.q}%`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows] = await pool.query(
      `SELECT t.id, t.title, t.description, t.status,
              t.user_id AS userId, u.name AS userName
       FROM tasks t
       LEFT JOIN users u ON u.id = t.user_id
       ${where}
       ORDER BY t.id`,
      values
    );
    return rows;
  },

  // Busca una tarea por su identificador.
  /**
   * @param {number} id Identificador único de la tarea.
   * @returns {Promise<object|undefined>} La tarea o `undefined`.
   */
  findById: async (id) => {
    const [rows] = await pool.query(
      `SELECT t.id, t.title, t.description, t.status,
              t.user_id AS userId, u.name AS userName
       FROM tasks t
       LEFT JOIN users u ON u.id = t.user_id
       WHERE t.id = ?`,
      [id]
    );
    return rows[0];
  },

  // Crea una nueva tarea.
  /**
   * @param {{title: string, description?: string, userId?: number}} newTask Datos de la tarea.
   * @returns {Promise<object>} La tarea creada con su ID.
   * @throws {Error} Si el usuario asignado no existe (ER_NO_REFERENCED_ROW_2).
   */
  create: async (newTask) => {
    const [result] = await pool.query(
      "INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)",
      [newTask.title, newTask.description || null, newTask.userId || null]
    );
    return {
      id: result.insertId,
      title: newTask.title,
      description: newTask.description,
      userId: newTask.userId,
      status: "pendiente",
    };
  },

  // Actualiza todos los campos de una tarea existente.
  /**
   * @param {number} id Identificador único de la tarea.
   * @param {{title: string, description?: string, status?: string, userId?: number}} updatedFields Campos a actualizar.
   * @returns {Promise<object|null>} La tarea actualizada o `null`.
   */
  update: async (id, updatedFields) => {
    const [result] = await pool.query(
      `UPDATE tasks
       SET title = ?, description = ?, status = ?, user_id = ?
       WHERE id = ?`,
      [
        updatedFields.title,
        updatedFields.description || null,
        updatedFields.status,
        updatedFields.userId,
        id,
      ]
    );
    if (result.affectedRows === 0) return null;
    return { id, ...updatedFields };
  },

  // Actualiza parcialmente una tarea (normalmente solo el estado).
  /**
   * @param {number} id Identificador único de la tarea.
   * @param {object} partialFields Campos a actualizar (PATCH).
   * @returns {Promise<object|null>} La tarea actualizada o `null`.
   */
  patch: async (id, partialFields) => {
    const fields = Object.keys(partialFields);
    if (fields.length === 0) return { id, ...partialFields };

    const sets = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => partialFields[field]);

    const [result] = await pool.query(
      `UPDATE tasks SET ${sets} WHERE id = ?`,
      [...values, id]
    );
    if (result.affectedRows === 0) return null;
    return { id, ...partialFields };
  },

  // Elimina una tarea por su identificador.
  /**
   * @param {number} id Identificador único de la tarea.
   * @returns {Promise<boolean>} `true` si se eliminó, `false` si no existía.
   */
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
