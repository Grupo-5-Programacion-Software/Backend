# Backend - API REST de Gestión

API REST construida con Node.js, Express y MySQL para soportar el frontend del sistema de gestión.

## 1. Qué expone esta API

La API ofrece endpoints para:

- gestionar categorías,
- gestionar productos,
- gestionar usuarios,
- crear y actualizar tareas,
- registrar y clasificar PQRS,
- consultar estadísticas globales del sistema.

## 2. Tecnologías

- Node.js
- Express 5
- MySQL 8 + mysql2
- dotenv
- cors
- nodemon para desarrollo

## 3. Estructura real del backend

```text
src/
├── app.js                 # Arranque de Express, middlewares y montaje de rutas
├── config/db.js           # Pool de conexión a MySQL (variables del .env)
├── controllers/           # Maneja HTTP request/response y validaciones
│   ├── category.controller.js
│   ├── product.controller.js
│   ├── user.controller.js
│   ├── task.controller.js
│   ├── pqrs.controller.js
│   └── admin.controller.js
├── models/                # Lógica de acceso a datos por recurso (consultas SQL)
│   ├── category.model.js
│   ├── product.model.js
│   ├── user.model.js
│   ├── task.model.js
│   ├── pqrs.model.js
│   └── admin.model.js
├── routes/                # Definición de endpoints por recurso
│   ├── category.routes.js
│   ├── product.routes.js
│   ├── user.routes.js
│   ├── task.routes.js
│   ├── pqrs.routes.js
│   └── admin.routes.js
└── database/
    └── schema.sql         # Script de base de datos y datos base
```

## 4. Preparación de entorno

Instala dependencias:

```bash
npm install
```

Copia el ejemplo de variables de entorno:

```bash
cp .env.example .env
```

Archivo `.env.example`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD="tu_contraseña"
DB_NAME=inventario_adso
PORT=3000
```

> Nota: si la contraseña comienza con `#`, debe ir entre comillas.

La base de datos se crea automáticamente al ejecutar `npm run dev` o `npm start` (el script `src/scripts/initDb.js` crea la BD, las tablas y los datos semilla si faltan). Solo si prefieres crearla manualmente:

```bash
mysql -u root -p < src/database/schema.sql
```

## 5. Cómo levantar la API

```bash
npm start
npm run dev
```

La API queda disponible en:

- `http://localhost:3000`
- salud: `http://localhost:3000/health`

## 6. Cómo se usa el código (arquitectura)

### Ciclo de vida de una petición

```text
Cliente (frontend/curl)
  -> Express recibe la petición (app.js)
    -> middlewares globales: cors() y express.json()
    -> el router del recurso dirige la ruta (routes/user.routes.js)
      -> el controller valida y orquesta (controllers/user.controller.js)
        -> el modelo ejecuta la consulta preparada (models/user.model.js)
          -> pool de mysql2 (config/db.js) -> MySQL
  <- respuesta JSON estándar hacia el cliente
```

### Capas y responsabilidades

- **`app.js`**: crea la app Express, aplica middlewares globales (`cors()`, `express.json()`, `express.urlencoded()`), monta cada router en su prefijo (`/products`, `/categories`, `/users`, `/tasks`, `/pqrs`, `/admin`), define la respuesta 404 para rutas no encontradas y levanta el servidor en el puerto `PORT` (por defecto 3000).
- **`routes/*.routes.js`**: definen únicamente qué método HTTP y ruta llaman a qué controller (sin lógica de negocio).
- **`controllers/*.controller.js`**: reciben `req`/`res`, validan la entrada (campos obligatorios, formato de correo con `EMAIL_REGEX`), llaman al modelo correspondiente y responden con el código HTTP adecuado. Cada controller usa `try/catch` para responder 500 con el mensaje del error.
- **`models/*.model.js`**: ejecutan las consultas SQL con **consultas preparadas** (placeholders `?`) para evitar inyección SQL, y devuelven los datos ya mapeados (ej. `created_at AS createdAt`).
- **`config/db.js`**: exporta un **pool de conexiones** MySQL reutilizable (`waitForConnections`, `connectionLimit: 10`) y el nombre de la base de datos, todo desde variables de entorno.

### Códigos de estado utilizados

| Código | Significado |
|---|---|
| 200 | Éxito (listado, consulta, actualización, eliminación) |
| 201 | Recurso creado |
| 400 | Datos inválidos o campos obligatorios faltantes |
| 404 | Recurso no encontrado |
| 409 | Conflicto (ej. correo de usuario duplicado) |
| 500 | Error interno del servidor |

### Ejemplo transversal: "agregar un usuario"

1. El frontend hace `POST /api/users` con `{ name, email, password }`.
2. Vite redirige a `POST http://localhost:3000/users` (quita el prefijo `/api`).
3. `user.routes.js` dirige a `createUser` en `user.controller.js`.
4. El controller valida que `name` y `email` existan y que el correo tenga formato válido (400 si falla).
5. `UserModel.findByEmail()` verifica duplicados (409 si ya existe).
6. `UserModel.create()` ejecuta `INSERT INTO usuarios (name, email, password) VALUES (?, ?, ?)`.
7. El controller responde `201` con el usuario creado; el frontend muestra la notificación y re-renderiza la tabla sin recargar.

## 7. Esquema de base de datos

El archivo `src/database/schema.sql` usa `CREATE TABLE IF NOT EXISTS` e `INSERT IGNORE`, por lo que **no sobrescribe** una base de datos ya existente. Las tablas están en español: `categorias`, `productos`, `usuarios`, `tareas` y `pqrs`.

Relaciones entre tablas:

```text
categorias 1 --- N productos     (category_id, FK)
usuarios   1 --- N tareas        (user_id, FK con ON DELETE SET NULL)
pqrs                              (tabla independiente)
```

- `productos.category_id` → referencia `categorias(id)`: no se puede borrar una categoría con productos asociados.
- `tareas.user_id` → referencia `usuarios(id)` con `ON DELETE SET NULL`: al eliminar un usuario, sus tareas conservan el historial pero quedan sin asignar.
- `usuarios.email` es `UNIQUE`: garantiza que no haya correos duplicados.
- `tasks.status` es `ENUM('pendiente','en_progreso','completada')`; `pqrs.type` y `pqrs.status` también usan `ENUM` para restringir los valores.

El script también inserta datos semilla: 8 categorías, 3 usuarios de demostración, tareas y PQRS de ejemplo.

## 8. Endpoints principales

### Categorías

| Método | Ruta | Descripción |
|---|---|---|
| GET | /categories | Lista categorías |
| GET | /categories/:id | Obtiene una categoría |
| POST | /categories | Crea una categoría |
| PUT | /categories/:id | Actualiza una categoría |
| DELETE | /categories/:id | Elimina una categoría |

### Productos

| Método | Ruta | Descripción |
|---|---|---|
| GET | /products | Lista productos |
| GET | /products/:id | Obtiene un producto |
| POST | /products | Crea un producto |
| PUT | /products/:id | Actualiza un producto |
| DELETE | /products/:id | Elimina un producto |

### Usuarios

| Método | Ruta | Descripción |
|---|---|---|
| GET | /users | Lista usuarios |
| GET | /users/:id | Obtiene un usuario |
| POST | /users | Crea un usuario |
| PUT | /users/:id | Actualiza un usuario |
| DELETE | /users/:id | Elimina un usuario |

### Tareas

| Método | Ruta | Descripción |
|---|---|---|
| GET | /tasks | Lista tareas |
| GET | /tasks/:id | Obtiene una tarea |
| POST | /tasks | Crea una tarea |
| PUT | /tasks/:id | Actualiza una tarea |
| PATCH | /tasks/:id | Actualiza parcialmente el estado |
| DELETE | /tasks/:id | Elimina una tarea |

Estados permitidos:

- pendiente
- en_progreso
- completada

### PQRS

| Método | Ruta | Descripción |
|---|---|---|
| GET | /pqrs | Lista PQRS |
| GET | /pqrs/:id | Obtiene una PQRS |
| POST | /pqrs | Crea una PQRS |
| PATCH | /pqrs/:id | Cambia estado |
| DELETE | /pqrs/:id | Elimina una PQRS |

Estados permitidos:

- abierta
- en_proceso
- cerrada

### Administración

| Método | Ruta | Descripción |
|---|---|---|
| GET | /admin/stats | Estadísticas globales |

## 9. Formato de respuesta estándar

Todas las rutas responden con el mismo formato:

```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": [],
  "errors": []
}
```

## 10. Reglas de integridad

- No se puede borrar una categoría si tiene productos asociados.
- El correo del usuario debe ser único.
- Si un usuario se elimina, las tareas quedan sin asignar.
- Las tareas deben apuntar a usuarios existentes.

## 11. Cómo probar la API

Ejemplos de uso con `curl`:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/categories
curl -X POST http://localhost:3000/categories -H "Content-Type: application/json" -d '{"name":"Accesorios"}'
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Revisar stock","description":"Auditoría","userId":2}'
curl http://localhost:3000/admin/stats
```

## 12. Relación con el frontend

El frontend usa el proxy de Vite para redirigir `/api` hacia el backend en `http://localhost:3000`. Por eso el frontend puede consumir los endpoints sin tener CORS en desarrollo. La app de frontend además tiene un respaldo local para demo cuando el backend no está levantado.
