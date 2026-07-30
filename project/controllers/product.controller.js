import { ProductModel } from "../models/product.model.js";

const getAllProducts = (req, res) => {
  try {
    const products = ProductModel.findAll();
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

const getProductById = (req, res) => {
  try {
    const { id } = req.params;
    const product = ProductModel.findById(Number(id));
    // Validamos si el producto existe
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

const createProduct = (req, res) => {
  try {
    const { name, price, categoryId } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Nombre y precio son obligatorios",
        data: [],
        errors: [],
      });
    }

    const newProduct = ProductModel.create({ name, price, categoryId });
    res.status(201).json({
      success: true,
      message: "Producto creado correctamente",
      data: newProduct,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear el producto",
      data: [],
      errors: [error.message],
    });
  }
};

const updateProduct = (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = ProductModel.update(Number(id), req.body);
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
    res.status(500).json({
      success: false,
      message: "Error al actualizar el producto",
      data: [],
      errors: [error.message],
    });
  }
};

const deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = ProductModel.delete(Number(id));
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
      message: `Error al intentar eliminar el producto`,
      data: [],
      errors: [],
    });
  } 
}

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
