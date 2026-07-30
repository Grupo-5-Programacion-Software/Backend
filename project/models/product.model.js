import productsData from "../data/products.data.js";
import categoriesData from "../data/categories.data.js";

export const ProductModel = {
  findAll: () => {
    return productsData;
  },

  findById: (id) => {
    return productsData.find((p) => p.id === id);
  },

  findByCategoryId: (categoryId) => {
    return productsData.filter((p) => p.categoryId === categoryId);
  },

  create: (newProduct) => {
    if (newProduct.categoryId && !categoriesData.find((c) => c.id === newProduct.categoryId)) {
      throw new Error(`La categoría con ID ${newProduct.categoryId} no existe`);
    }
    const id = productsData.length + 1;
    const productWithId = { id, ...newProduct };
    productsData.push(productWithId);
    return productWithId;
  },

  update: (id, updatedFields) => {
    const index = productsData.findIndex((p) => p.id === id);
    if (index === -1) return null;

    if (updatedFields.categoryId && !categoriesData.find((c) => c.id === updatedFields.categoryId)) {
      throw new Error(`La categoría con ID ${updatedFields.categoryId} no existe`);
    }

    productsData[index] = { ...productsData[index], ...updatedFields };
    return productsData[index];
  },

  delete: (id) => {
    const index = productsData.findIndex((product) => product.id === id);
    if (index === -1) return false;
    productsData.splice(index, 1);
    return true;
  },
};
