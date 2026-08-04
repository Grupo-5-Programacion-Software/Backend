import { AdminModel } from "../models/admin.model.js";

/**
 * Controlador del panel administrativo.
 *
 * Expone las estadísticas globales del sistema para el
 * panel de administración.
 */
// GET /admin/stats
/**
 * Devuelve los conteos globales de usuarios, tareas y PQRS.
 * @param {import("express").Request} req Petición HTTP entrante.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía las estadísticas (200) o error 500.
 */
const getStats = async (req, res) => {
  try {
    const stats = await AdminModel.getStats();
    res.status(200).json({
      success: true,
      message: "Estadísticas del sistema",
      data: stats,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las estadísticas",
      data: [],
      errors: [error.message],
    });
  }
};

export { getStats };
