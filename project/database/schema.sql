-- Esquema de la base de datos: backend_actividad2
-- Ejecutar una sola vez: mysql -u root -p < project/database/schema.sql

CREATE DATABASE IF NOT EXISTS backend_actividad2;
USE backend_actividad2;

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
