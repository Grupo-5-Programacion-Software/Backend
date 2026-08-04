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
   * @returns {Promise<Array<{id: number, code: string, name: string, price: number, stock: number, categoryId: number}>>} Los productos registrados.
   */
  findAll: async () => {
    const [rows] = await pool.query("SELECT id, code, name, price, stock, category_id AS categoryId FROM products ORDER BY id");
    return rows;
  },

  // Busca un producto por su identificador.
  /**
   * @param {number} id Identificador único del producto.
   * @returns {Promise<object|undefined>} El producto encontrado o `undefined` si no existe.
   */
  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT id, code, name, price, stock, category_id AS categoryId FROM products WHERE id = ?",
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
      "SELECT id, code, name, price, stock, category_id AS categoryId FROM products WHERE category_id = ? ORDER BY id",
      [categoryId]
    );
    return rows;
  },

  // Crea un producto verificando que la categoría exista.
  // La columna `code` es NOT NULL en la BD existente; se genera
  // automáticamente como PRD-NNN a partir del código más alto.
  /**
   * @param {{name: string, price: number, categoryId?: number, stock?: number}} newProduct Datos del producto a crear.
   * @returns {Promise<object>} El producto creado con su ID asignado.
   * @throws {Error} Si la categoría indicada no existe.
   */
  create: async (newProduct) => {
    const [[{ maxCode }]] = await pool.query(
      "SELECT MAX(CAST(SUBSTRING(code, 5) AS UNSIGNED)) AS maxCode FROM products"
    );
    const nextNumber = (maxCode || 0) + 1;
    const code = `PRD-${String(nextNumber).padStart(3, "0")}`;
    const stock = newProduct.stock ?? 0;

    const [result] = await pool.query(
      "INSERT INTO products (code, name, price, stock, category_id) VALUES (?, ?, ?, ?, ?)",
      [code, newProduct.name, newProduct.price, stock, newProduct.categoryId]
    );
    return { id: result.insertId, code, name: newProduct.name, price: newProduct.price, stock, categoryId: newProduct.categoryId };
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