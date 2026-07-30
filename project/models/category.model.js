import categoriesData from "../data/categories.data.js";

export const CategoryModel = {
  findAll: () => {
    return categoriesData;
  },

  findById: (id) => {
    return categoriesData.find((c) => c.id === id);
  },

  create: (newCategory) => {
    const id = categoriesData.length + 1;
    const categoryWithId = { id, ...newCategory };
    categoriesData.push(categoryWithId);
    return categoryWithId;
  },

  update: (id, updatedFields) => {
    const index = categoriesData.findIndex((c) => c.id === id);
    if (index === -1) return null;

    categoriesData[index] = { ...categoriesData[index], ...updatedFields };
    return categoriesData[index];
  },

  delete: (id) => {
    const index = categoriesData.findIndex((category) => category.id === id);
    if (index === -1) return false;

    categoriesData.splice(index, 1);
    return true;
  },
};