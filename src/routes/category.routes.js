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
categoryRouter.get("/", getAllCategories);                 // Listar todas las categorías
categoryRouter.get("/:id", getCategoryById);               // Obtener una categoría por ID
categoryRouter.post("/", createCategory);                  // Crear una categoría
categoryRouter.put("/:id", updateCategory);                // Actualizar una categoría
categoryRouter.delete("/:id", deleteCategory);             // Eliminar una categoría

// Productos asociados a una categoría.
categoryRouter.get("/:id/products", getProductsByCategory); // GET /categories/:id/products

export default categoryRouter;
