import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
} from "../controllers/category.controller.js";
/**
 * Rutas para la gestión de categorías.
 *
 * Define los endpoints encargados de consultar, crear,
 * actualizar, eliminar categorías y listar los productos
 * asociados a una categoría específica.
 */


const categoryRouter = Router();

// Rutas CRUD de categorías.
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.post("/", createCategory);
categoryRouter.put("/:id", updateCategory);
categoryRouter.delete("/:id", deleteCategory);

categoryRouter.get("/:id/products", getProductsByCategory);

export default categoryRouter;
