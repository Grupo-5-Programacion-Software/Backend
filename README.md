# Backend — API REST de Gestión de Inventario

**Repositorio del backend del proyecto.** API REST construida con **Node.js + Express 5**
y arquitectura MVC (rutas → controladores → modelos) con persistencia en **MySQL**.

El código fuente activo y en desarrollo se encuentra en la rama [`develop`](../../tree/develop).

## Funcionalidades

- **Categorías y productos**: CRUD completo.
- **Usuarios**: CRUD y roles del sistema.
- **Tareas**: CRUD con asignación a usuarios y cambio de estado.
- **PQRS**: creación, cambio de estado y consulta.
- **Panel administrativo**: estadísticas globales (`GET /admin/stats`).

## Tecnologías

- Node.js · Express 5 · MySQL (mysql2) · dotenv · cors
- Nodemon solo en desarrollo (`npm run dev`)

## Rama `main`

Esta rama contiene únicamente la documentación general del proyecto.
Para contribuciones, revisión de código y desarrollo, trabajar sobre la rama `develop`.

## Enlaces

- [Código fuente (develop)](../../tree/develop)
- [Frontend Web](https://github.com/Grupo-5-Programacion-Software/Frontend)
- [Documentación general del proyecto](https://github.com/Grupo-5-Programacion-Software/.github)
- Última versión estable: `v1.0.0`
