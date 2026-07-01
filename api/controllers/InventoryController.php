<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

function inventory_product_row(array $row): array
{
    $sizes = json_decode($row['tallas'], true) ?: [];

    return [
        'id' => (int) $row['id'],
        'producto_id' => (int) $row['id'],
        'producto' => $row['nombre'],
        'categoria' => $row['categoria'],
        'talla' => implode(', ', $sizes),
        'color' => $row['color'],
        'stock_actual' => (int) $row['stock'],
        'stock_minimo' => (int) $row['stock_minimo'],
    ];
}

function inventory_entry_row(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'fecha' => $row['fecha'],
        'proveedor' => $row['proveedor'],
        'producto_id' => (int) $row['producto_id'],
        'producto' => $row['producto'],
        'talla' => $row['talla'],
        'color' => $row['color'],
        'cantidad' => (int) $row['cantidad'],
        'precio_costo' => (float) $row['precio_costo'],
        'numero_factura' => $row['numero_factura'],
        'notas' => $row['notas'] ?? '',
    ];
}

function inventory_products_index(): void
{
    $stmt = database()->query('SELECT * FROM productos ORDER BY nombre ASC');
    json_response(array_map('inventory_product_row', $stmt->fetchAll()));
}

function inventory_entries_index(): void
{
    $stmt = database()->query(
        'SELECT ingresos_inventario.*, productos.nombre AS producto
         FROM ingresos_inventario
         INNER JOIN productos ON productos.id = ingresos_inventario.producto_id
         ORDER BY ingresos_inventario.fecha DESC, ingresos_inventario.id DESC'
    );
    json_response(array_map('inventory_entry_row', $stmt->fetchAll()));
}

function inventory_entries_store(): void
{
    $data = read_json();
    required_fields($data, ['fecha', 'proveedor', 'producto_id', 'talla', 'color', 'cantidad', 'precio_costo', 'numero_factura']);

    if ((int) $data['cantidad'] <= 0) {
        json_response(['message' => 'La cantidad debe ser mayor a 0.'], 422);
    }

    if ((float) $data['precio_costo'] <= 0) {
        json_response(['message' => 'El precio de costo debe ser mayor a 0.'], 422);
    }

    $pdo = database();
    $pdo->beginTransaction();

    try {
        $stmt = $pdo->prepare(
            'INSERT INTO ingresos_inventario (fecha, proveedor, producto_id, talla, color, cantidad, precio_costo, numero_factura, notas)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['fecha'],
            trim($data['proveedor']),
            (int) $data['producto_id'],
            $data['talla'],
            $data['color'],
            (int) $data['cantidad'],
            (float) $data['precio_costo'],
            trim($data['numero_factura']),
            trim($data['notas'] ?? ''),
        ]);

        $entryId = (int) $pdo->lastInsertId();

        $updateStock = $pdo->prepare('UPDATE productos SET stock = stock + ?, precio_costo = ? WHERE id = ?');
        $updateStock->execute([(int) $data['cantidad'], (float) $data['precio_costo'], (int) $data['producto_id']]);

        $pdo->commit();
    } catch (Throwable $error) {
        $pdo->rollBack();
        throw $error;
    }

    inventory_entries_show($entryId);
}

function inventory_entries_show(int $id): void
{
    $stmt = database()->prepare(
        'SELECT ingresos_inventario.*, productos.nombre AS producto
         FROM ingresos_inventario
         INNER JOIN productos ON productos.id = ingresos_inventario.producto_id
         WHERE ingresos_inventario.id = ?'
    );
    $stmt->execute([$id]);
    $entry = $stmt->fetch();

    if (!$entry) {
        json_response(['message' => 'Ingreso de inventario no encontrado.'], 404);
    }

    json_response(inventory_entry_row($entry));
}
