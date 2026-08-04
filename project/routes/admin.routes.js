import { Router } from "express";
import { getStats } from "../controllers/admin.controller.js";

/**
 * Rutas del panel administrativo.
 *
 * Define los endpoints que alimentan el panel de administración
 * con estadísticas globales del sistema.
 */
const adminRouter = Router();

// Estadísticas globales.
adminRouter.get("/stats", getStats); // GET /admin/stats

export default adminRouter;
