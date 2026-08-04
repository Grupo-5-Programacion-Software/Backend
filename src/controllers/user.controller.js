import { UserModel } from "../models/user.model.js";

/**
 * Controlador de usuarios.
 *
 * Maneja la lógica de negocio, las validaciones y las
 * respuestas HTTP con sus códigos de estado:
 *   200 (éxito), 201 (creado), 400 (datos inválidos),
 *   404 (no encontrado), 409 (conflicto) y 500 (error interno).
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET /users
/**
 * Devuelve el listado completo de usuarios.
 * @param {import("express").Request} req Petición HTTP entrante.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía la lista de usuarios (200) o error 500.
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    res.status(200).json({
      success: true,
      message: "Lista de usuarios",
      data: users,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los usuarios",
      data: [],
      errors: [error.message],
    });
  }
};

// GET /users/:id
/**
 * Busca un usuario por su ID y lo devuelve si existe.
 * @param {import("express").Request} req Contiene el parámetro de ruta `id`.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía el usuario (200), 404 si no existe o 500 en error.
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(Number(id));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${id} no encontrado`,
        data: [],
        errors: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Usuario encontrado correctamente",
      data: user,
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

// POST /users
/**
 * Crea un usuario validando que nombre y correo sean obligatorios.
 * @param {import("express").Request} req Contiene `name` y `email` en el cuerpo.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía el usuario creado (201), 400/409 si hay conflicto o 500.
 */
const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "El nombre y el correo electrónico son obligatorios",
        data: [],
        errors: [],
      });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: "El formato del correo electrónico no es válido",
        data: [],
        errors: [],
      });
    }

    const existing = await UserModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Ya existe un usuario con ese correo electrónico",
        data: [],
        errors: [],
      });
    }

    const newUser = await UserModel.create({ name, email });
    res.status(201).json({
      success: true,
      message: "Usuario creado correctamente",
      data: newUser,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear el usuario",
      data: [],
      errors: [error.message],
    });
  }
};

// PUT /users/:id
/**
 * Actualiza los datos de un usuario existente.
 * @param {import("express").Request} req Contiene `id` en la ruta y campos en el cuerpo.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía el usuario actualizado (200), 404 si no existe o 500.
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "El nombre y el correo electrónico son obligatorios",
        data: [],
        errors: [],
      });
    }

    const updatedUser = await UserModel.update(Number(id), { name, email });
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${id} no encontrado`,
        data: [],
        errors: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente",
      data: updatedUser,
      errors: [],
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Ya existe un usuario con ese correo electrónico",
        data: [],
        errors: [error.message],
      });
    }
    res.status(500).json({
      success: false,
      message: "Error al actualizar el usuario",
      data: [],
      errors: [error.message],
    });
  }
};

// DELETE /users/:id
/**
 * Elimina un usuario por su ID si existe.
 * Las tareas asociadas conservan su historial (FK con SET NULL).
 * @param {import("express").Request} req Contiene el parámetro de ruta `id`.
 * @param {import("express").Response} res Respuesta HTTP saliente.
 * @returns {void} Envía confirmación (200), 404 si no existe o 500.
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await UserModel.delete(Number(id));

    if (!isDeleted) {
      return res.status(404).json({
        success: false,
        message: `No se pudo eliminar: Usuario con ID ${id} no encontrado`,
        data: [],
        errors: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Usuario eliminado correctamente",
      data: [],
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al intentar eliminar el usuario",
      data: [],
      errors: [error.message],
    });
  }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
