# Backend - API de Gestión de Productos y Categorías

## Descripción

Este proyecto corresponde al Backend de una API REST desarrollada con Node.js y Express. Permite administrar productos y categorías mediante operaciones CRUD siguiendo una arquitectura Modelo-Controlador (MVC).

## Tecnologías utilizadas

- Node.js
- Express.js
- JavaScript (ES Modules)

## Estructura del proyecto

```
project/
├── controllers/
├── data/
├── models/
├── routes/
└── app.js
```

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm start
```

o

```bash
npm run dev
```

---


### **Capa de Datos (`products.data.js`)**

Esta capa representa nuestra **Fuente de Datos**. En un desarrollo profesional, aquí es donde conectaríamos con una base de datos real (como MySQL o PostgreSQL). Para este ejercicio, utilizamos un **arreglo de objetos en memoria** que actúa como nuestro almacén temporal.

---

#### **Estructura del Objeto "Producto"**

Para que el sistema funcione correctamente, cada producto dentro del arreglo debe seguir la misma estructura (esquema). Esto permite que el Modelo y el Controlador puedan procesar la información sin errores:

* **`id` (Número):** Es el identificador único. Funciona como la "cédula" del producto; no puede haber dos iguales. Es fundamental para las operaciones de búsqueda y eliminación.
* **`name` (Texto):** El nombre descriptivo del artículo tecnológico.
* **`price` (Número):** El costo del producto. Se maneja como número para poder realizar operaciones matemáticas (como sumas de totales o filtros de precios).
* **`categoryId` (Número):** El identificador de la categoría a la que pertenece el producto. Sirve como clave foránea en memoria: vincula cada producto con su categoría dentro de `categories.data.js`.

---

#### **Estructura del Objeto "Categoría" (`categories.data.js`)**

Cada categoría en el arreglo sigue el siguiente esquema:

* **`id` (Número):** El identificador único de la categoría.
* **`name` (Texto):** El nombre descriptivo de la categoría (por ejemplo, "Periféricos y Accesorios").

**Integridad referencial:** un producto solo puede asociarse a una categoría que exista. Al crear o actualizar un producto se valida que el `categoryId` corresponda a una categoría registrada; en caso contrario, se lanza un error.

