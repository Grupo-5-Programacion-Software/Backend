# Backend - API de Gestión de Categorías y Productos

API REST construida con **Node.js + Express** siguiendo **Arquitectura en Capas** con persistencia en **MySQL**.

## 🚀 Tecnologías

- Node.js
- Express 5
- MySQL 8 (mysql2)
- Nodemon (desarrollo)

## 📁 Estructura del Proyecto

```
src/
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

Copia el archivo `.env.example` a `.env` y completa las credenciales de tu MySQL.
Si la contraseña empieza con `#`, debe ir entre comillas (`DB_PASSWORD="#..."`):

```bash
cp .env.example .env
```

Crea (o completa) la base de datos, las tablas y los datos iniciales. El script
**respeta una base `inventario_adso` ya existente**: usa `CREATE TABLE IF NOT EXISTS`
y `INSERT IGNORE`, por lo que conserva los registros actuales y solo crea las tablas
que falten (`tasks`, `pqrs`):

```bash
mysql -u root -p < src/database/schema.sql
```

## ▶️ Ejecución

```bash
npm start        # ejecución en producción (node)
npm run dev      # desarrollo con auto-reinicio (nodemon)
```

El servidor queda escuchando en `http://localhost:3000`.

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

```bash
# Crear una categoría
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Accesorios"}'
```

### Productos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/products` | Listar todos los productos |
| GET | `/products/:id` | Obtener producto por ID |
| POST | `/products` | Crear un producto |
| PUT | `/products/:id` | Actualizar un producto |
| DELETE | `/products/:id` | Eliminar un producto |

```bash
# Crear un producto (el código PRD-NNN se genera automáticamente)
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Mouse Gamer", "price": 45.90, "stock": 12, "categoryId": 2}'
```

### Usuarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users` | Listar todos los usuarios |
| GET | `/users/:id` | Obtener usuario por ID |
| POST | `/users` | Crear un usuario (`name`, `email`) |
| PUT | `/users/:id` | Actualizar un usuario |
| DELETE | `/users/:id` | Eliminar un usuario |

```bash
# Crear un usuario
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Ana Torres", "email": "ana.torres@mail.com"}'
```

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

```bash
# Crear una tarea asignada a un usuario existente
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Revisar stock", "description": "Auditoría mensual", "userId": 2}'

# Cambiar el estado de una tarea
curl -X PATCH http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completada"}'
```

### PQRS

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/pqrs` | Listar todas las solicitudes |
| GET | `/pqrs/:id` | Obtener solicitud por ID |
| POST | `/pqrs` | Crear solicitud (`type`, `description`) |
| PATCH | `/pqrs/:id` | Actualizar estado (`abierta`, `en_proceso`, `cerrada`) |
| DELETE | `/pqrs/:id` | Eliminar una solicitud |

Tipos de PQRS: `peticion`, `queja`, `reclamo`, `sugerencia`.

```bash
# Enviar una solicitud
curl -X POST http://localhost:3000/pqrs \
  -H "Content-Type: application/json" \
  -d '{"type": "reclamo", "description": "El teclado llegó dañado"}'

# Cambiar el estado de una solicitud
curl -X PATCH http://localhost:3000/pqrs/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "en_proceso"}'
```

### Panel Administrativo

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/admin/stats` | Conteos de usuarios, tareas y PQRS |

```bash
curl http://localhost:3000/admin/stats
```

## 🧪 Reglas de Integridad

- No se permite eliminar una categoría que tenga productos vinculados. Devuelve `409 Conflict`.
- El correo de un usuario es único. Un correo duplicado devuelve `409 Conflict`.
- Al eliminar un usuario, sus tareas quedan sin asignar (`ON DELETE SET NULL`), conservando el historial.
- No se puede asignar una tarea a un usuario inexistente. Devuelve `400 Bad Request`.

## 📋 Formato de Respuesta

Todas las respuestas (éxito y error) usan la misma estructura:

```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": [],
  "errors": []
}
```

- `success`: `true` si la operación fue exitosa, `false` si falló.
- `message`: descripción legible del resultado.
- `data`: resultado de la operación (objeto, arreglo o `[]`).
- `errors`: mensajes de error detallados (vacío si no hubo).

## 🔗 Integración con el Frontend

El frontend (Vite) consume esta API mediante un **proxy**: en desarrollo,
las peticiones que empiezan por `/api` se redirigen a `http://localhost:3000`
y se les quita el prefijo `/api`. Por eso desde el navegador basta usar
`/api/users`, `/api/products`, etc. sin preocuparse por CORS.

Pasos para probar el sistema completo:

1. Levantar el backend: `npm start` (puerto 3000).
2. Levantar el frontend: `npm run dev` en el repositorio `Frontend` (puerto 5173).
3. Abrir `http://localhost:5173` y navegar entre las pestañas del sistema.
