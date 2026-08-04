-- Esquema de la base de datos: inventario_adso
-- Este script respeta una base de datos ya existente: solo crea
-- las tablas que falten (CREATE TABLE IF NOT EXISTS) y sus datos
-- semilla usan INSERT IGNORE para no sobrescribir registros reales.
-- Ejecutar: mysql -u root -p < project/database/schema.sql

CREATE DATABASE IF NOT EXISTS inventario_adso;
USE inventario_adso;

-- ==========================================================
-- TABLA DE CATEGORÍAS (ya existe en la BD: no se modifica)
-- ==========================================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================================
-- TABLA DE PRODUCTOS (ya existe en la BD: no se modifica)
-- ==========================================================
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  stock INT NOT NULL DEFAULT 0,
  category_id INT NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- ==========================================================
-- TABLA DE USUARIOS (ya existe en la BD: no se modifica)
-- ==========================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================================
-- TABLA DE TAREAS (nueva)
--   status: pendiente | en_progreso | completada
--   Al eliminar un usuario, sus tareas quedan sin asignar
--   (ON DELETE SET NULL) para conservar el historial.
-- ==========================================================
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status ENUM('pendiente', 'en_progreso', 'completada') DEFAULT 'pendiente',
  user_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ==========================================================
-- TABLA DE PQRS (nueva)
--   type:   peticion | queja | reclamo | sugerencia
--   status: abierta | en_proceso | cerrada
-- ==========================================================
CREATE TABLE IF NOT EXISTS pqrs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('peticion', 'queja', 'reclamo', 'sugerencia') NOT NULL,
  description TEXT NOT NULL,
  status ENUM('abierta', 'en_proceso', 'cerrada') DEFAULT 'abierta',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- DATOS SEMILLA (INSERT IGNORE: no reemplaza datos existentes)
-- ==========================================================

-- Categorías base (se omiten las que ya existan).
INSERT IGNORE INTO categories (id, name, description) VALUES
  (1, 'Laptops y Computadoras', 'Computadores portátiles y de escritorio'),
  (2, 'Periféricos', 'Mouse, teclados y accesorios'),
  (3, 'Monitores y Pantallas', 'Monitores y displays'),
  (4, 'Audio', 'Parlantes, audífonos y micrófonos'),
  (5, 'Almacenamiento', 'Discos, SSDs y memorias'),
  (6, 'Componentes Internos', 'RAM, CPU, GPU y tarjetas'),
  (7, 'Redes y Conectividad', 'Routers, switches y cables'),
  (8, 'Impresoras y Escáneres', 'Equipos de impresión');

-- Usuarios de demostración (requieren password, obligatorio en la BD).
INSERT IGNORE INTO users (id, name, email, password) VALUES
  (1, 'Lucia Lizcano', 'lulizcano.aa@hotmail.com', 'cambiar123'),
  (2, 'Juan Perez', 'juan@gmail.com', 'cambiar123'),
  (3, 'Prueba', 'prueba@gmail.com', 'cambiar123');

-- Tareas de ejemplo (tabla nueva: siempre se insertan).
INSERT INTO tasks (title, description, status, user_id) VALUES
  ('Revisar inventario de periféricos', 'Verificar stock de mouse y teclados.', 'en_progreso', 2),
  ('Actualizar precios de laptops', 'Revisar listas y aplicar nuevos precios.', 'pendiente', 1),
  ('Atender reclamo de envío', 'Contactar al cliente y resolver el caso.', 'pendiente', 3),
  ('Generar reporte mensual', 'Consolidar ventas del mes.', 'completada', 1);

-- Solicitudes PQRS de ejemplo (tabla nueva: siempre se insertan).
INSERT INTO pqrs (type, description, status) VALUES
  ('sugerencia', 'Implementar búsqueda rápida de productos.', 'en_proceso'),
  ('reclamo', 'El monitor llegó con un píxel dañado.', 'abierta'),
  ('peticion', 'Solicitar información sobre garantías.', 'cerrada');
