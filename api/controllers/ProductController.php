<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

function product_row(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'nombre' => $row['nombre'],
        'categoria' => $row['categoria'],
        'descripcion' => $row['descripcion'],
        'precio_costo' => (float) $row['precio_costo'],
        'precio_venta' => (float) $row['precio_venta'],
        'tallas' => json_decode($row['tallas'], true) ?: [],
        'color' => $row['color'],
        'stock' => (int) $row['stock'],
        'stock_minimo' => (int) $row['stock_minimo'],
        'imagen' => $row['imagen'],
    ];
}

function products_index(): void
{
    $stmt = database()->query('SELECT * FROM productos ORDER BY id DESC');
    json_response(array_map('product_row', $stmt->fetchAll()));
}

function products_store(): void
{
    $data = read_json();
    required_fields($data, ['nombre', 'categoria', 'descripcion', 'precio_costo', 'precio_venta', 'color']);

    if ((float) $data['precio_venta'] <= (float) $data['precio_costo']) {
        json_response(['message' => 'El precio de venta debe ser mayor al precio de costo.'], 422);
    }

    $pdo = database();
    $stmt = $pdo->prepare(
        'INSERT INTO productos (nombre, categoria, descripcion, precio_costo, precio_venta, tallas, color, stock, stock_minimo, imagen)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        trim($data['nombre']),
        $data['categoria'],
        trim($data['descripcion']),
        (float) $data['precio_costo'],
        (float) $data['precio_venta'],
        json_encode($data['tallas'] ?? []),
        $data['color'],
        (int) ($data['stock'] ?? 0),
        (int) ($data['stock_minimo'] ?? 0),
        $data['imagen'] ?? null,
    ]);

    products_show((int) $pdo->lastInsertId());
}

function products_show(int $id): void
{
    $stmt = database()->prepare('SELECT * FROM productos WHERE id = ?');
    $stmt->execute([$id]);
    $product = $stmt->fetch();

    if (!$product) {
        json_response(['message' => 'Producto no encontrado.'], 404);
    }

    json_response(product_row($product));
}

function products_update(int $id): void
{
    $data = read_json();
    required_fields($data, ['nombre', 'categoria', 'descripcion', 'precio_costo', 'precio_venta', 'color']);

    if ((float) $data['precio_venta'] <= (float) $data['precio_costo']) {
        json_response(['message' => 'El precio de venta debe ser mayor al precio de costo.'], 422);
    }

    $stmt = database()->prepare(
        'UPDATE productos
         SET nombre = ?, categoria = ?, descripcion = ?, precio_costo = ?, precio_venta = ?, tallas = ?, color = ?, stock = ?, stock_minimo = ?, imagen = ?
         WHERE id = ?'
    );
    $stmt->execute([
        trim($data['nombre']),
        $data['categoria'],
        trim($data['descripcion']),
        (float) $data['precio_costo'],
        (float) $data['precio_venta'],
        json_encode($data['tallas'] ?? []),
        $data['color'],
        (int) ($data['stock'] ?? 0),
        (int) ($data['stock_minimo'] ?? 0),
        $data['imagen'] ?? null,
        $id,
    ]);

    products_show($id);
}

function products_destroy(int $id): void
{
    $stmt = database()->prepare('DELETE FROM productos WHERE id = ?');
    $stmt->execute([$id]);
    json_response(['message' => 'Producto eliminado correctamente.']);
}
