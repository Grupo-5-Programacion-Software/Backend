import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

/**
 * Rutas para la gestión de usuarios.
 *
 * Define los endpoints encargados de consultar, crear,
 * actualizar y eliminar usuarios del sistema.
 */
const userRouter = Router();

// Rutas CRUD de usuarios.
userRouter.get("/", getAllUsers);        // Listar todos los usuarios
userRouter.get("/:id", getUserById);     // Obtener un usuario por ID
userRouter.post("/", createUser);        // Crear un usuario
userRouter.put("/:id", updateUser);      // Actualizar un usuario
userRouter.delete("/:id", deleteUser);   // Eliminar un usuario

export default userRouter;
