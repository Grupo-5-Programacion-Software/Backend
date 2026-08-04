import { pool } from "../config/db.js";

/**
 * Modelo de categorías.
 *
 * Administra las operaciones de acceso y modificación
 * de las categorías persistidas en MySQL.
 */

export const CategoryModel = {

  // Retorna todas las categorías.
  /**
   * @returns {Promise<Array<{id: number, name: string}>>} Las categorías registradas.
   */
  findAll: async () => {
    const [rows] = await pool.query("SELECT id, name FROM categorias ORDER BY id");
    return rows;
  },

  // Busca una categoría por su identificador.
  /**
   * @param {number} id Identificador único de la categoría.
   * @returns {Promise<object|undefined>} La categoría encontrada o `undefined` si no existe.
   */
  findById: async (id) => {
    const [rows] = await pool.query("SELECT id, name FROM categorias WHERE id = ?", [id]);
    return rows[0];
  },

  // Crea una nueva categoría.
  /**
   * @param {{name: string}} newCategory Datos de la categoría a crear.
   * @returns {Promise<{id: number, name: string}>} La categoría creada con su ID asignado.
   * @throws {Error} Si el nombre ya está registrado o es inválido.
   */
  create: async (newCategory) => {
    const [result] = await pool.query("INSERT INTO categorias (name) VALUES (?)", [newCategory.name]);
    return { id: result.insertId, name: newCategory.name };
  },

  // Actualiza los datos de una categoría existente.
  /**
   * @param {number} id Identificador único de la categoría.
   * @param {Partial<{name: string}>} updatedFields Campos a actualizar.
   * @returns {Promise<object|null>} La categoría actualizada o `null` si no existe.
   */
  update: async (id, updatedFields) => {
    const [result] = await pool.query("UPDATE categorias SET name = ? WHERE id = ?", [updatedFields.name, id]);
    if (result.affectedRows === 0) return null;
    return { id, name: updatedFields.name };
  },

  // Elimina una categoría por su identificador.
  /**
   * @param {number} id Identificador único de la categoría.
   * @returns {Promise<boolean>} `true` si se eliminó, `false` si no existía.
   */
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM categorias WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};