
import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
/**
 * Rutas para la gestión de productos.
 *
 * Define los endpoints encargados de consultar, crear,
 * actualizar y eliminar productos del sistema.
 */


const productRouter = Router();

// Rutas CRUD de productos.
productRouter.get("/", getAllProducts);             // Listar todos los productos
productRouter.get("/:id", getProductById);          // Obtener un producto por ID
productRouter.post("/", createProduct);             // Crear un producto
productRouter.put("/:id", updateProduct);           // Actualizar un producto
productRouter.delete("/:id", deleteProduct);        // Eliminar un producto

export default productRouter;
