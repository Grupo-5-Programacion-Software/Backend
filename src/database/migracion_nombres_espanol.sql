USE inventario_adso;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 1) ELIMINAR TABLAS VIEJAS REDUNDANTES (sistema anterior)
--    Estas tablas no las usa el backend actual y duplican
--    la información que ya existe en products / categories.
-- ============================================================
DROP TABLE IF EXISTS detalle_ventas;
DROP TABLE IF EXISTS movimientos_inventario;
DROP TABLE IF EXISTS ventas;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS usuarios;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 2) RENOMBRAR TABLAS A ESPAÑOL (las que usa el backend)
-- ============================================================
ALTER TABLE categories RENAME TO categorias;
ALTER TABLE categorias
  ADD COLUMN description TEXT NULL AFTER name,
  ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

ALTER TABLE products RENAME TO productos;
ALTER TABLE productos
  ADD COLUMN code VARCHAR(50) NULL AFTER name,
  ADD COLUMN description TEXT NULL AFTER code,
  ADD COLUMN stock INT NOT NULL DEFAULT 0 AFTER price,
  ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1 AFTER category_id,
  ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- Los productos existentes no tenían código: se genera PRD-NNN para
-- que la tabla cumpla la regla NOT NULL que exige el backend.
UPDATE productos SET code = CONCAT('PRD-', LPAD(id, 3, '0')) WHERE code IS NULL;
ALTER TABLE productos MODIFY code VARCHAR(50) NOT NULL;

-- ============================================================
-- 3) CREAR TABLAS FALTANTES EN ESPAÑOL (estructura del backend)
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tareas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status ENUM('pendiente', 'en_progreso', 'completada') DEFAULT 'pendiente',
  user_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS pqrs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('peticion', 'queja', 'reclamo', 'sugerencia') NOT NULL,
  description TEXT NOT NULL,
  status ENUM('abierta', 'en_proceso', 'cerrada') DEFAULT 'abierta',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4) DATOS SEMILLA (solo para las tablas nuevas)
-- ============================================================
INSERT IGNORE INTO usuarios (id, name, email, password) VALUES
  (1, 'Lucia Lizcano', 'lulizcano.aa@hotmail.com', 'cambiar123'),
  (2, 'Juan Perez', 'juan@gmail.com', 'cambiar123'),
  (3, 'Prueba', 'prueba@gmail.com', 'cambiar123');

INSERT INTO tareas (title, description, status, user_id) VALUES
  ('Revisar inventario de periféricos', 'Verificar stock de mouse y teclados.', 'en_progreso', 2),
  ('Actualizar precios de laptops', 'Revisar listas y aplicar nuevos precios.', 'pendiente', 1),
  ('Atender reclamo de envío', 'Contactar al cliente y resolver el caso.', 'pendiente', 3),
  ('Generar reporte mensual', 'Consolidar ventas del mes.', 'completada', 1);

INSERT INTO pqrs (type, description, status) VALUES
  ('sugerencia', 'Implementar búsqueda rápida de productos.', 'en_proceso'),
  ('reclamo', 'El monitor llegó con un píxel dañado.', 'abierta'),
  ('peticion', 'Solicitar información sobre garantías.', 'cerrada');
