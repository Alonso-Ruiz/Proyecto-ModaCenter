<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

function sale_number(PDO $pdo): string
{
    $next = (int) $pdo->query('SELECT COALESCE(MAX(id), 0) + 1 FROM ventas')->fetchColumn();
    return '#' . str_pad((string) $next, 4, '0', STR_PAD_LEFT);
}

function sale_row(PDO $pdo, array $row): array
{
    $detailStmt = $pdo->prepare(
        'SELECT venta_detalles.*, productos.nombre AS producto
         FROM venta_detalles
         INNER JOIN productos ON productos.id = venta_detalles.producto_id
         WHERE venta_id = ?'
    );
    $detailStmt->execute([(int) $row['id']]);
    $details = $detailStmt->fetchAll();

    return [
        'id' => (int) $row['id'],
        'numero_venta' => $row['numero_venta'],
        'fecha' => $row['fecha'],
        'total' => (float) $row['total'],
        'metodo_pago' => $row['metodo_pago'],
        'estado' => $row['estado'],
        'vendedor_nombre' => $row['vendedor_nombre'] ?? '',
        'productos' => implode(', ', array_map(function ($item) {
            return $item['producto'] . ' x' . $item['cantidad'];
        }, $details)),
        'detalles' => array_map(function ($item) {
            return [
                'id' => (int) $item['id'],
                'producto_id' => (int) $item['producto_id'],
                'producto' => $item['producto'],
                'cantidad' => (int) $item['cantidad'],
                'precio_unitario' => (float) $item['precio_unitario'],
                'subtotal' => (float) $item['subtotal'],
            ];
        }, $details),
    ];
}

function sales_index(): void
{
    $conditions = [];
    $values = [];

    if (!empty($_GET['desde'])) {
        $conditions[] = 'ventas.fecha >= ?';
        $values[] = $_GET['desde'];
    }

    if (!empty($_GET['hasta'])) {
        $conditions[] = 'ventas.fecha <= ?';
        $values[] = $_GET['hasta'];
    }

    if (!empty($_GET['buscar'])) {
        $conditions[] = 'ventas.numero_venta LIKE ?';
        $values[] = '%' . $_GET['buscar'] . '%';
    }

    $where = $conditions ? 'WHERE ' . implode(' AND ', $conditions) : '';
    $pdo = database();
    $stmt = $pdo->prepare(
        "SELECT ventas.*, usuarios.nombre AS vendedor_nombre
         FROM ventas
         LEFT JOIN usuarios ON usuarios.id = ventas.vendedor_id
         {$where}
         ORDER BY ventas.fecha DESC, ventas.id DESC"
    );
    $stmt->execute($values);

    json_response(array_map(function ($row) use ($pdo) {
        return sale_row($pdo, $row);
    }, $stmt->fetchAll()));
}

function sales_store(): void
{
    $data = read_json();
    required_fields($data, ['metodo_pago']);

    if (empty($data['items']) || !is_array($data['items'])) {
        json_response(['message' => 'Agrega productos al carrito.'], 422);
    }

    $pdo = database();
    $pdo->beginTransaction();

    try {
        $total = 0;
        $items = [];

        foreach ($data['items'] as $item) {
            $productStmt = $pdo->prepare('SELECT id, nombre, categoria, stock FROM productos WHERE id = ? FOR UPDATE');
            $productStmt->execute([(int) $item['producto_id']]);
            $product = $productStmt->fetch();

            if (!$product) {
                json_response(['message' => 'Producto no encontrado.'], 404);
            }

            $quantity = (int) $item['cantidad'];
            $unitPrice = (float) $item['precio_unitario'];

            if ($quantity <= 0 || $unitPrice <= 0) {
                json_response(['message' => 'Cantidad y precio deben ser mayores a 0.'], 422);
            }

            if ((int) $product['stock'] < $quantity) {
                json_response(['message' => 'Stock insuficiente para ' . $product['nombre'] . '.'], 422);
            }

            $subtotal = $quantity * $unitPrice;
            $total += $subtotal;
            $items[] = [$product, $quantity, $unitPrice, $subtotal];
        }

        $number = sale_number($pdo);
        $saleStmt = $pdo->prepare(
            'INSERT INTO ventas (numero_venta, fecha, vendedor_id, total, metodo_pago, estado)
             VALUES (?, CURDATE(), ?, ?, ?, "Completado")'
        );
        $saleStmt->execute([$number, $data['vendedor_id'] ?? null, $total, $data['metodo_pago']]);
        $saleId = (int) $pdo->lastInsertId();

        $detailStmt = $pdo->prepare(
            'INSERT INTO venta_detalles (venta_id, producto_id, cantidad, precio_unitario, subtotal)
             VALUES (?, ?, ?, ?, ?)'
        );
        $stockStmt = $pdo->prepare('UPDATE productos SET stock = stock - ? WHERE id = ?');

        foreach ($items as [$product, $quantity, $unitPrice, $subtotal]) {
            $detailStmt->execute([$saleId, (int) $product['id'], $quantity, $unitPrice, $subtotal]);
            $stockStmt->execute([$quantity, (int) $product['id']]);
        }

        $reportStmt = $pdo->prepare(
            'INSERT INTO reportes_ventas (fecha, numero_venta, categoria, total, metodo_pago, estado, notas)
             VALUES (CURDATE(), ?, ?, ?, ?, "Completado", ?)'
        );
        $reportStmt->execute([$number, 'Venta', $total, $data['metodo_pago'], 'Venta generada desde punto de venta']);

        $pdo->commit();
    } catch (Throwable $error) {
        $pdo->rollBack();
        throw $error;
    }

    sales_show($saleId);
}

function sales_show(int $id): void
{
    $pdo = database();
    $stmt = $pdo->prepare(
        'SELECT ventas.*, usuarios.nombre AS vendedor_nombre
         FROM ventas
         LEFT JOIN usuarios ON usuarios.id = ventas.vendedor_id
         WHERE ventas.id = ?'
    );
    $stmt->execute([$id]);
    $sale = $stmt->fetch();

    if (!$sale) {
        json_response(['message' => 'Venta no encontrada.'], 404);
    }

    json_response(sale_row($pdo, $sale));
}
