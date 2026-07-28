# Backend - API de Gestión de Categorías y Productos

API REST construida con **Node.js + Express** siguiendo **Arquitectura en Capas** con persistencia en memoria.

## 🚀 Tecnologías

- Node.js
- Express 5
- Nodemon (desarrollo)

## 📁 Estructura del Proyecto

```
project/
├── app.js                     # Configuración de Express y rutas
├── controllers/               # Manejo de peticiones y respuestas HTTP
│   ├── category.controller.js
│   └── product.controller.js
├── models/                    # Lógica de acceso y manipulación de datos
│   ├── category.model.js
│   └── product.model.js
├── routes/                    # Definición de rutas y endpoints
│   ├── category.routes.js
│   └── product.routes.js
└── data/                      # Fuente de datos (arreglos en memoria)
    ├── categories.data.js
    └── products.data.js
```

## 📦 Instalación

```bash
npm install
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

## 🧪 Regla de Integridad

No se permite eliminar una categoría que tenga productos vinculados. Devuelve `409 Conflict` con el mensaje correspondiente.

## 📋 Formato de Respuesta

```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": [],
  "errors": []
}
```
