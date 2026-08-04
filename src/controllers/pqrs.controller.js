import { PqrsModel } from "../models/pqrs.model.js";

/**
 * Controlador de PQRS.
 *
 * Maneja la lógica de negocio, las validaciones y las
 * respuestas HTTP de las solicitudes PQRS.
 *
 * Tipos válidos: peticion, queja, reclamo, sugerencia.
 * Estados válidos: abierta, en_proceso, cerrada.
 */
const TIPOS_VALIDOS = ["peticion", "queja", "reclamo", "sugerencia"];
const ESTADOS_VALIDOS = ["abierta", "en_proceso", "cerrada"];

// GET /pqrs
/**
 * Devuelve el listado completo de solicitudes PQRS.
 * @param {import("express").Request} req Petición HTTP entrante.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía la lista de solicitudes (200) o error 500.
 */
const getAllPqrs = async (req, res) => {
  try {
    const pqrs = await PqrsModel.findAll();
    res.status(200).json({
      success: true,
      message: "Lista de solicitudes PQRS",
      data: pqrs,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las solicitudes PQRS",
      data: [],
      errors: [error.message],
    });
  }
};

// GET /pqrs/:id
/**
 * Busca una solicitud por su ID y la devuelve si existe.
 * @param {import("express").Request} req Contiene el parámetro de ruta `id`.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía la solicitud (200), 404 si no existe o 500 en error.
 */
const getPqrsById = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await PqrsModel.findById(Number(id));

    if (!solicitud) {
      return res.status(404).json({
        success: false,
        message: `Solicitud con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Solicitud encontrada correctamente",
      data: solicitud,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al procesar la búsqueda",
      data: [],
      errors: [],
    });
  }
};

// POST /pqrs
/**
 * Crea una solicitud PQRS validando tipo y descripción.
 * @param {import("express").Request} req Contiene `type` y `description`.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía la solicitud creada (201), 400 si faltan datos o 500.
 */
const createPqrs = async (req, res) => {
  try {
    const { type, description } = req.body;

    if (!type || !description) {
      return res.status(400).json({
        success: false,
        message: "El tipo y la descripción de la solicitud son obligatorios",
        data: [],
        errors: [],
      });
    }

    if (!TIPOS_VALIDOS.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Tipo inválido. Válidos: ${TIPOS_VALIDOS.join(", ")}`,
        data: [],
        errors: [],
      });
    }

    const newPqrs = await PqrsModel.create({ type, description });
    res.status(201).json({
      success: true,
      message: "Solicitud enviada correctamente",
      data: newPqrs,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear la solicitud",
      data: [],
      errors: [error.message],
    });
  }
};

// PATCH /pqrs/:id
/**
 * Actualiza parcialmente una solicitud (p. ej. su estado).
 * @param {import("express").Request} req Contiene `id` en la ruta y campos en el cuerpo.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía la solicitud actualizada (200), 400/404 o 500 en error.
 */
const patchPqrs = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, description } = req.body;

    if (status && !ESTADOS_VALIDOS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Estado inválido. Válidos: ${ESTADOS_VALIDOS.join(", ")}`,
        data: [],
        errors: [],
      });
    }

    const updatedPqrs = await PqrsModel.patch(Number(id), {
      ...(status && { status }),
      ...(description !== undefined && { description }),
    });
    if (!updatedPqrs) {
      return res.status(404).json({
        success: false,
        message: `Solicitud con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Solicitud actualizada correctamente",
      data: updatedPqrs,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar la solicitud",
      data: [],
      errors: [error.message],
    });
  }
};

// DELETE /pqrs/:id
/**
 * Elimina una solicitud por su ID si existe.
 * @param {import("express").Request} req Contiene el parámetro de ruta `id`.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía confirmación (200), 404 si no existe o 500.
 */
const deletePqrs = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await PqrsModel.delete(Number(id));

    if (!isDeleted) {
      return res.status(404).json({
        success: false,
        message: `No se pudo eliminar: Solicitud con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Solicitud eliminada correctamente",
      data: [],
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al intentar eliminar la solicitud",
      data: [],
      errors: [error.message],
    });
  }
};

export { getAllPqrs, getPqrsById, createPqrs, patchPqrs, deletePqrs };
