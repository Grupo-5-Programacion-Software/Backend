
import categoriesData from "../data/categories.data.js";

/**
 * Modelo de categorías.
 *
 * Administra las operaciones de acceso y modificación
 * de la información de las categorías almacenadas en memoria.
 */

export const CategoryModel = {
  
  // Retorna todas las categorías.
  findAll: () => {
    return categoriesData;
  },

  // Busca una categoría por su identificador.
  findById: (id) => {
    return categoriesData.find((c) => c.id === id);
  },

  // Crea una nueva categoría y le asigna un identificador.
  create: (newCategory) => {
    const id = categoriesData.length + 1;
    const categoryWithId = { id, ...newCategory };
    categoriesData.push(categoryWithId);
    return categoryWithId;
  },

  // Actualiza los datos de una categoría existente.
  update: (id, updatedFields) => {
    const index = categoriesData.findIndex((c) => c.id === id);
    if (index === -1) return null;

    categoriesData[index] = { ...categoriesData[index], ...updatedFields };
    return categoriesData[index];
  },

  // Elimina una categoría por su identificador.
  delete: (id) => {
    const index = categoriesData.findIndex((category) => category.id === id);
    if (index === -1) return false;

    categoriesData.splice(index, 1);
    return true;
  },
};