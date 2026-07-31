
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
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/", createProduct);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
