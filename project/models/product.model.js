
import productsData from "../data/products.data.js";
import categoriesData from "../data/categories.data.js";

/**
 * Modelo de productos.
 *
 * Gestiona el acceso, creación, actualización y eliminación
 * de productos, validando la relación con las categorías.
 */

export const ProductModel = {

  // Retorna todos los productos.
  /**
   * @returns {Array<{id: number, name: string, price: number, categoryId: number}>} Los productos registrados.
   */
  findAll: () => {
    return productsData;
  },

  // Busca un producto por su identificador.
  /**
   * @param {number} id Identificador único del producto.
   * @returns {object|undefined} El producto encontrado o `undefined` si no existe.
   */
  findById: (id) => {
    return productsData.find((p) => p.id === id);
  },

  // Obtiene los productos que pertenecen a una categoría.
  /**
   * @param {number} categoryId Identificador de la categoría.
   * @returns {Array} Los productos vinculados a dicha categoría.
   */
  findByCategoryId: (categoryId) => {
    return productsData.filter((p) => p.categoryId === categoryId);
  },

  // Crea un producto verificando que la categoría exista.
  /**
   * @param {{name: string, price: number, categoryId?: number}} newProduct Datos del producto a crear.
   * @returns {{id: number, name: string, price: number, categoryId?: number}} El producto creado con su ID asignado.
   * @throws {Error} Si la categoría indicada no existe.
   */
  create: (newProduct) => {
    if (newProduct.categoryId && !categoriesData.find((c) => c.id === newProduct.categoryId)) {
      throw new Error(`La categoría con ID ${newProduct.categoryId} no existe`);
    }
    const id = Math.max(0, ...productsData.map((p) => p.id)) + 1;
    const productWithId = { id, ...newProduct };
    productsData.push(productWithId);
    return productWithId;
  },

  // Actualiza un producto y valida la categoría asignada.
  /**
   * @param {number} id Identificador único del producto.
   * @param {Partial<{name: string, price: number, categoryId: number}>} updatedFields Campos a actualizar.
   * @returns {object|null} El producto actualizado o `null` si no existe.
   * @throws {Error} Si se asigna una categoría inexistente.
   */
  update: (id, updatedFields) => {
    const index = productsData.findIndex((p) => p.id === id);
    if (index === -1) return null;

    if (updatedFields.categoryId && !categoriesData.find((c) => c.id === updatedFields.categoryId)) {
      throw new Error(`La categoría con ID ${updatedFields.categoryId} no existe`);
    }

    productsData[index] = { ...productsData[index], ...updatedFields };
    return productsData[index];
  },

  // Elimina un producto por su identificador.
  /**
   * @param {number} id Identificador único del producto.
   * @returns {boolean} `true` si se eliminó, `false` si no existía.
   */
  delete: (id) => {
    const index = productsData.findIndex((product) => product.id === id);
    if (index === -1) return false;
    productsData.splice(index, 1);
    return true;
  },
};
