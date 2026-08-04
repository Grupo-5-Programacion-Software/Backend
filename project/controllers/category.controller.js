
import { CategoryModel } from "../models/category.model.js";
import { ProductModel } from "../models/product.model.js";

/**
 * Controlador de categorias.
 *
 * Gestiona las operaciones CRUD de las categorias y la
 * consulta de los productos asociados a cada categoria.
 */

// Obtiene todas las categorias registradas.
/**
 * GET /categories
 * Devuelve el listado completo de categorías almacenadas en memoria.
 * @param {import("express").Request} req Petición HTTP entrante.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía la lista de categorías o un error 500.
 */
const getAllCategories = (req, res) => {
  try {
    const categories = CategoryModel.findAll();
    res.status(200).json({
      success: true,
      message: "Lista de categorías",
      data: categories,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las categorías",
      data: [],
      errors: [error.message],
    });
  }
};

// Busca una categoria utilizando su identificador.
/**
 * GET /categories/:id
 * Busca una categoría por su ID y la devuelve si existe.
 * @param {import("express").Request} req Contiene el parámetro de ruta `id`.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía la categoría (200), 404 si no existe o 500 en error.
 */
const getCategoryById = (req, res) => {
  try {
    const { id } = req.params;
    const category = CategoryModel.findById(Number(id));

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Categoría con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Categoría encontrada correctamente",
      data: category,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al procesar la búsqueda",
      data: [],
      errors: [],
    });
  }
};

// Crea una nueva categoria despues de validar los datos recibidos.
/**
 * POST /categories
 * Crea una categoría validando que el nombre sea obligatorio.
 * @param {import("express").Request} req Contiene `name` en el cuerpo de la petición.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía la categoría creada (201), 400 si falta el nombre o 500 en error.
 */
const createCategory = (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "El nombre de la categoría es obligatorio",
        data: [],
        errors: [],
      });
    }

    const newCategory = CategoryModel.create({ name });
    res.status(201).json({
      success: true,
      message: "Categoría creada correctamente",
      data: newCategory,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear la categoría",
      data: [],
      errors: [error.message],
    });
  }
};

// Actualiza la informacion de una categoria existente.
/**
 * PUT /categories/:id
 * Actualiza los campos enviados de una categoría existente.
 * @param {import("express").Request} req Contiene `id` en la ruta y campos en el cuerpo.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía la categoría actualizada (200), 404 si no existe o 500 en error.
 */
const updateCategory = (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = CategoryModel.update(Number(id), req.body);

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: `Categoría con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Categoría actualizada correctamente",
      data: updatedCategory,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar la categoría",
      data: [],
      errors: [error.message],
    });
  }
};

// Elimina una categoria siempre que no tenga productos asociados.
/**
 * DELETE /categories/:id
 * Elimina una categoría solo si existe y no tiene productos vinculados.
 * @param {import("express").Request} req Contiene el parámetro de ruta `id`.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía confirmación (200), 404 si no existe, 409 si tiene productos o 500 en error.
 */
const deleteCategory = (req, res) => {
  try {
    const { id } = req.params;

    const categoryExists = CategoryModel.findById(Number(id));
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: `No se pudo eliminar: Categoría con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

    const linkedProducts = ProductModel.findByCategoryId(Number(id));
    if (linkedProducts && linkedProducts.length > 0) {
      return res.status(409).json({
        success: false,
        message: "No se puede eliminar la categoría porque tiene al menos un recurso vinculado",
        data: [],
        errors: [],
      });
    }

    const isDeleted = CategoryModel.delete(Number(id));
    res.status(200).json({
      success: true,
      message: "Categoría eliminada correctamente",
      data: [],
      errors: [],
    });    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al intentar eliminar la categoría",
      data: [],
      errors: [],
    });
  } 
};

// Obtiene todos los productos pertenecientes a una categoria
/**
 * GET /categories/:id/products
 * Lista los productos asociados a una categoría específica.
 * @param {import("express").Request} req Contiene el parámetro de ruta `id`.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía los productos (200), 404 si la categoría no existe o 500 en error.
 */
const getProductsByCategory = (req, res) => {
  try {
    const { id } = req.params;

    const categoryExists = CategoryModel.findById(Number(id));
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: `La categoría con ID ${id} no existe`,
        data: [],
        errors: [],
      });
    }

    // Busca los productos vinculados a la categoría.
    const products = ProductModel.findByCategoryId(Number(id));
    res.status(200).json({
      success: true,
      message: `Productos de la categoría: ${categoryExists.name}`,
      data: products,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al buscar los productos de la categoría",
      data: [],
      errors: [],
    });
  }
};

export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
};