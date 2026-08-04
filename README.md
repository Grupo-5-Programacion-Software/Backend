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
├── config/db.js           # Pool de conexión a MySQL
├── controllers/           # Maneja HTTP request/response
│   ├── category.controller.js
│   ├── product.controller.js
│   ├── user.controller.js
│   ├── task.controller.js
│   ├── pqrs.controller.js
│   └── admin.controller.js
├── models/                # Lógica de acceso a datos por recurso
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

## 5. Cómo levantar la API

```bash
npm start
npm run dev
```

La API queda disponible en:

- `http://localhost:3000`
- salud: `http://localhost:3000/health`

## 6. Endpoints principales

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

## 7. Formato de respuesta estándar

Todas las rutas responden con el mismo formato:

```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": [],
  "errors": []
}
```

## 8. Reglas de integridad

- No se puede borrar una categoría si tiene productos asociados.
- El correo del usuario debe ser único.
- Si un usuario se elimina, las tareas quedan sin asignar.
- Las tareas deben apuntar a usuarios existentes.

## 9. Cómo probar la API

Ejemplos de uso con `curl`:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/categories
curl -X POST http://localhost:3000/categories -H "Content-Type: application/json" -d '{"name":"Accesorios"}'
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Revisar stock","description":"Auditoría","userId":2}'
curl http://localhost:3000/admin/stats
```

## 10. Relación con el frontend

El frontend usa el proxy de Vite para redirigir `/api` hacia el backend en `http://localhost:3000`. Por eso el frontend puede consumir los endpoints sin tener CORS en desarrollo. La app de frontend además tiene un respaldo local para demo cuando el backend no está levantado.

