import { pool } from "../config/db.js";

/**
 * Modelo de productos.
 *
 * Gestiona el acceso, creación, actualización y eliminación
 * de productos persistidos en MySQL, validando la relación
 * con las categorías.
 */

export const ProductModel = {

  // Retorna todos los productos.
  /**
   * @returns {Promise<Array<{id: number, name: string, price: number, categoryId: number}>>} Los productos registrados.
   */
  findAll: async () => {
    const [rows] = await pool.query("SELECT id, name, price, category_id AS categoryId FROM products ORDER BY id");
    return rows;
  },

  // Busca un producto por su identificador.
  /**
   * @param {number} id Identificador único del producto.
   * @returns {Promise<object|undefined>} El producto encontrado o `undefined` si no existe.
   */
  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT id, name, price, category_id AS categoryId FROM products WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  // Obtiene los productos que pertenecen a una categoría.
  /**
   * @param {number} categoryId Identificador de la categoría.
   * @returns {Promise<Array>} Los productos vinculados a dicha categoría.
   */
  findByCategoryId: async (categoryId) => {
    const [rows] = await pool.query(
      "SELECT id, name, price, category_id AS categoryId FROM products WHERE category_id = ? ORDER BY id",
      [categoryId]
    );
    return rows;
  },

  // Crea un producto verificando que la categoría exista.
  /**
   * @param {{name: string, price: number, categoryId?: number}} newProduct Datos del producto a crear.
   * @returns {Promise<object>} El producto creado con su ID asignado.
   * @throws {Error} Si la categoría indicada no existe.
   */
  create: async (newProduct) => {
    const [result] = await pool.query(
      "INSERT INTO products (name, price, category_id) VALUES (?, ?, ?)",
      [newProduct.name, newProduct.price, newProduct.categoryId]
    );
    return { id: result.insertId, name: newProduct.name, price: newProduct.price, categoryId: newProduct.categoryId };
  },

  // Actualiza un producto y valida la categoría asignada.
  /**
   * @param {number} id Identificador único del producto.
   * @param {Partial<{name: string, price: number, categoryId: number}>} updatedFields Campos a actualizar.
   * @returns {Promise<object|null>} El producto actualizado o `null` si no existe.
   * @throws {Error} Si se asigna una categoría inexistente.
   */
  update: async (id, updatedFields) => {
    const [result] = await pool.query(
      "UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?",
      [updatedFields.name, updatedFields.price, updatedFields.categoryId, id]
    );
    if (result.affectedRows === 0) return null;
    return { id, name: updatedFields.name, price: updatedFields.price, categoryId: updatedFields.categoryId };
  },

  // Elimina un producto por su identificador.
  /**
   * @param {number} id Identificador único del producto.
   * @returns {Promise<boolean>} `true` si se eliminó, `false` si no existía.
   */
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};