import { Router } from "express";
import {
  getAllPqrs,
  getPqrsById,
  createPqrs,
  patchPqrs,
  deletePqrs,
} from "../controllers/pqrs.controller.js";

/**
 * Rutas para la gestión de PQRS.
 *
 * Define los endpoints encargados de consultar, crear,
 * actualizar parcialmente y eliminar solicitudes PQRS.
 */
const pqrsRouter = Router();

// Rutas de PQRS.
pqrsRouter.get("/", getAllPqrs);         // Listar todas las solicitudes
pqrsRouter.get("/:id", getPqrsById);     // Obtener una solicitud por ID
pqrsRouter.post("/", createPqrs);        // Crear una solicitud
pqrsRouter.patch("/:id", patchPqrs);     // Actualizar parcial (estado)
pqrsRouter.delete("/:id", deletePqrs);   // Eliminar una solicitud

export default pqrsRouter;
