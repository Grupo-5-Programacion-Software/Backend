
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
  findAll: () => {
    return productsData;
  },

  // Busca un producto por su identificador.
  findById: (id) => {
    return productsData.find((p) => p.id === id);
  },

  // Obtiene los productos que pertenecen a una categoría.
  findByCategoryId: (categoryId) => {
    return productsData.filter((p) => p.categoryId === categoryId);
  },

  // Crea un producto verificando que la categoría exista.
  create: (newProduct) => {
    if (newProduct.categoryId && !categoriesData.find((c) => c.id === newProduct.categoryId)) {
      throw new Error(`La categoría con ID ${newProduct.categoryId} no existe`);
    }
    const id = productsData.length + 1;
    const productWithId = { id, ...newProduct };
    productsData.push(productWithId);
    return productWithId;
  },

  // Actualiza un producto y valida la categoría asignada.
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
  delete: (id) => {
    const index = productsData.findIndex((product) => product.id === id);
    if (index === -1) return false;
    productsData.splice(index, 1);
    return true;
  },
};
