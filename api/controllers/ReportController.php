<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

function report_row(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'fecha' => $row['fecha'],
        'numero_venta' => $row['numero_venta'],
        'categoria' => $row['categoria'],
        'total' => (float) $row['total'],
        'metodo_pago' => $row['metodo_pago'],
        'estado' => $row['estado'],
        'notas' => $row['notas'] ?? '',
    ];
}

function reports_index(): void
{
    $conditions = ['ventas.estado = "Completado"'];
    $values = [];

    if (!empty($_GET['desde'])) {
        $conditions[] = 'ventas.fecha >= ?';
        $values[] = $_GET['desde'];
    }

    if (!empty($_GET['hasta'])) {
        $conditions[] = 'ventas.fecha <= ?';
        $values[] = $_GET['hasta'];
    }

    if (!empty($_GET['categoria'])) {
        $conditions[] = 'productos.categoria = ?';
        $values[] = $_GET['categoria'];
    }

    $where = 'WHERE ' . implode(' AND ', $conditions);
    $stmt = database()->prepare(
        "SELECT ventas.id,
                ventas.fecha,
                ventas.numero_venta,
                GROUP_CONCAT(DISTINCT productos.categoria ORDER BY productos.categoria SEPARATOR ', ') AS categoria,
                ventas.total,
                ventas.metodo_pago,
                ventas.estado,
                '' AS notas
         FROM ventas
         INNER JOIN venta_detalles ON venta_detalles.venta_id = ventas.id
         INNER JOIN productos ON productos.id = venta_detalles.producto_id
         {$where}
         GROUP BY ventas.id
         ORDER BY ventas.fecha DESC, ventas.id DESC"
    );
    $stmt->execute($values);

    json_response(array_map('report_row', $stmt->fetchAll()));
}

function reports_metrics(): void
{
    $conditions = ['ventas.estado = "Completado"'];
    $values = [];

    if (!empty($_GET['desde'])) {
        $conditions[] = 'ventas.fecha >= ?';
        $values[] = $_GET['desde'];
    }

    if (!empty($_GET['hasta'])) {
        $conditions[] = 'ventas.fecha <= ?';
        $values[] = $_GET['hasta'];
    }

    if (!empty($_GET['categoria'])) {
        $conditions[] = 'productos.categoria = ?';
        $values[] = $_GET['categoria'];
    }

    $where = 'WHERE ' . implode(' AND ', $conditions);
    $pdo = database();

    $byDate = $pdo->prepare(
        "SELECT ventas.fecha AS label, COALESCE(SUM(venta_detalles.subtotal), 0) AS total
         FROM venta_detalles
         INNER JOIN ventas ON ventas.id = venta_detalles.venta_id
         INNER JOIN productos ON productos.id = venta_detalles.producto_id
         {$where}
         GROUP BY ventas.fecha
         ORDER BY ventas.fecha ASC"
    );
    $byDate->execute($values);

    $byCategory = $pdo->prepare(
        "SELECT productos.categoria AS label, COALESCE(SUM(venta_detalles.subtotal), 0) AS total
         FROM venta_detalles
         INNER JOIN ventas ON ventas.id = venta_detalles.venta_id
         INNER JOIN productos ON productos.id = venta_detalles.producto_id
         {$where}
         GROUP BY productos.categoria
         ORDER BY total DESC"
    );
    $byCategory->execute($values);

    $bestProducts = $pdo->prepare(
        "SELECT productos.nombre AS label, COALESCE(SUM(venta_detalles.cantidad), 0) AS total
         FROM venta_detalles
         INNER JOIN ventas ON ventas.id = venta_detalles.venta_id
         INNER JOIN productos ON productos.id = venta_detalles.producto_id
         {$where}
         GROUP BY productos.id, productos.nombre
         ORDER BY total DESC
         LIMIT 6"
    );
    $bestProducts->execute($values);

    json_response([
        'byDate' => $byDate->fetchAll(),
        'byCategory' => $byCategory->fetchAll(),
        'bestProducts' => $bestProducts->fetchAll(),
    ]);
}

function reports_store(): void
{
    $data = read_json();
    required_fields($data, ['fecha', 'numero_venta', 'categoria', 'total', 'metodo_pago', 'estado']);

    if ((float) $data['total'] <= 0) {
        json_response(['message' => 'El total debe ser mayor a 0.'], 422);
    }

    $pdo = database();
    $stmt = $pdo->prepare(
        'INSERT INTO reportes_ventas (fecha, numero_venta, categoria, total, metodo_pago, estado, notas)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );

    try {
        $stmt->execute([
            $data['fecha'],
            trim($data['numero_venta']),
            $data['categoria'],
            (float) $data['total'],
            $data['metodo_pago'],
            $data['estado'],
            trim($data['notas'] ?? ''),
        ]);
    } catch (PDOException $error) {
        if ($error->getCode() === '23000') {
            json_response(['message' => 'Este numero de venta ya existe.'], 409);
        }
        throw $error;
    }

    reports_show((int) $pdo->lastInsertId());
}

function reports_show(int $id): void
{
    $stmt = database()->prepare('SELECT * FROM reportes_ventas WHERE id = ?');
    $stmt->execute([$id]);
    $report = $stmt->fetch();

    if (!$report) {
        json_response(['message' => 'Reporte no encontrado.'], 404);
    }

    json_response(report_row($report));
}

function reports_update(int $id): void
{
    $data = read_json();
    required_fields($data, ['fecha', 'numero_venta', 'categoria', 'total', 'metodo_pago', 'estado']);

    if ((float) $data['total'] <= 0) {
        json_response(['message' => 'El total debe ser mayor a 0.'], 422);
    }

    $stmt = database()->prepare(
        'UPDATE reportes_ventas
         SET fecha = ?, numero_venta = ?, categoria = ?, total = ?, metodo_pago = ?, estado = ?, notas = ?
         WHERE id = ?'
    );

    try {
        $stmt->execute([
            $data['fecha'],
            trim($data['numero_venta']),
            $data['categoria'],
            (float) $data['total'],
            $data['metodo_pago'],
            $data['estado'],
            trim($data['notas'] ?? ''),
            $id,
        ]);
    } catch (PDOException $error) {
        if ($error->getCode() === '23000') {
            json_response(['message' => 'Este numero de venta ya existe.'], 409);
        }
        throw $error;
    }

    reports_show($id);
}

function reports_destroy(int $id): void
{
    $stmt = database()->prepare('DELETE FROM reportes_ventas WHERE id = ?');
    $stmt->execute([$id]);
    json_response(['message' => 'Reporte eliminado correctamente.']);
}
