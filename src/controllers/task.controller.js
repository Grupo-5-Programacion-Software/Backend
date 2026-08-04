import { TaskModel } from "../models/task.model.js";

/**
 * Controlador de tareas.
 *
 * Maneja la lógica de negocio, las validaciones y las
 * respuestas HTTP de la gestión de tareas.
 *
 * Estados válidos de una tarea: pendiente, en_progreso, completada.
 */
const ESTADOS_VALIDOS = ["pendiente", "en_progreso", "completada"];

// GET /tasks
/**
 * Devuelve el listado de tareas con su usuario asignado.
 * Acepta filtros opcionales en la URL:
 *   ?status=pendiente|en_progreso|completada
 *   ?userId=1
 *   ?q=texto (busca en título o descripción)
 * @param {import("express").Request} req Contiene los filtros en `req.query`.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía la lista de tareas (200), 400 si el estado es inválido o 500.
 */
const getAllTasks = async (req, res) => {
  try {
    const { status, userId, q } = req.query;

    if (status && !ESTADOS_VALIDOS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Estado inválido. Válidos: ${ESTADOS_VALIDOS.join(", ")}`,
        data: [],
        errors: [],
      });
    }

    const tasks = await TaskModel.findAll({
      status,
      userId: userId !== undefined ? Number(userId) : undefined,
      q,
    });
    res.status(200).json({
      success: true,
      message: "Lista de tareas",
      data: tasks,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las tareas",
      data: [],
      errors: [error.message],
    });
  }
};

// GET /tasks/:id
/**
 * Busca una tarea por su ID y la devuelve si existe.
 * @param {import("express").Request} req Contiene el parámetro de ruta `id`.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía la tarea (200), 404 si no existe o 500 en error.
 */
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await TaskModel.findById(Number(id));

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Tarea con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Tarea encontrada correctamente",
      data: task,
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

// POST /tasks
/**
 * Crea una tarea validando que el título sea obligatorio.
 * @param {import("express").Request} req Contiene `title`, `description` y `userId`.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía la tarea creada (201), 400 si faltan datos o 500.
 */
const createTask = async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "El título de la tarea es obligatorio",
        data: [],
        errors: [],
      });
    }

    const newTask = await TaskModel.create({
      title,
      description,
      userId: userId !== undefined ? Number(userId) : undefined,
    });
    res.status(201).json({
      success: true,
      message: "Tarea creada correctamente",
      data: newTask,
      errors: [],
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        success: false,
        message: "El usuario asignado no existe",
        data: [],
        errors: [error.message],
      });
    }
    res.status(500).json({
      success: false,
      message: "Error al crear la tarea",
      data: [],
      errors: [error.message],
    });
  }
};

// PUT /tasks/:id
/**
 * Actualiza los campos enviados de una tarea existente.
 * @param {import("express").Request} req Contiene `id` en la ruta y campos en el cuerpo.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía la tarea actualizada (200), 404 si no existe o 500.
 */
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, userId } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "El título de la tarea es obligatorio",
        data: [],
        errors: [],
      });
    }
    if (status && !ESTADOS_VALIDOS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Estado inválido. Válidos: ${ESTADOS_VALIDOS.join(", ")}`,
        data: [],
        errors: [],
      });
    }

    const updatedTask = await TaskModel.update(Number(id), {
      title,
      description,
      status: status || "pendiente",
      userId: userId !== undefined ? Number(userId) : null,
    });
    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: `Tarea con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Tarea actualizada correctamente",
      data: updatedTask,
      errors: [],
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        success: false,
        message: "El usuario asignado no existe",
        data: [],
        errors: [error.message],
      });
    }
    res.status(500).json({
      success: false,
      message: "Error al actualizar la tarea",
      data: [],
      errors: [error.message],
    });
  }
};

// PATCH /tasks/:id
/**
 * Actualiza parcialmente una tarea (p. ej. solo el estado).
 * @param {import("express").Request} req Contiene `id` en la ruta y campos en el cuerpo.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía la tarea actualizada (200), 400/404 o 500 en error.
 */
const patchTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status && !ESTADOS_VALIDOS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Estado inválido. Válidos: ${ESTADOS_VALIDOS.join(", ")}`,
        data: [],
        errors: [],
      });
    }

    const updatedTask = await TaskModel.patch(Number(id), { status });
    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: `Tarea con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Tarea actualizada correctamente",
      data: updatedTask,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar la tarea",
      data: [],
      errors: [error.message],
    });
  }
};

// DELETE /tasks/:id
/**
 * Elimina una tarea por su ID si existe.
 * @param {import("express").Request} req Contiene el parámetro de ruta `id`.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía confirmación (200), 404 si no existe o 500.
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await TaskModel.delete(Number(id));

    if (!isDeleted) {
      return res.status(404).json({
        success: false,
        message: `No se pudo eliminar: Tarea con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Tarea eliminada correctamente",
      data: [],
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al intentar eliminar la tarea",
      data: [],
      errors: [error.message],
    });
  }
};

export { getAllTasks, getTaskById, createTask, updateTask, patchTask, deleteTask };
