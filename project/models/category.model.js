
import categoriesData from "../data/categories.data.js";

/**
 * Modelo de categorías.
 *
 * Administra las operaciones de acceso y modificación
 * de la información de las categorías almacenadas en memoria.
 */

export const CategoryModel = {
  
  // Retorna todas las categorías.
  /**
   * @returns {Array<{id: number, name: string}>} Las categorías registradas.
   */
  findAll: () => {
    return categoriesData;
  },

  // Busca una categoría por su identificador.
  /**
   * @param {number} id Identificador único de la categoría.
   * @returns {object|undefined} La categoría encontrada o `undefined` si no existe.
   */
  findById: (id) => {
    return categoriesData.find((c) => c.id === id);
  },

  // Crea una nueva categoría y le asigna un identificador.
  /**
   * @param {{name: string}} newCategory Datos de la categoría a crear.
   * @returns {{id: number, name: string}} La categoría creada con su ID asignado.
   */
  create: (newCategory) => {
    const id = Math.max(0, ...categoriesData.map((c) => c.id)) + 1;
    const categoryWithId = { id, ...newCategory };
    categoriesData.push(categoryWithId);
    return categoryWithId;
  },

  // Actualiza los datos de una categoría existente.
  /**
   * @param {number} id Identificador único de la categoría.
   * @param {Partial<{name: string}>} updatedFields Campos a actualizar.
   * @returns {object|null} La categoría actualizada o `null` si no existe.
   */
  update: (id, updatedFields) => {
    const index = categoriesData.findIndex((c) => c.id === id);
    if (index === -1) return null;

    categoriesData[index] = { ...categoriesData[index], ...updatedFields };
    return categoriesData[index];
  },

  // Elimina una categoría por su identificador.
  /**
   * @param {number} id Identificador único de la categoría.
   * @returns {boolean} `true` si se eliminó, `false` si no existía.
   */
  delete: (id) => {
    const index = categoriesData.findIndex((category) => category.id === id);
    if (index === -1) return false;

    categoriesData.splice(index, 1);
    return true;
  },
};