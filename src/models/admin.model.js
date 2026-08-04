import { pool } from "../config/db.js";

/**
 * Modelo del panel administrativo.
 *
 * Agrupa las consultas de agregación que alimentan el panel
 * administrativo (conteos globales del sistema).
 */
export const AdminModel = {
  // Calcula los totales de usuarios, tareas y PQRS.
  /**
   * @returns {Promise<{users: number, tasks: number, pqrs: number}>} Estadísticas globales.
   */
  getStats: async () => {
    const [[users]] = await pool.query("SELECT COUNT(*) AS total FROM usuarios");
    const [[tasks]] = await pool.query("SELECT COUNT(*) AS total FROM tareas");
    const [[pqrs]] = await pool.query("SELECT COUNT(*) AS total FROM pqrs");

    return {
      users: users.total,
      tasks: tasks.total,
      pqrs: pqrs.total,
    };
  },
};
