import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  patchTask,
  deleteTask,
} from "../controllers/task.controller.js";

/**
 * Rutas para la gestión de tareas.
 *
 * Define los endpoints encargados de consultar, crear,
 * actualizar (PUT total / PATCH parcial) y eliminar tareas,
 * así como su asignación a usuarios.
 */
const taskRouter = Router();

// Rutas CRUD de tareas.
taskRouter.get("/", getAllTasks);          // Listar todas las tareas
taskRouter.get("/:id", getTaskById);       // Obtener una tarea por ID
taskRouter.post("/", createTask);          // Crear una tarea
taskRouter.put("/:id", updateTask);        // Actualizar una tarea
taskRouter.patch("/:id", patchTask);       // Actualización parcial (estado)
taskRouter.delete("/:id", deleteTask);     // Eliminar una tarea

export default taskRouter;
