CREATE DATABASE IF NOT EXISTS modacenter
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE modacenter;

CREATE TABLE IF NOT EXISTS productos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(70) NOT NULL,
  categoria VARCHAR(40) NOT NULL,
  descripcion TEXT NOT NULL,
  precio_costo DECIMAL(10, 2) NOT NULL,
  precio_venta DECIMAL(10, 2) NOT NULL,
  tallas JSON NOT NULL,
  color VARCHAR(40) NOT NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  stock_minimo INT UNSIGNED NOT NULL DEFAULT 0,
  imagen LONGTEXT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_precio_venta_mayor_costo CHECK (precio_venta > precio_costo)
);

CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(120) NOT NULL,
  telefono VARCHAR(30) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('Administrador', 'Vendedor') NOT NULL DEFAULT 'Vendedor',
  estado ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo',
  ventas_mes DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_usuarios_correo (correo)
);

INSERT INTO usuarios (nombre, correo, telefono, password_hash, rol, estado, ventas_mes)
SELECT 'Administrador ModaCenter', 'admin@modacenter.pe', '000-000', '$2y$10$9H8k6EOePz9H9e7n1v3oGutwbIAWPbTH0LEwJuxO6oicFzYdtttoK', 'Administrador', 'Activo', 0.00
WHERE NOT EXISTS (
  SELECT 1 FROM usuarios WHERE correo = 'admin@modacenter.pe'
);

INSERT INTO usuarios (nombre, correo, telefono, password_hash, rol, estado, ventas_mes)
SELECT 'Carlos Vega', 'vendedor@modacenter.pe', '987-654', '$2y$10$9H8k6EOePz9H9e7n1v3oGutwbIAWPbTH0LEwJuxO6oicFzYdtttoK', 'Vendedor', 'Activo', 0.00
WHERE NOT EXISTS (
  SELECT 1 FROM usuarios WHERE correo = 'vendedor@modacenter.pe'
);

CREATE TABLE IF NOT EXISTS ingresos_inventario (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL,
  proveedor VARCHAR(120) NOT NULL,
  producto_id INT UNSIGNED NOT NULL,
  talla VARCHAR(20) NOT NULL,
  color VARCHAR(40) NOT NULL,
  cantidad INT UNSIGNED NOT NULL,
  precio_costo DECIMAL(10, 2) NOT NULL,
  numero_factura VARCHAR(60) NOT NULL,
  notas TEXT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ingresos_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS reportes_ventas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL,
  numero_venta VARCHAR(40) NOT NULL,
  categoria VARCHAR(40) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  metodo_pago ENUM('Efectivo', 'Tarjeta', 'Yape', 'Plin', 'Transferencia') NOT NULL DEFAULT 'Efectivo',
  estado ENUM('Completado', 'Pendiente', 'Anulado') NOT NULL DEFAULT 'Completado',
  notas TEXT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_reportes_numero_venta (numero_venta)
);

CREATE TABLE IF NOT EXISTS ventas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  numero_venta VARCHAR(40) NOT NULL,
  fecha DATE NOT NULL,
  vendedor_id INT UNSIGNED NULL,
  total DECIMAL(10, 2) NOT NULL,
  metodo_pago ENUM('Efectivo', 'Tarjeta', 'Yape', 'Plin', 'Transferencia') NOT NULL DEFAULT 'Efectivo',
  estado ENUM('Completado', 'Anulado') NOT NULL DEFAULT 'Completado',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ventas_numero_venta (numero_venta),
  CONSTRAINT fk_ventas_vendedor FOREIGN KEY (vendedor_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS venta_detalles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  venta_id INT UNSIGNED NOT NULL,
  producto_id INT UNSIGNED NOT NULL,
  cantidad INT UNSIGNED NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_detalle_venta FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
  CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
);
