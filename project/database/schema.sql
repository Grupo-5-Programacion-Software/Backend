-- Esquema de la base de datos: inventario_adso
-- Ejecutar una sola vez: mysql -u root -p < project/database/schema.sql
-- (Es idempotente: puede volver a ejecutarse sin duplicar datos)

CREATE DATABASE IF NOT EXISTS inventario_adso;
USE inventario_adso;

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos (relación 1:N con categorías)
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Datos iniciales de categorías
INSERT INTO categories (id, name) VALUES
  (1, 'Computadoras y Laptops'),
  (2, 'Periféricos y Accesorios'),
  (3, 'Audio y Video'),
  (4, 'Componentes de PC'),
  (5, 'Mobiliario y Ergonomía'),
  (6, 'Redes y Conectividad'),
  (7, 'Dispositivos Inteligentes')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Datos iniciales de productos
INSERT INTO products (id, name, price, category_id) VALUES
  (1, 'Laptop Pro 15', 1200, 1),
  (2, 'Mouse Inalámbrico', 25, 2),
  (3, 'Teclado Mecánico RGB', 85, 2),
  (4, "Monitor 27' 4K", 350, 2),
  (5, 'Audífonos Noise Cancelling', 150, 3),
  (6, 'Webcam Full HD', 60, 3),
  (7, 'Impresora Multifuncional', 180, 2),
  (8, 'Disco Duro Externo 2TB', 90, 4),
  (9, 'Memoria RAM 16GB DDR4', 75, 4),
  (10, 'Tarjeta de Video RTX 3060', 420, 4),
  (11, 'Microscopio Digital USB', 45, 7),
  (12, 'Silla Ergonómica Gamer', 210, 5),
  (13, 'Escritorio Elevable', 300, 5),
  (14, 'Router Wi-Fi 6', 110, 6),
  (15, 'Tableta Gráfica', 130, 2),
  (16, 'Smartphone de Pruebas', 250, 7),
  (17, 'Smartwatch Deportivo', 95, 7),
  (18, 'Cargador USB-C 65W', 35, 2),
  (19, 'Hub USB-C 7 en 1', 50, 2),
  (20, 'Parlante Bluetooth Portátil', 40, 3)
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), category_id = VALUES(category_id);

-- ==========================================================
-- TABLA DE USUARIOS
-- ==========================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- TABLA DE TAREAS (asignadas a un usuario)
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
-- TABLA DE PQRS
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

-- Datos iniciales de usuarios
INSERT INTO users (id, name, email) VALUES
  (1, 'Ana Torres', 'ana.torres@mail.com'),
  (2, 'Carlos Gómez', 'carlos.gomez@mail.com'),
  (3, 'María López', 'maria.lopez@mail.com'),
  (4, 'Juan Pérez', 'juan.perez@mail.com'),
  (5, 'Laura Martínez', 'laura.martinez@mail.com')
ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email);

-- Datos iniciales de tareas (asignadas a los usuarios anteriores)
INSERT INTO tasks (id, title, description, status, user_id) VALUES
  (1, 'Revisar inventario de periféricos', 'Verificar stock de mouse y teclados.', 'en_progreso', 2),
  (2, 'Actualizar precios de laptops', 'Revisar listas y aplicar nuevos precios.', 'pendiente', 1),
  (3, 'Atender reclamo de envío', 'Contactar al cliente y resolver el caso.', 'pendiente', 3),
  (4, 'Generar reporte mensual', 'Consolidar ventas del mes.', 'completada', 4)
ON DUPLICATE KEY UPDATE title = VALUES(title), status = VALUES(status), user_id = VALUES(user_id);

-- Datos iniciales de PQRS
INSERT INTO pqrs (id, type, description, status) VALUES
  (1, 'sugerencia', 'Implementar búsqueda rápida de productos.', 'en_proceso'),
  (2, 'reclamo', 'El monitor llegó con un píxel dañado.', 'abierta'),
  (3, 'peticion', 'Solicitar información sobre garantías.', 'cerrada')
ON DUPLICATE KEY UPDATE type = VALUES(type), description = VALUES(description), status = VALUES(status);
