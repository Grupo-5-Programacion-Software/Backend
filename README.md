# Backend - API de Gestión de Categorías y Productos

API REST construida con **Node.js + Express** siguiendo **Arquitectura en Capas** con persistencia en **MySQL**.

## 🚀 Tecnologías

- Node.js
- Express 5
- MySQL 8 (mysql2)
- Nodemon (desarrollo)

## 📁 Estructura del Proyecto

```
project/
├── app.js                     # Configuración de Express y rutas
├── config/
│   └── db.js                  # Configuración y pool de conexión a MySQL
├── controllers/               # Manejo de peticiones y respuestas HTTP
│   ├── category.controller.js
│   ├── product.controller.js
│   ├── user.controller.js
│   ├── task.controller.js
│   ├── pqrs.controller.js
│   └── admin.controller.js
├── models/                    # Lógica de acceso y manipulación de datos
│   ├── category.model.js
│   ├── product.model.js
│   ├── user.model.js
│   ├── task.model.js
│   ├── pqrs.model.js
│   └── admin.model.js
├── routes/                    # Definición de rutas y endpoints
│   ├── category.routes.js
│   ├── product.routes.js
│   ├── user.routes.js
│   ├── task.routes.js
│   ├── pqrs.routes.js
│   └── admin.routes.js
└── database/
    └── schema.sql             # Creación de la BD, tablas y datos iniciales
```

## 📦 Instalación

```bash
npm install
```

## 🗄️ Configurar la base de datos

Copia el archivo `.env.example` a `.env` y completa las credenciales de tu MySQL:

```bash
cp .env.example .env
```

Crea la base de datos, las tablas y los datos iniciales:

```bash
mysql -u root -p < project/database/schema.sql
```

## ▶️ Ejecución

```bash
npm start
```

## 🔌 Endpoints

### Categorías

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/categories` | Listar todas las categorías |
| GET | `/categories/:id` | Obtener categoría por ID |
| POST | `/categories` | Crear una categoría |
| PUT | `/categories/:id` | Actualizar una categoría |
| DELETE | `/categories/:id` | Eliminar categoría (solo si no tiene productos) |
| GET | `/categories/:id/products` | Obtener productos de una categoría |

### Productos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/products` | Listar todos los productos |
| GET | `/products/:id` | Obtener producto por ID |
| POST | `/products` | Crear un producto |
| PUT | `/products/:id` | Actualizar un producto |
| DELETE | `/products/:id` | Eliminar un producto |

### Usuarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users` | Listar todos los usuarios |
| GET | `/users/:id` | Obtener usuario por ID |
| POST | `/users` | Crear un usuario (`name`, `email`) |
| PUT | `/users/:id` | Actualizar un usuario |
| DELETE | `/users/:id` | Eliminar un usuario |

### Tareas (asignación a usuarios)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/tasks` | Listar todas las tareas |
| GET | `/tasks/:id` | Obtener tarea por ID |
| POST | `/tasks` | Crear tarea (`title`, `description`, `userId`) |
| PUT | `/tasks/:id` | Actualizar tarea completa |
| PATCH | `/tasks/:id` | Actualización parcial (p. ej. `status`) |
| DELETE | `/tasks/:id` | Eliminar una tarea |

Estados de tarea: `pendiente`, `en_progreso`, `completada`.

### PQRS

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/pqrs` | Listar todas las solicitudes |
| GET | `/pqrs/:id` | Obtener solicitud por ID |
| POST | `/pqrs` | Crear solicitud (`type`, `description`) |
| PATCH | `/pqrs/:id` | Actualizar estado (`abierta`, `en_proceso`, `cerrada`) |
| DELETE | `/pqrs/:id` | Eliminar una solicitud |

Tipos de PQRS: `peticion`, `queja`, `reclamo`, `sugerencia`.

### Panel Administrativo

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/admin/stats` | Conteos de usuarios, tareas y PQRS |

## 🧪 Reglas de Integridad

- No se permite eliminar una categoría que tenga productos vinculados. Devuelve `409 Conflict`.
- El correo de un usuario es único. Un correo duplicado devuelve `409 Conflict`.
- Al eliminar un usuario, sus tareas quedan sin asignar (`ON DELETE SET NULL`), conservando el historial.
- No se puede asignar una tarea a un usuario inexistente. Devuelve `400 Bad Request`.

## 📋 Formato de Respuesta

```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": [],
  "errors": []
}
```
