import { ProductModel } from "../models/product.model.js";

/**
 * Controlador de productos.
 *
 * Gestiona las operaciones CRUD relacionadas con
 * los productos del sistema.
 */

// Obtiene todos los productos registrados.
/**
 * GET /products
 * Devuelve el listado completo de productos almacenados en la base de datos.
 * @param {import("express").Request} req Petición HTTP entrante.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía la lista de productos o un error 500.
 */
const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.findAll();
    res.status(200).json({
      success: true,
      message: "Lista de productos",
      data: products,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los productos",
      data: [],
      errors: [error.message],
    });
  }
};

// Busca un producto por su identificador.
/**
 * GET /products/:id
 * Busca un producto por su ID y lo devuelve si existe.
 * @param {import("express").Request} req Contiene el parámetro de ruta `id`.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía el producto (200), 404 si no existe o 500 en error.
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(Number(id));
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Producto con ID ${id} no encontrado`,
        data: [],
        errors: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Producto encontrado correctamente",
      data: product,
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

// Registra un nuevo producto.
/**
 * POST /products
 * Crea un producto validando que nombre y precio sean obligatorios.
 * @param {import("express").Request} req Contiene `name`, `price` y `categoryId` en el cuerpo.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía el producto creado (201), 400 si faltan datos o 500 en error.
 */
const createProduct = async (req, res) => {
  try {
    const { name, price, categoryId } = req.body;

    if (!name || price === undefined || price === null || price === "" || isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Nombre y un precio válido (mayor o igual a 0) son obligatorios",
        data: [],
        errors: [],
      });
    }

    const newProduct = await ProductModel.create({ name, price: Number(price), categoryId });
    res.status(201).json({
      success: true,
      message: "Producto creado correctamente",
      data: newProduct,
      errors: [],
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2" || error.code === "ER_NO_REFERENCED_ROW") {
      return res.status(400).json({
        success: false,
        message: "La categoría indicada no existe",
        data: [],
        errors: [error.message],
      });
    }
    res.status(500).json({
      success: false,
      message: "Error al crear el producto",
      data: [],
      errors: [error.message],
    });
  }
};

// Actualiza la información de un producto existente.
/**
 * PUT /products/:id
 * Actualiza los campos enviados de un producto existente.
 * @param {import("express").Request} req Contiene `id` en la ruta y campos en el cuerpo.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía el producto actualizado (200), 404 si no existe o 500 en error.
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, categoryId } = req.body;

    if (price !== undefined && (isNaN(Number(price)) || Number(price) < 0)) {
      return res.status(400).json({
        success: false,
        message: "El precio debe ser un número mayor o igual a 0",
        data: [],
        errors: [],
      });
    }

    const updatedProduct = await ProductModel.update(Number(id), { name, price: price !== undefined ? Number(price) : price, categoryId });
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: `Producto con ID ${id} no encontrado`,
        data: [],
        errors: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Producto actualizado correctamente",
      data: updatedProduct,
      errors: [],
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2" || error.code === "ER_NO_REFERENCED_ROW") {
      return res.status(400).json({
        success: false,
        message: "La categoría indicada no existe",
        data: [],
        errors: [error.message],
      });
    }
    res.status(500).json({
      success: false,
      message: "Error al actualizar el producto",
      data: [],
      errors: [error.message],
    });
  }
};

// Elimina un producto utilizando su identificador.
/**
 * DELETE /products/:id
 * Elimina un producto por su ID si existe en la base de datos.
 * @param {import("express").Request} req Contiene el parámetro de ruta `id`.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía confirmación (200), 404 si no existe o 500 en error.
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await ProductModel.delete(Number(id));
    if (!isDeleted) {
      return res.status(404).json({
        success: false,
        message: `No se pudo eliminar: Producto con ID ${id} no encontrado`,
        data: [],
        errors: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Producto eliminado correctamente",
      data: [],
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al intentar eliminar el producto",
      data: [],
      errors: [],
    });
  }
};

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };